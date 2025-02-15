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
    const response = await axios.post(`${BASE_URL}/analysis/trends`, {
      df: articles, // Envia os artigos no corpo da requisição
    });
    return response.data; // Retorna os dados recebidos do backend
  } catch (error) {
    console.error("Error fetching trends:", error);
    throw error; // Propaga o erro para tratamento no componente
  }
};