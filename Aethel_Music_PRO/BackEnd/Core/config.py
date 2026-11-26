from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):

    # =========================================================
    # APPLICATION
    # =========================================================

    APP_NAME: str = "Aethel Music"
    APP_VERSION: str = "1.0.0"
    APP_ENV: str = "development"
    DEBUG: bool = True

    # =========================================================
    # DATABASE
    # =========================================================

    DATABASE_URL: str

    # =========================================================
    # SECURITY
    # =========================================================

    SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # =========================================================
    # CORS
    # =========================================================

    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://aethel-music-1.onrender.com",
    ]

    # =========================================================
    # STORAGE
    # =========================================================

    STORAGE_DIR: Path = BASE_DIR / "Storage"

    MUSIC_DIR: Path = STORAGE_DIR / "music"
    EFFECTS_DIR: Path = STORAGE_DIR / "effects"
    RECORDINGS_DIR: Path = STORAGE_DIR / "recordings"
    COVERS_DIR: Path = STORAGE_DIR / "covers"

    # =========================================================
    # FILE LIMITS (MB)
    # =========================================================

    MAX_AUDIO_SIZE_MB: int = 100
    MAX_EFFECT_SIZE_MB: int = 20
    MAX_RECORDING_SIZE_MB: int = 500
    MAX_COVER_SIZE_MB: int = 10

    # =========================================================
    # ENVIRONMENT CONFIGURATION
    # =========================================================

    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
