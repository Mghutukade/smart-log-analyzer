from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class LogCreate(BaseModel):
    timestamp: Optional[datetime] = None
    source: str
    severity: str
    event_type: str
    message: str

class LogResponse(LogCreate):
    id: int
    is_anomaly: bool
    anomaly_score: float

    model_config = ConfigDict(from_attributes=True)