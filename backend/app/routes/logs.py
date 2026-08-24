from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from app.database import get_db
from app.models import Log
from app.schemas import LogCreate, LogResponse
from app.detector import detector

router = APIRouter(prefix="/logs", tags=["Logs"])

@router.post("/", response_model=LogResponse)
def create_log(log_in: LogCreate, db: Session = Depends(get_db)):
    is_anomaly, anomaly_score = detector.predict(log_in.message, log_in.severity)
    
    # Use incoming timestamp if provided; otherwise fallback to current UTC time
    log_timestamp = log_in.timestamp if log_in.timestamp else datetime.now(timezone.utc)

    db_log = Log(
        timestamp=log_timestamp,
        source=log_in.source,
        severity=log_in.severity,
        event_type=log_in.event_type,
        message=log_in.message,
        is_anomaly=is_anomaly,
        anomaly_score=anomaly_score
    )
    
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

@router.get("/{log_id}/explain")
def explain_log(log_id: int, db: Session = Depends(get_db)):
    log = db.query(Log).filter(Log.id == log_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Log entry not found")
        
    explanation = detector.explain(log)
    return explanation