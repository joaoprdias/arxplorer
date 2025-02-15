import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="home-title">Welcome to Arxiv Explorer</h1>
        <p className="home-subtitle">
          Discover, analyze, and explore scientific articles with ease.
        </p>
      </header>

      <section className="home-section">
        <h2 className="home-section-title">Main Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3 className="feature-title">Search Articles</h3>
            <p className="feature-description">
              Use our powerful search tool to find scientific articles from Arxiv. Filter by query, results, and sorting criteria.
            </p>
            <button
              className="feature-button"
              onClick={() => navigate("/arxiv")}
            >
              Explore Articles
            </button>
          </div>
          <div className="feature-card">
            <h3 className="feature-title">Analyze Keywords</h3>
            <p className="feature-description">
              Analyze the most frequent keywords and topics in scientific articles.
            </p>
            <button
              className="feature-button"
              onClick={() => navigate("/analysis")}
            >
              Analyze Keywords
            </button>
          </div>
          <div className="feature-card">
            <h3 className="feature-title">Cluster Articles</h3>
            <p className="feature-description">
              Group articles into thematic clusters for deeper insights.
            </p>
            <button
              className="feature-button"
              onClick={() => navigate("/clustering")}
            >
              Cluster Articles
            </button>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <p>
          Built for exploring scientific knowledge by João Dias and David Franco (ISCTE). Powered by FastAPI
          and React.
        </p>
      </footer>
    </div>
  );
}

export default Home;