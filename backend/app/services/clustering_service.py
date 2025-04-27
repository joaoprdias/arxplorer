import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from sklearn.metrics.pairwise import cosine_similarity
from app.services.text_preprocessing import preprocess_text

def cluster_articles(df: pd.DataFrame, n_clusters: int = 5):
    """
    Groups articles into thematic clusters.

    Args:
        df (pd.DataFrame): DataFrame with the articles.
        n_clusters (int): Number of clusters.

    Returns:
        pd.DataFrame: DataFrame with a new “Cluster” column.
    """
    df["Processed_Summary"] = df["Summary"].apply(preprocess_text)

    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(df["Processed_Summary"])

    kmeans = KMeans(n_clusters=n_clusters, random_state=42)
    df["Cluster"] = kmeans.fit_predict(tfidf_matrix)
    return df

def find_similar_articles_with_url(df: pd.DataFrame, article_url: str, top_n: int = 5):
    """
    Identifies the most similar articles to a specific article based on the URL.

    Args:
        df (pd.DataFrame): DataFrame with the articles.
        article_url (str): URL of the article for which to find similar ones.
        top_n (int): Number of similar articles to return.

    Returns:
        pd.DataFrame: DataFrame with the similar articles, their similarity scores and URLs.
    """
    if article_url not in df["Link"].values:
        raise ValueError("O URL fornecido não está no conjunto de dados.")
    
    df["Processed_Summary"] = df["Summary"].apply(preprocess_text)
    
    article_index = df[df["Link"] == article_url].index[0]
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(df["Processed_Summary"])
    
    similarity_scores = cosine_similarity(tfidf_matrix[article_index], tfidf_matrix).flatten()
    similar_indices = similarity_scores.argsort()[-top_n-1:-1][::-1]
    similar_scores = similarity_scores[similar_indices]
    
    similar_articles = df.iloc[similar_indices].copy()
    similar_articles["Similarity_Score"] = similar_scores
    return similar_articles[["Title", "Similarity_Score", "Link"]]