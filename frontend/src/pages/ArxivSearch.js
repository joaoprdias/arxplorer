import React, { useState } from "react";
import { fetchArxivArticles } from "../services/api"; // Função já existente no api.js
import "./ArxivSearch.css";

function ArxivSearch() {
  const [query, setQuery] = useState(""); // Query do utilizador
  const [maxResults, setMaxResults] = useState(10); // Número de resultados
  const [sortBy, setSortBy] = useState("relevance"); // Critério de ordenação
  const [articles, setArticles] = useState([]); // Lista de artigos
  const [loading, setLoading] = useState(false); // Estado de loading
  const [error, setError] = useState(""); // Mensagem de erro
  const [hasSearched, setHasSearched] = useState(false); // Para controlar a exibição de resultados

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setHasSearched(false);

    try {
      // Faz a chamada para a função fetchArxivArticles do api.js
      const data = await fetchArxivArticles(query, maxResults, sortBy);
      setArticles(data); // Atualiza os artigos recebidos
      setHasSearched(true);
    } catch (err) {
      setError("Failed to fetch data from Arxiv API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="arxiv-search-container">
      <header className="header">
        <h1 className="main-title">Arxiv Article Explorer</h1>
        <p className="subtitle">Search and explore research articles from Arxiv.</p>
      </header>

      <section className="search-section">
        <h2 className="section-title">Search Parameters</h2>
        <div className="search-controls">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter search query (e.g., Machine Learning)"
            className="input"
          />
          <input
            type="number"
            value={maxResults}
            onChange={(e) => setMaxResults(Number(e.target.value))}
            placeholder="Max Results"
            className="input"
            min={1}
            max={500}
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="dropdown"
          >
            <option value="relevance">Relevance</option>
            <option value="submittedDate">Submitted Date</option>
            <option value="lastUpdatedDate">Last Updated Date</option>
          </select>
          <button onClick={handleSearch} className="search-button">
            Search
          </button>
        </div>
      </section>

      {loading && <p className="loading-message">Searching for articles...</p>}
      {error && <p className="error-message">{error}</p>}
      {hasSearched && articles.length === 0 && !loading && (
        <p className="no-results-message">No articles found. Try another query.</p>
      )}

      <section className="results-section">
        {hasSearched && articles.length > 0 && (
          <>
            <h2 className="section-title">Search Results</h2>
            <div className="results-box">
              <div className="results-scroll">
                <table className="results-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Authors</th>
                      <th>Published</th>
                      <th>Summary</th>
                      <th>Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {articles.map((article, index) => (
                      <tr key={index}>
                        <td>{article.Title}</td>
                        <td>{article.Authors}</td>
                        <td>{article.Published}</td>
                        <td>{article.Summary}</td>
                        <td>
                          <a
                            href={article.Link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="article-link"
                          >
                            View
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default ArxivSearch;