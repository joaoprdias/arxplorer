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
    # Get the first N summaries
    summaries = df["Summary"].head(n).tolist()

    # Construct the summaries in a formatted list
    formatted_summaries = "\n\n".join([f"{i+1}. {summary}" for i, summary in enumerate(summaries)])

    # Create the prompt separately
    prompt = (
        f"Below are {n} scientific article summaries extracted from arXiv:\n\n"
        f"{formatted_summaries}\n\n"
        "Please generate a concise and coherent summary that combines the key ideas from these summaries."
    )

    # Initialize the Ollama LLM model
    model = OllamaLLM(model="llama3")

    # Invoke the model with the prompt
    result = model.invoke(prompt)
    
    return result