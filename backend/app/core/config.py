from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    app_name: str = "Arxiv API"
    debug: bool = True
    arxiv_base_url: str = "http://export.arxiv.org/api/query"
    allowed_origins: List[str] = []  # Default to an empty list if not provided

    class Config:
        env_file = ".env"  # Specify the environment file

    # Parse ALLOWED_ORIGINS from the environment as a list
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if isinstance(self.allowed_origins, str):  # If it's a string, split by commas
            self.allowed_origins = self.allowed_origins.split(",")

settings = Settings()