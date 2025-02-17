from fastapi import APIRouter, Body
import pandas as pd
from typing import List, Dict
from app.services.summary_service import generate_summary_ollama

router = APIRouter()

@router.post("/summarize", summary="Generate a concise summary from multiple articles")
def summarize_articles(
    df: List[Dict] = Body(..., description="List of articles to summarize"),
    n: int = Body(3, description="Number of articles abstracts to summarize")
):
    """
    Generate a summary from a list of scientific article summaries.
    """
    df = pd.DataFrame(df)
    summary = generate_summary_ollama(df, n)
    return {"summary": summary}