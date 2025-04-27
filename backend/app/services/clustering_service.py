import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from sklearn.metrics.pairwise import cosine_similarity
from app.services.text_preprocessing import preprocess_text

def cluster_articles(df: pd.DataFrame, n_clusters: int = 5):
    """
    Agrupa os artigos em clusters temáticos.

    Args:
        df (pd.DataFrame): DataFrame com os artigos.
        n_clusters (int): Número de clusters.

    Returns:
        pd.DataFrame: DataFrame com uma nova coluna "Cluster".
    """
    df["Processed_Summary"] = df["Summary"].apply(preprocess_text)

    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(df["Processed_Summary"])

    kmeans = KMeans(n_clusters=n_clusters, random_state=42)
    df["Cluster"] = kmeans.fit_predict(tfidf_matrix)
    return df

def find_similar_articles_with_url(df: pd.DataFrame, article_url: str, top_n: int = 5):
    """
    Identifica os artigos mais similares a um artigo específico com base na URL.

    Args:
        df (pd.DataFrame): DataFrame com os artigos.
        article_url (str): URL do artigo para o qual encontrar similares.
        top_n (int): Número de artigos similares a retornar.

    Returns:
        pd.DataFrame: DataFrame com os artigos similares, suas pontuações de similaridade e URLs.
    """
    if article_url not in df["Link"].values:
        raise ValueError("A URL fornecida não está no conjunto de dados.")
    
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