from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database import SessionLocal
from ..models import Log
from ..schemas import LogCreate, LogResponse
from ..detector import detector

router = APIRouter(prefix="/logs", tags=["Logs"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=List[LogResponse], status_code=status.HTTP_201_CREATED)
def create_logs(logs_in: List[LogCreate], db: Session = Depends(get_db)):
    raw_logs = [log.model_dump() for log in logs_in]
    
    # Run Isolation Forest algorithm
    processed_logs = detector.predict(raw_logs)
    
    db_logs = []
    for log_data in processed_logs:
        db_log = Log(**log_data)
        db.add(db_log)
        db_logs.append(db_log)
        
    db.commit()
    for db_log in db_logs:
        db.refresh(db_log)
        
    return db_logs

@router.get("/", response_model=List[LogResponse])
def get_logs(db: Session = Depends(get_db)):
    return db.query(Log).all()