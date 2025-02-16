import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchArxivArticles, fetchKeywords, fetchTrends, fetchAuthors } from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "./KeywordAnalysis.css";

function KeywordAnalysis() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [maxResults, setMaxResults] = useState(10);
  const [sortBy, setSortBy] = useState("relevance");
  const [topN, setTopN] = useState(25);
  const [topAuthorsN, setTopAuthorsN] = useState(10);
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState({ unigrams: [], bigrams: [], trigrams: [] });
  const [trendData, setTrendData] = useState([]);
  const [authorData, setAuthorData] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [articles, setArticles] = useState([]);

  const handleAnalyze = async () => {
    setLoading(true);
    setHasSearched(false);

    try {
      const fetchedArticles = await fetchArxivArticles(query, maxResults, sortBy);
      setArticles(fetchedArticles);
      setHasSearched(true);

      const keywordData = await fetchKeywords(fetchedArticles, topN);
      setKeywords(keywordData);

      const trends = await fetchTrends(fetchedArticles);
      setTrendData(trends);

      const authors = await fetchAuthors(fetchedArticles, topAuthorsN);
      setAuthorData(authors);
    } catch (err) {
      console.error("Something went wrong:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTopNChange = useCallback(async (value) => {
    setTopN(value);
    if (hasSearched) {
      setLoading(true);
      try {
        const keywordData = await fetchKeywords(articles, value);
        setKeywords(keywordData);
      } catch (err) {
        console.error("Something went wrong while updating keywords:", err);
      } finally {
        setLoading(false);
      }
    }
  }, [articles, hasSearched]);

  const handleTopAuthorsNChange = useCallback(async (value) => {
    setTopAuthorsN(value);
    if (hasSearched) {
      setLoading(true);
      try {
        const authors = await fetchAuthors(articles, value);
        setAuthorData(authors);
      } catch (err) {
        console.error("Something went wrong while updating authors:", err);
      } finally {
        setLoading(false);
      }
    }
  }, [articles, hasSearched]);

  return (
    <div className="keyword-analysis-container">
      <header className="header">
        <h1 className="main-title">Keyword Analysis</h1>
        <p className="subtitle">
          Search scientific articles and extract the most frequent keywords in one step.
        </p>
      </header>

      <section className="search-section">
        <h2 className="section-title">Search Parameters</h2>
        <div className="search-controls">
          <div className="input-group">
            <label htmlFor="query">Search Query</label>
            <input
              id="query"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter search query (e.g., Machine Learning)"
              className="input"
            />
          </div>
          <div className="input-group">
            <label htmlFor="maxResults">Max Results</label>
            <input
              id="maxResults"
              type="number"
              value={maxResults}
              onChange={(e) => setMaxResults(Number(e.target.value))}
              placeholder="Max Results"
              className="input"
              min={1}
              max={500}
            />
          </div>
          <div className="input-group">
            <label htmlFor="sortBy">Sort By</label>
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
          <button className="analyze-button" onClick={handleAnalyze} disabled={loading}>
            {loading ? "Processing..." : "Search"}
          </button>
        </div>
      </section>

      {hasSearched && (
        <div className="box-container">
          <section className="chart-section">
            <h2 className="section-title">Trends Chart</h2>
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="Published_Year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Publication_Count" fill="#555" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p>No trend data available.</p>
            )}
          </section>

          <section className="results-section">
            <h2 className="section-title">Keyword Results</h2>

            <section className="topN-section">
              <div className="input-group">
                <label htmlFor="topN">Top N Keywords</label>
                <input
                  id="topN"
                  type="number"
                  value={topN}
                  onChange={(e) => handleTopNChange(Number(e.target.value))}
                  placeholder="Top N Keywords"
                  className="input"
                  min={1}
                />
              </div>
            </section>

            <div className="results-grid">
              <div className="result-card">
                <h3 className="result-title">Unigrams</h3>
                <div className="keyword-box">
                  {keywords.unigrams.length > 0 ? (
                    <ul className="keyword-list">
                      {keywords.unigrams.map((keyword, index) => (
                        <li key={index}>
                          {keyword.Keyword}{" "}
                          <span className="keyword-count">({keyword.Count})</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No unigrams found.</p>
                  )}
                </div>
              </div>
              <div className="result-card">
                <h3 className="result-title">Bigrams</h3>
                <div className="keyword-box">
                  {keywords.bigrams.length > 0 ? (
                    <ul className="keyword-list">
                      {keywords.bigrams.map((keyword, index) => (
                        <li key={index}>
                          {keyword.Keyword}{" "}
                          <span className="keyword-count">({keyword.Count})</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No bigrams found.</p>
                  )}
                </div>
              </div>
              <div className="result-card">
                <h3 className="result-title">Trigrams</h3>
                <div className="keyword-box">
                  {keywords.trigrams.length > 0 ? (
                    <ul className="keyword-list">
                      {keywords.trigrams.map((keyword, index) => (
                        <li key={index}>
                          {keyword.Keyword}{" "}
                          <span className="keyword-count">({keyword.Count})</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No trigrams found.</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="authors-section">
            <h2 className="section-title">Top Authors</h2>
            <div className="top-authors-section">
              <div className="input-group">
                <label htmlFor="topAuthorsN">Top N Authors</label>
                <input
                  id="topAuthorsN"
                  type="number"
                  value={topAuthorsN}
                  onChange={(e) => handleTopAuthorsNChange(Number(e.target.value))}
                  placeholder="Top N Authors"
                  className="input"
                  min={1}
                />
              </div>
            </div>
            {authorData.length > 0 ? (
              <div className="authors-table-container">
                <table className="authors-table">
                  <thead>
                    <tr>
                      <th>Author</th>
                      <th>Publication Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {authorData.map((author, index) => (
                      <tr key={index}>
                        <td>{author.Author}</td>
                        <td>{author.Publication_Count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No authors found.</p>
            )}
          </section>
        </div>
      )}

      <div className="home-button-container">
        <button
          className="home-button"
          onClick={() => navigate("/")}
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
}

export default KeywordAnalysis;