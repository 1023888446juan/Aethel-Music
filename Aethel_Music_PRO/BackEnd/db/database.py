# ============================================================
# AETHEL MUSIC
# DATABASE CONNECTION - SQLALCHEMY
# ============================================================

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from Core.config import settings


# ============================================================
# DATABASE ENGINE
# ============================================================

engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True
)


# ============================================================
# SESSION CONFIGURATION
# ============================================================

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


# ============================================================
# ORM BASE
# ============================================================

Base = declarative_base()


# ============================================================
# DATABASE SESSION DEPENDENCY
# ============================================================

def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# ============================================================
# END DATABASE CONNECTION
# ============================================================
