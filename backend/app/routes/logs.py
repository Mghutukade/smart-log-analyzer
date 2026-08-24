from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import datetime
from ..database import get_db
from ..models import Log
from ..schemas import LogCreate, LogResponse
from ..detector import LogDetector

router = APIRouter(prefix="/logs", tags=["logs"])
detector = LogDetector()

@router.get("/", response_model=List[LogResponse])
def read_logs(db: Session = Depends(get_db)):
    return db.query(Log).order_by(Log.id.desc()).all()

@router.post("/", response_model=List[LogResponse])
def create_logs(items: List[LogCreate], db: Session = Depends(get_db)):
    created = []
    for item in items:
        log_data = item.model_dump()
        if not log_data.get("timestamp"):
            log_data["timestamp"] = datetime.datetime.utcnow()
            
        analysis = detector.analyze(log_data)
        
        db_log = Log(
            timestamp=log_data["timestamp"],
            event_type=log_data["event_type"],
            severity=log_data["severity"],
            source=log_data["source"],
            message=log_data["message"],
            is_anomaly=analysis["is_anomaly"],
            anomaly_score=analysis["anomaly_score"]
        )
        db.add(db_log)
        db.commit()
        db.refresh(db_log)
        created.append(db_log)
    return created

@router.get("/{log_id}/explain")
def explain_log(log_id: int, db: Session = Depends(get_db)):
    log = db.query(Log).filter(Log.id == log_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Log entry not found")
    
    explanation = detector.explain(log)
    return {
        "id": log.id,
        "raw_message": log.message,
        "anomaly_score": log.anomaly_score,
        "is_anomaly": log.is_anomaly,
        "analysis": explanation
    }