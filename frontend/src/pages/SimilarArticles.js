import React, { useState, useEffect, useCallback } from "react";
import { fetchArxivArticles, fetchSimilarArticles } from "../services/api";
import { useNavigate } from "react-router-dom";
import "./SimilarArticles.css";

function SimilarArticles() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [maxResults, setMaxResults] = useState(10);
  const [sortBy, setSortBy] = useState("relevance");
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [topN, setTopN] = useState(5);
  const [similarArticles, setSimilarArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearchArticles = async () => {
    setLoading(true);
    setError("");

    try {
      const fetchedArticles = await fetchArxivArticles(query, maxResults, sortBy);
      setArticles(fetchedArticles);
      setSimilarArticles([]);
      setSelectedArticle(null);
    } catch (err) {
      setError("Error fetching articles. Please check your query.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectArticle = useCallback(async (article) => {
    setSelectedArticle(article);
    setLoading(true);
    setError("");

    try {
      const similarArticlesResponse = await fetchSimilarArticles(
        articles,
        article.Link,
        topN
      );
      setSimilarArticles(similarArticlesResponse);
    } catch (err) {
      setError("Error fetching similar articles. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [articles, topN]);

  const handleTopNChange = (e) => {
    setTopN(Number(e.target.value));
  };

  useEffect(() => {
    if (selectedArticle) {
      handleSelectArticle(selectedArticle);
    }
  }, [topN, selectedArticle, handleSelectArticle]);

  return (
    <div className="similar-articles-container">
      <header className="header">
        <h1 className="main-title">Find Similar Articles</h1>
        <p className="subtitle">Search for articles and explore similar research topics.</p>
      </header>

      <section className="box-container">
        <div className="search-controls">
          <div className="input-group">
            <label htmlFor="query">Search Query:</label>
            <input
              id="query"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter a topic (e.g., Machine Learning)"
              className="input"
            />
          </div>
          <div className="input-group">
            <label htmlFor="maxResults">Max Results:</label>
            <input
              id="maxResults"
              type="number"
              value={maxResults}
              onChange={(e) => setMaxResults(Number(e.target.value))}
              className="input"
              min={1}
              max={50}
            />
          </div>
          <div className="input-group">
            <label htmlFor="sortBy">Sort By:</label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="dropdown"
            >
              <option value="relevance">Relevance</option>
              <option value="submittedDate">Submitted Date</option>
              <option value="lastUpdatedDate">Last Updated Date</option>
            </select>
          </div>
          <button
            className="search-button"
            onClick={handleSearchArticles}
            disabled={loading || !query}
          >
            {loading ? "Searching..." : "Search Articles"}
          </button>
        </div>

        {articles.length > 0 && (
          <div className="articles-section">
            <p className="instructions">📌 Click on an article to select it for similarity analysis.</p>
            <div className="articles-table-container">
              <table className="articles-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Authors</th>
                    <th>Published</th>
                    <th>Link</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((article, index) => (
                    <tr
                      key={index}
                      className={selectedArticle?.Link === article.Link ? "selected" : ""}
                      onClick={() => handleSelectArticle(article)}
                    >
                      <td>
                        {selectedArticle?.Link === article.Link && (
                          <span className="selected-icon">✅</span>
                        )}
                        {article.Title || "Untitled Article"}
                      </td>
                      <td>{article.Authors || "Unknown"}</td>
                      <td>{new Date(article.Published).toLocaleDateString()}</td>
                      <td>
                        <a href={article.Link} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedArticle && (
          <div className="similar-articles-controls">
            <h2 className="section-title">Similar Articles</h2>
            <p>
              Selected Article: <strong>{selectedArticle.Title}</strong>
            </p>
            <div className="similar-controls">
              <label htmlFor="topN">Number of Similar Articles:</label>
              <input
                id="topN"
                type="number"
                value={topN}
                onChange={handleTopNChange}
                className="input"
                min={1}
                max={50}
              />
            </div>

            {similarArticles.length > 0 && (
              <div className="similar-articles-table">
                <div className="articles-table-container">
                  <table className="articles-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Similarity Score</th>
                        <th>Link</th>
                      </tr>
                    </thead>
                    <tbody>
                      {similarArticles.map((article, index) => (
                        <tr key={index}>
                          <td>{article.Title || "Untitled Article"}</td>
                          <td>{article.Similarity_Score.toFixed(2)}</td>
                          <td>
                            <a href={article.Link} target="_blank" rel="noopener noreferrer">
                              View
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {error && <p className="error-message">{error}</p>}
      </section>

      {/* Botão para Voltar à Home */}
      <div className="home-button-container">
        <button
          className="home-button"
          onClick={() => navigate("/")} // Navegar para a homepage
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
}

export default SimilarArticles;