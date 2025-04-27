import re
import pandas as pd
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# Tokenização
def tokenize_text(text):
    return re.findall(r'\b\w+\b', text)

# Pré-processamento de texto
def preprocess_text(text):
    if pd.isna(text):
        return ""

    # Converter para minúsculas
    text = text.lower()

    # Remover pontuação e caracteres especiais
    text = re.sub(r'\W+', ' ', text)

    # Tokenizar
    tokens = tokenize_text(text)

    # Remover stopwords
    stop_words = set(stopwords.words('english'))
    tokens = [word for word in tokens if word not in stop_words]

    # Lematização
    lemmatizer = WordNetLemmatizer()
    tokens = [lemmatizer.lemmatize(word) for word in tokens]

    # Recriar texto
    return " ".join(tokens)