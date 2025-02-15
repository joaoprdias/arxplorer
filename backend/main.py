from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import arxiv_router, analysis_router, clustering_router
from app.core.config import settings  # Import configurations

# Initialize FastAPI app with configurations
app = FastAPI(
    title=settings.app_name,  # Application name from config
    debug=settings.debug      # Debug mode from config
)

# Add CORS middleware for frontend-backend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,  # Allowed origins from config
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Register routers
app.include_router(arxiv_router, prefix="/arxiv", tags=["Arxiv"])
app.include_router(analysis_router, prefix="/analysis", tags=["Analysis"])
app.include_router(clustering_router, prefix="/clustering", tags=["Clustering"])