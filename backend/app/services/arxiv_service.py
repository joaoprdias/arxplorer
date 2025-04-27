import pandas as pd 
import requests
import xml.etree.ElementTree as ET

def get_arxiv_data(query, max_results=250, sort_by="relevance"):
    """
    Retrieves articles from the arXiv API based on a query. It is possible to use boolean operators just like in the arxiv graphical interface. 
    
    Args:
        query (str): Keyword or search expression.
        max_results (int): Maximum number of results to return
        sort_by (str): Sorting criteria ('relevance', 'submittedDate', 'lastUpdatedDate').
    
    Returns:
        DataFrame: Data from the articles collected.
    """
    base_url = "http://export.arxiv.org/api/query"
    results = []

    # Dividir as pesquisas em lotes de 1000 (por limitação da arXiv API)
    for start in range(0, max_results, 1000):
        params = {
            "search_query": query,
            "start": start,
            "max_results": min(max_results - start, 1000),
            "sortBy": sort_by,  
        }

        # Requisição à arXiv API
        response = requests.get(base_url, params=params)

        if response.status_code == 200:
            # Parsear o XML que é devolvido pela API
            root = ET.fromstring(response.text)
            for entry in root.findall("{http://www.w3.org/2005/Atom}entry"):
                # Extrair campos importantes do artigo
                title = entry.find("{http://www.w3.org/2005/Atom}title").text.strip()
                summary = entry.find("{http://www.w3.org/2005/Atom}summary").text.strip()
                link = entry.find("{http://www.w3.org/2005/Atom}id").text.strip()
                published = entry.find("{http://www.w3.org/2005/Atom}published").text.strip()
                updated = entry.find("{http://www.w3.org/2005/Atom}updated").text.strip()
                authors = [
                    author.find("{http://www.w3.org/2005/Atom}name").text.strip()
                    for author in entry.findall("{http://www.w3.org/2005/Atom}author")
                ]

                primary_category = entry.find("{http://arxiv.org/schemas/atom}primary_category")
                journal_ref = entry.find("{http://arxiv.org/schemas/atom}journal_ref")
                comment = entry.find("{http://arxiv.org/schemas/atom}comment")

                # Adicionar aos resultados
                results.append({
                    "Title": title,
                    "Summary": summary,
                    "Authors": ", ".join(authors),
                    "Link": link,
                    "Published": published,
                    "Updated": updated,
                    "Primary_Category": primary_category.attrib["term"] if primary_category is not None else None,
                    "Journal_Reference": journal_ref.text.strip() if journal_ref is not None else None,
                    "Comment": comment.text.strip() if comment is not None else None,
                })
        else:
            print(f"Erro na API: {response.status_code}")
            break

    # Converter para DataFrame
    return pd.DataFrame(results)