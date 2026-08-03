from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    # API Keys
    gemini_api_key: str = ""
    
    # Project Info
    project_name: str = "AI Career Copilot"
    version: str = "0.1.0"
    
    # Tell Pydantic to automatically read from a .env file
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

@lru_cache()
def get_settings():
    """
    Returns a cached instance of the settings. 
    @lru_cache ensures we only read the .env file once when the app starts,
    rather than every time a function asks for a setting.
    """
    return Settings()
