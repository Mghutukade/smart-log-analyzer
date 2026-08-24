from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Update with your actual PostgreSQL password and database name
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:maheshG39@localhost:5432/smart_logs"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# THIS WAS MISSING:
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()