from ai.llm import ask_gemini_structured
from services.cache_manager import make_cache_key, load_from_cache, save_to_cache
from ai.schemas import ResumeSchema

RESUME_SCHEMA_PROMPT = """
You are a resume parsing assistant. Extract structured information from the resume text below.

Rules:
- Only extract information explicitly present in the resume text.
- Do not invent or infer anything not stated.
- If a field isn't found, leave it as an empty string or empty list.

Resume text:
\"\"\"
{resume_text}
\"\"\"
"""


def analyze_resume(resume_text: str) -> dict:
    # 1. Create a unique key for this exact resume text
    cache_key = make_cache_key("resume", resume_text)
    
    # 2. Check the cache first
    cached_result = load_from_cache(cache_key)
    if cached_result:
        print("[CACHE HIT] Loaded structured resume from cache!")
        return cached_result
    
    # 3. Cache Miss: We actually need to ask Gemini
    print("[CACHE MISS] Calling Gemini to parse resume...")
    prompt = RESUME_SCHEMA_PROMPT.format(resume_text=resume_text)
    result = ask_gemini_structured(prompt, response_schema=ResumeSchema)
    
    # 4. Save to cache so we never have to parse this exact resume again
    if result:
        save_to_cache(cache_key, result)
        
    return result
