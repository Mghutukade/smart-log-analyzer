from fastapi import FastAPI
from .database import Base, engine
from .models import Log
from .routes import logs

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Smart Log Analyzer")

# Fix the method name here:
app.include_router(logs.router)

@app.get("/")
def root():
    return {"message": "Smart Log Analyzer API is running"}