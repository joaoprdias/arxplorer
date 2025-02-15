from fastapi import APIRouter
from app.services.analysis_service import extract_keywords, analyze_publication_trends, filter_articles_by_keywords, top_authors
import pandas as pd

router = APIRouter()

@router.post("/keywords", summary="Extract keywords from articles")
def extract_keywords_from_articles(df: list[dict], top_n: int = 10):
    """
    Extract keywords (unigrams, bigrams, trigrams) from a dataset of articles.
    """
    df = pd.DataFrame(df)
    unigrams, bigrams, trigrams = extract_keywords(df, top_n)
    return {
        "unigrams": unigrams.to_dict(orient="records"),
        "bigrams": bigrams.to_dict(orient="records"),
        "trigrams": trigrams.to_dict(orient="records"),
    }

@router.post("/filter", summary="Filter articles by keywords")
def filter_articles(df: list[dict], keywords: list[str]):
    """
    Filter articles based on the presence of specific keywords.
    """
    df = pd.DataFrame(df)
    filtered_df = filter_articles_by_keywords(df, keywords)
    return filtered_df.to_dict(orient="records")

@router.post("/trends", summary="Analyze publication trends")
def get_publication_trends(df: list[dict]):
    """
    Analyze publication trends over time.
    """
    df = pd.DataFrame(df)
    trends = analyze_publication_trends(df)
    return trends.to_dict(orient="records")

@router.post("/authors", summary="Get top authors")
def get_top_authors(df: list[dict], top_n: int = 10):
    """
    Get the most frequently mentioned authors from the dataset.
    """
    df = pd.DataFrame(df)
    authors_df = top_authors(df, top_n)
    return authors_df.to_dict(orient="records")