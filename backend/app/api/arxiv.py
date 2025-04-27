from fastapi import APIRouter
from app.services.arxiv_service import get_arxiv_data

router = APIRouter()

@router.get("/")
def fetch_arxiv_data(query: str, max_results: int = 250, sort_by: str = "relevance"):
    """
    Get articles from arXiv.
    """
    data = get_arxiv_data(query, max_results, sort_by)
    return data.to_dict(orient="records")