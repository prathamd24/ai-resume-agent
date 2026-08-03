import time
import json
import httpx
from pydantic import BaseModel, ValidationError
from google import genai
from google.genai import errors, types
from core.config import get_settings
from ai.llm_logger import log_llm_call

MODEL_NAME = "gemini-2.5-flash"
_client = None

def _get_client():
    """Lazily initializes the Gemini client only when it is actually needed."""
    global _client
    if _client is None:
        settings = get_settings()
        _client = genai.Client(api_key=settings.gemini_api_key)
    return _client


def ask_gemini(prompt: str, max_retries: int = 3, delay_seconds: int = 5) -> str:
    """Sends a plain-text prompt to Gemini and returns the plain text response."""
    for attempt in range(1, max_retries + 1):
        start_time = time.time()
        try:
            response = _get_client().models.generate_content(
                model=MODEL_NAME,
                contents=prompt
            )
            log_llm_call(MODEL_NAME, start_time, attempt, response=response)
            return response.text
        except errors.ServerError as e:
            log_llm_call(MODEL_NAME, start_time, attempt, error=e)
            print(f"Attempt {attempt} failed: server overloaded (503). Retrying in {delay_seconds}s...")
            if attempt == max_retries:
                raise
            time.sleep(delay_seconds)
        except httpx.ConnectError as e:
            log_llm_call(MODEL_NAME, start_time, attempt, error=e)
            print(f"Attempt {attempt} failed: network/connection error. Retrying in {delay_seconds}s...")
            if attempt == max_retries:
                raise
            time.sleep(delay_seconds)


def ask_gemini_structured(prompt: str, response_schema: type[BaseModel], max_tokens: int = 8192, max_retries: int = 3, delay_seconds: int = 5) -> dict:
    """
    Sends a prompt to Gemini with Structured Outputs enabled using a Pydantic schema.
    """
    last_error = None

    for attempt in range(1, max_retries + 1):
        start_time = time.time()
        try:
            response = _get_client().models.generate_content(
                model=MODEL_NAME,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=response_schema,
                    max_output_tokens=max_tokens
                )
            )

            raw_output = response.text
            
            # Use Pydantic to strictly validate the JSON
            # This ensures we never pass a bad schema to the rest of the application
            parsed_model = response_schema.model_validate_json(raw_output)
            
            log_llm_call(MODEL_NAME, start_time, attempt, response=response)
            
            # Return it as a dict to keep the rest of the app working exactly the same
            return parsed_model.model_dump()

        except ValidationError as e:
            last_error = "Pydantic Schema Validation Error"
            log_llm_call(MODEL_NAME, start_time, attempt, error=last_error)
            print(f"Attempt {attempt} failed: Model hallucinated a bad schema. Retrying...")
            time.sleep(1)
            
        except json.JSONDecodeError as e:
            last_error = "JSON Decode Error"
            log_llm_call(MODEL_NAME, start_time, attempt, error=last_error)
            print(f"Attempt {attempt} failed: malformed JSON output. Retrying...")
            time.sleep(1)

        except errors.ServerError as e:
            last_error = "Server Error (503)"
            log_llm_call(MODEL_NAME, start_time, attempt, error=last_error)
            print(f"Attempt {attempt} failed: server overloaded. Retrying in {delay_seconds}s...")
            time.sleep(delay_seconds)

        except httpx.ConnectError as e:
            last_error = "Network Error"
            log_llm_call(MODEL_NAME, start_time, attempt, error=last_error)
            print(f"Attempt {attempt} failed: network/connection error. Retrying in {delay_seconds}s...")
            time.sleep(delay_seconds)

    raise RuntimeError(f"Failed to get valid structured JSON after {max_retries} attempts. Last error: {last_error}")
