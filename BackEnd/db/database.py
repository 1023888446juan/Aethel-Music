import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base


# Cargar las variables del archivo .env
load_dotenv()


# URL de conexión a PostgreSQL
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("No se encontró DATABASE_URL en el archivo .env")


# Crear el motor de conexión
engine = create_engine(
    DATABASE_URL,
    echo=False
)


# Crear las sesiones
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


# Clase base para los modelos
Base = declarative_base()


# Dependencia para obtener una sesión de la base de datos
def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()