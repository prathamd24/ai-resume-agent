import json
import hashlib
import os
import time

# We store cache files in a directory at the root of the backend
CACHE_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "cache")

def _ensure_cache_dir():
    """Ensure the cache directory exists."""
    if not os.path.exists(CACHE_DIR):
        os.makedirs(CACHE_DIR)

def make_cache_key(namespace: str, *texts: str) -> str:
    """Creates a SHA-256 hash key from the namespace and input texts."""
    combined_text = "".join(texts)
    hasher = hashlib.sha256()
    hasher.update(f"{namespace}:{combined_text}".encode('utf-8'))
    return f"{namespace}_{hasher.hexdigest()}"

def load_from_cache(key: str) -> dict | None:
    """Loads a JSON dictionary from the cache if it exists, else None."""
    _ensure_cache_dir()
    filepath = os.path.join(CACHE_DIR, f"{key}.json")
    if os.path.exists(filepath):
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                return json.load(f)
        except json.JSONDecodeError:
            return None # If file is corrupted, pretend it's a miss
    return None

def cleanup_old_cache(days: int = 7):
    """Deletes cache files older than the specified number of days."""
    _ensure_cache_dir()
    now = time.time()
    cutoff = now - (days * 86400) # 86400 seconds in a day
    
    for filename in os.listdir(CACHE_DIR):
        if filename.endswith(".json"):
            filepath = os.path.join(CACHE_DIR, filename)
            # If the file was modified before the cutoff time, delete it
            if os.path.getmtime(filepath) < cutoff:
                try:
                    os.remove(filepath)
                except OSError:
                    pass

def save_to_cache(key: str, data: dict) -> None:
    """Saves a dictionary to the cache and cleans up old files."""
    _ensure_cache_dir()
    
    # Automatically clean up files older than 7 days every time we save a new one!
    cleanup_old_cache(days=7) 
    
    filepath = os.path.join(CACHE_DIR, f"{key}.json")
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
