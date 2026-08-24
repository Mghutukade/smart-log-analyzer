from sqlalchemy import Column, Integer, String, DateTime, Boolean, Float, Text
from .database import Base


class Log(Base):
    __tablename__ = "logs"

    id = Column(Integer, primary_key=True, index=True)

    timestamp = Column(DateTime, nullable=False)
    event_type = Column(String, nullable=False)
    severity = Column(String, nullable=False)
    source = Column(String, nullable=False)
    message = Column(Text, nullable=True)

    is_anomaly = Column(Boolean, default=False)
    anomaly_score = Column(Float, nullable=True)

    ai_explanation = Column(Text, nullable=True)
    root_cause = Column(Text, nullable=True)
    next_step = Column(Text, nullable=True)