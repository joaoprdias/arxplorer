from fastapi import Body, APIRouter, HTTPException
from app.services.analysis_service import extract_keywords, analyze_publication_trends, top_authors
import pandas as pd
from typing import List, Dict

router = APIRouter()

@router.post("/keywords", summary="Extract keywords from articles")
def extract_keywords_from_articles(
    df: List[Dict] = Body(..., description="List of articles to analyze"), 
    top_n: int = Body(10, description="Number of keywords to extract")
):
    try:
        # Verifica se a lista de artigos está vazia
        if not df:
            raise HTTPException(status_code=400, detail="The 'df' field must not be empty.")

        # Processa o DataFrame
        df = pd.DataFrame(df)
        unigrams, bigrams, trigrams = extract_keywords(df, top_n)

        return {
            "unigrams": unigrams.to_dict(orient="records"),
            "bigrams": bigrams.to_dict(orient="records"),
            "trigrams": trigrams.to_dict(orient="records"),
        }

    except Exception as e:
        print("Error processing request:", e)
        raise HTTPException(status_code=500, detail="An error occurred while processing the request.")

@router.post("/trends", summary="Analyze publication trends")
def get_publication_trends(
    df: List[Dict] = Body(..., description="List of articles to analyze")
    ):
    """
    Analyze publication trends over time.
    """
    df = pd.DataFrame(df)
    trends = analyze_publication_trends(df)
    return trends.to_dict(orient="records")

@router.post("/authors", summary="Get top authors")
def get_top_authors(
    df: List[Dict] = Body(..., description="List of articles to analyze"), 
    top_n: int = Body(10, description="Number of keywords to extract")
):
    """
    Get the most frequently mentioned authors from the dataset.
    """
    df = pd.DataFrame(df)
    authors_df = top_authors(df, top_n)
    return authors_df.to_dict(orient="records")