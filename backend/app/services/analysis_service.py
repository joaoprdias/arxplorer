import pandas as pd
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import CountVectorizer

def extract_keywords(df: pd.DataFrame, top_n: int = 10):
    """
    Gera três DataFrames separados para palavras individuais, bigramas e trigramas mais frequentes.

    Args:
        df (pd.DataFrame): DataFrame com os artigos.
        top_n (int): Número de palavras-chave mais frequentes a retornar para cada n-grama.

    Returns:
        tuple: DataFrames para unigramas, bigramas e trigramas.
    """
    combined_text = " ".join(df["Title"]) + " " + " ".join(df["Summary"])
    stop_words = list(stopwords.words("english"))

    vectorizer_uni = CountVectorizer(ngram_range=(1, 1), stop_words=stop_words)
    vectorizer_bi = CountVectorizer(ngram_range=(2, 2), stop_words=stop_words)
    vectorizer_tri = CountVectorizer(ngram_range=(3, 3), stop_words=stop_words)

    # Unigramas
    word_counts_uni = vectorizer_uni.fit_transform([combined_text])
    unigrams_df = pd.DataFrame({
        "Keyword": vectorizer_uni.get_feature_names_out(),
        "Count": word_counts_uni.toarray().flatten()
    }).sort_values(by="Count", ascending=False).head(top_n)

    # Bigramas
    word_counts_bi = vectorizer_bi.fit_transform([combined_text])
    bigrams_df = pd.DataFrame({
        "Keyword": vectorizer_bi.get_feature_names_out(),
        "Count": word_counts_bi.toarray().flatten()
    }).sort_values(by="Count", ascending=False).head(top_n)

    # Trigramas
    word_counts_tri = vectorizer_tri.fit_transform([combined_text])
    trigrams_df = pd.DataFrame({
        "Keyword": vectorizer_tri.get_feature_names_out(),
        "Count": word_counts_tri.toarray().flatten()
    }).sort_values(by="Count", ascending=False).head(top_n)

    return unigrams_df, bigrams_df, trigrams_df

def filter_articles_by_keywords(df: pd.DataFrame, keywords: list):
    """
    Filtra artigos que contêm palavras-chave relevantes no título ou resumo. 

    Args:
        df (pd.DataFrame): DataFrame com os artigos.
        keywords (list): Lista de palavras-chave relevantes.

    Returns:
        pd.DataFrame: Apenas os artigos relevantes.
    """
    def is_relevant(row):
        text = (row["Title"] + " " + row["Summary"]).lower()
        return any(keyword in text for keyword in keywords)

    df["Is_Relevant"] = df.apply(is_relevant, axis=1)
    return df[df["Is_Relevant"]]

def analyze_publication_trends(df: pd.DataFrame):
    """
    Analisa a frequência de publicações ao longo do tempo.

    Args:
        df (pd.DataFrame): DataFrame com os artigos.

    Returns:
        pd.DataFrame: Frequência de publicações por ano.
    """
    df["Published_Year"] = pd.to_datetime(df["Published"]).dt.year
    return df.groupby("Published_Year").size().reset_index(name="Publication_Count")

def top_authors(df, top_n=10):
    """
    Identifica os autores com mais publicações.

    Args:
        df (DataFrame): DataFrame com os artigos.
        top_n (int): Número de autores a listar.

    Returns:
        DataFrame: Autores mais frequentes e o número de publicações.
    """
    authors_series = df["Authors"].str.split(", ").explode()
    author_counts = authors_series.value_counts().head(top_n).reset_index()
    author_counts.columns = ["Author", "Publication_Count"]
    return author_counts