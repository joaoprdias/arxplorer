import pandas as pd
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import CountVectorizer
from app.services.text_preprocessing import preprocess_text

def extract_keywords(df: pd.DataFrame, top_n: int = 10):
    """
    Generates three separate DataFrames for the most frequent individual words, bigrams and trigrams.

    Args:
        df (pd.DataFrame): DataFrame with the articles.
        top_n (int): Number of most frequent keywords to return for each n-gram.

    Returns:
        tuple: DataFrames for unigrams, bigrams and trigrams.
    """
    combined_text = " ".join(df["Title"].apply(preprocess_text)) + " " + " ".join(df["Summary"].apply(preprocess_text))

    vectorizer_uni = CountVectorizer(ngram_range=(1, 1))
    vectorizer_bi = CountVectorizer(ngram_range=(2, 2))
    vectorizer_tri = CountVectorizer(ngram_range=(3, 3))

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

def analyze_publication_trends(df: pd.DataFrame):
    """
    It analyzes the frequency of publications over time.

    Args:
        df (pd.DataFrame): DataFrame with the articles.

    Returns:
        pd.DataFrame: Frequency of publications per year.
    """
    df["Published_Year"] = pd.to_datetime(df["Published"]).dt.year
    return df.groupby("Published_Year").size().reset_index(name="Publication_Count")

def top_authors(df, top_n=10):
    """
    Identifies the authors with the most publications.

    Args:
        df (DataFrame): DataFrame with the articles.
        top_n (int): Number of authors to list.

    Returns:
        DataFrame: Most frequent authors and number of publications.
    """
    authors_series = df["Authors"].str.split(", ").explode()
    author_counts = authors_series.value_counts().head(top_n).reset_index()
    author_counts.columns = ["Author", "Publication_Count"]
    return author_counts