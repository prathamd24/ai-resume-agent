import time
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from core.config import get_settings
from api.routes import checker, download


settings = get_settings()

app = FastAPI(
    title=settings.project_name,
    version=settings.version,
    description="Backend API for AI Career Copilot"
)

# Allow the frontend (React/Next.js) to communicate with this backend securely
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, this would be your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate Limiting Security Middleware 
# Simple in-memory tracker (IP Address -> List of Timestamps)
request_history = {}
RATE_LIMIT = 5 # Max requests
RATE_WINDOW = 60 # per 60 seconds
@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    # Only rate limit the /api/check endpoint (which costs API tokens)
    if request.url.path == "/api/check" and request.method == "POST":
        client_ip = request.client.host
        now = time.time()
        
        # Clean up old timestamps
        history = request_history.get(client_ip, [])
        history = [t for t in history if now - t < RATE_WINDOW]
        
        if len(history) >= RATE_LIMIT:
            return JSONResponse(
                status_code=429, 
                content={"detail": "Rate limit exceeded. Please wait a minute before analyzing another resume."}
            )
            
        history.append(now)
        request_history[client_ip] = history
        
    response = await call_next(request)
    return response
# ----------------------------------------------


# A simple health-check route to make sure the server is awake
@app.get("/")
def health_check():
    return {"status": "ok", "project": settings.project_name}

# --- We will connect our checker route here in the next step! ---

app.include_router(checker.router, prefix="/api", tags=["Checker"])
app.include_router(download.router, prefix="/api", tags=["Download"])

