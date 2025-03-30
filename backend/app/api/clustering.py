from fastapi import Body, APIRouter
from app.services.clustering_service import cluster_articles, find_similar_articles_with_url
import pandas as pd
from typing import List, Dict

router = APIRouter()

@router.post("/cluster", summary="Cluster articles into themes")
def cluster_articles_into_themes(
    df: List[Dict] = Body(..., description="List of articles to analyze"), 
    n_clusters: int = Body(5, description="Number of clusters do define")
):
    """
    Cluster articles into thematic groups.
    """
    df = pd.DataFrame(df)
    clustered_df = cluster_articles(df, n_clusters)
    return clustered_df.to_dict(orient="records")

@router.post("/similar", summary="Find similar articles")
def find_similar_articles(
    df: List[Dict] = Body(..., description="List of articles to analyze"), 
    article_url: str = Body(..., description="URL of the article to find similar articles for"),
    top_n: int = Body(10, description="Number of similar articles to extract")
):
    """
    Find articles similar to a given article URL.
    """
    df = pd.DataFrame(df)
    similar_articles = find_similar_articles_with_url(df, article_url, top_n)
    return similar_articles.to_dict(orient="records")