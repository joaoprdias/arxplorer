import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000'; // Backend URL

// Fetch articles from Arxiv
export const fetchArxivArticles = async (query, maxResults = 10, sortBy = 'relevance') => {
  try {
    const response = await axios.get(`${BASE_URL}/arxiv/`, {
      params: {
        query,
        max_results: maxResults,
        sort_by: sortBy,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
};

export const fetchKeywords = async (articles, top_n = 10) => {
  try {
    const response = await axios.post(`${BASE_URL}/analysis/keywords`, {
      df: articles, // A lista de artigos enviada no corpo
      top_n,        // O parâmetro "top_n"
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching keywords:", error);
    throw error;
  }
};

export const fetchTrends = async (articles) => {
  try {
    const response = await axios.post(`${BASE_URL}/analysis/trends`, articles); // Envia a lista diretamente
    return response.data;
  } catch (error) {
    console.error("Error fetching trends:", error);
    throw error;
  }
};

export const fetchAuthors = async (articles, top_n = 10) => {
  try {
    const response = await axios.post(`${BASE_URL}/analysis/authors`, {
      df: articles, // A lista de artigos enviada no corpo
      top_n,        // O parâmetro "top_n"
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching authors:", error);
    throw error;
  }
};

export const fetchSimilarArticles = async (articles, articleUrl, top_n = 10) => {
  try {
    const response = await axios.post(`${BASE_URL}/clustering/similar`, {
      df: articles, // Lista de artigos no corpo da requisição
      article_url: articleUrl, // URL do artigo para encontrar similares
      top_n, // Número máximo de artigos similares a retornar
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching similar articles:", error);
    throw error;
  }
};

export const fetchSummaries = async (articles, n = 3) => {
  try {
    const response = await axios.post(`${BASE_URL}/summary/summarize`, {
      df: articles, // Lista de artigos no corpo da requisição
      n, // Número máximo de artigos similares a retornar
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching summaries:", error);
    throw error;
  }
};