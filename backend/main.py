from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import arxiv_router, analysis_router, clustering_router
from app.core.config import settings  # Importa as configurações do Settings

# Inicializa a aplicação FastAPI
app = FastAPI(
    title=settings.app_name,  # Nome da aplicação a partir das configurações
    debug=settings.debug      # Modo de depuração a partir das configurações
)

# Middleware CORS para comunicação entre frontend e backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,  # Origens permitidas (carregadas do .env)
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos os métodos HTTP (GET, POST, etc.)
    allow_headers=["*"],  # Permitir todos os cabeçalhos
)

# Regista os routers das APIs
app.include_router(arxiv_router, prefix="/arxiv", tags=["Arxiv"])
app.include_router(analysis_router, prefix="/analysis", tags=["Analysis"])
app.include_router(clustering_router, prefix="/clustering", tags=["Clustering"])