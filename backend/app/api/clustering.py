from fastapi import APIRouter
from app.services.clustering_service import cluster_articles, find_similar_articles_with_url
import pandas as pd

router = APIRouter()

@router.post("/cluster", summary="Cluster articles into themes")
def cluster_articles_into_themes(df: list[dict], n_clusters: int = 5):
    """
    Cluster articles into thematic groups.
    """
    df = pd.DataFrame(df)
    clustered_df = cluster_articles(df, n_clusters)
    return clustered_df.to_dict(orient="records")

@router.post("/similar", summary="Find similar articles")
def find_similar_articles(df: list[dict], article_url: str, top_n: int = 5):
    """
    Find articles similar to a given article URL.
    """
    df = pd.DataFrame(df)
    similar_articles = find_similar_articles_with_url(df, article_url, top_n)
    return similar_articles.to_dict(orient="records")