from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class LogBase(BaseModel):
    timestamp: datetime
    event_type: str
    severity: str
    source: str
    message: str

class LogCreate(LogBase):
    pass

class LogResponse(LogBase):
    id: int
    is_anomaly: bool
    anomaly_score: float

    class Config:
        from_attributes = True