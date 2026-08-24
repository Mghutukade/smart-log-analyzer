from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .models import Log
from .routes import logs

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Smart Log Analyzer")

# Allow requests from React frontend (typically runs on port 3000 or 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For hackathon MVP; restricts allowed origins in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(logs.router)

@app.get("/")
def root():
    return {"message": "Smart Log Analyzer API is running"}