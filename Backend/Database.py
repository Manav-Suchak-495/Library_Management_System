# database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

# Update with your Postgres credentials: postgresql://username:password@localhost:5173/db_name
DATABASE_URL = "postgresql://manav_21:@localhost:5432/lms_db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency to yield a database session per API request and safely close it after
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()