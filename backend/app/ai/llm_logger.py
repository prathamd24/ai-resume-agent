import time
import logging
import json
import uuid

# Set up a clean console logger
logger = logging.getLogger("AgenticLLM")
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
# We remove the standard prefix because we want pure JSON output
handler.setFormatter(logging.Formatter('%(message)s'))
if not logger.handlers:
    logger.addHandler(handler)

def log_llm_call(model_name: str, start_time: float, attempt: int, response=None, error=None):
    """
    Provides trace-level observability for every AI call using structured JSON.
    Logs latency and token usage (cost).
    """
    latency_ms = int((time.time() - start_time) * 1000)
    trace_id = str(uuid.uuid4())[:8] # Unique ID for this specific API trace
    
    log_data = {
        "trace_id": trace_id,
        "event": "llm_call",
        "model": model_name,
        "attempt": attempt,
        "latency_ms": latency_ms
    }
    
    if error:
        log_data["status"] = "failed"
        log_data["error"] = str(error)
        logger.error(json.dumps(log_data))
    else:
        log_data["status"] = "success"
        
        # Extract token counts if available from the Google GenAI response
        log_data["tokens_in"] = 0
        log_data["tokens_out"] = 0
        
        if hasattr(response, 'usage_metadata') and response.usage_metadata:
            log_data["tokens_in"] = getattr(response.usage_metadata, 'prompt_token_count', 0)
            log_data["tokens_out"] = getattr(response.usage_metadata, 'candidates_token_count', 0)
            
        logger.info(json.dumps(log_data))

