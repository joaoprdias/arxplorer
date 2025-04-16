from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    app_name: str = "Arxiv API"
    debug: bool = False
    arxiv_base_url: str = "http://export.arxiv.org/api/query"
    allowed_origins: List[str] = []  # Valor padrão caso o .env esteja vazio

    class Config:
        env_file = ".env"  # Carrega variáveis do .env

settings = Settings()
