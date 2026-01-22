"""
Main config for the backend. Use .env to override these if needed.
"""
from pydantic_settings import BaseSettings
from typing import List
from functools import lru_cache

class Settings(BaseSettings):
    # Basic App Info
    APP_NAME: str = "PRAGATI"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # CORS - who's allowed to talk to us
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173"
    ]
    
    # LLM Stuff (Ollama)
    LLM_MODEL: str = "ministral:3b"
    LLM_BASE_URL: str = "http://localhost:11434"
    LLM_TEMPERATURE: float = 0.7
    LLM_MAX_TOKENS: int = 4096
    LLM_REQUEST_TIMEOUT: float = 60.0
    
    # RAG / Embeddings
    EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"
    EMBEDDING_DIMENSION: int = 384
    
    CHROMA_PERSIST_DIR: str = "./data/chroma_db"
    CHROMA_COLLECTION_NAME: str = "scert_manuals"
    
    # Language Support - NLLB model
    TRANSLATION_MODEL: str = "facebook/nllb-200-distilled-600M"
    SUPPORTED_LANGUAGES: List[str] = [
        "eng_Latn", "hin_Deva", "ben_Beng", "tam_Taml",
        "tel_Telu", "mar_Deva", "bho_Deva", "mai_Deva",
        "mag_Deva", "san_Deva", "urd_Arab"
    ]
    
    # Document Processing configs
    CHUNK_SIZE: int = 800
    CHUNK_OVERLAP: int = 200
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB limit
    
    # Micro-learning defaults
    MODULE_TARGET_DURATION: int = 15
    MODULE_MAX_SECTIONS: int = 5
    
    # DB (switch to Postgres later if needed)
    DATABASE_URL: str = "sqlite:///./data/pragati.db"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
