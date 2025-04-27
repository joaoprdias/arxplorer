from langchain_ollama import OllamaLLM
import pandas as pd

def generate_summary_ollama(df: pd.DataFrame, n: int = 3):
    """
    Generates a concise summary from the first N summaries using Ollama (Llama3).

    Args:
        df (DataFrame): DataFrame containing articles (from get_arxiv_data).
        n (int): Number of summaries to include in the generated summary.

    Returns:
        str: Generated summary.
    """
    # Obter os primeiros N summaries
    summaries = df["Summary"].head(n).tolist()

    # Construir os summaries formatados
    formatted_summaries = "\n\n".join([f"{i+1}. {summary}" for i, summary in enumerate(summaries)])

    # Criar a prompt para o modelo
    prompt = (
        f"Below are {n} scientific article summaries extracted from arXiv:\n\n"
        f"{formatted_summaries}\n\n"
        "Please generate a concise and coherent summary that combines the key ideas from these summaries."
    )

    # Inicializar o modelo Llama3
    model = OllamaLLM(model="llama3")

    # Invocar o modelo com a prompt
    result = model.invoke(prompt)
    
    return result