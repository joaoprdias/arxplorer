import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000'; // Backend URL

// Fetch articles from Arxiv
export const fetchArxivArticles = async (query, maxResults = 10) => {
  try {
    const response = await axios.get(`${BASE_URL}/arxiv/`, {
      params: {
        query,
        max_results: maxResults,
        sort_by: 'relevance',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
};

// Fetch keywords for the articles
export const fetchKeywords = async (articles) => {
  try {
    const response = await axios.post(`${BASE_URL}/analysis/keywords`, {
      articles,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching keywords:', error);
    throw error;
  }
};