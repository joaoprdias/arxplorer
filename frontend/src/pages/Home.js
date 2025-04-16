import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import unsplashFotoHome1 from "../assets/unsplash_foto_home_1.jpg";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="home-hero">
        <img src={unsplashFotoHome1} alt="Scientific exploration" className="hero-image" />
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">arXplorer</h1>
            <p className="hero-subtitle">
              Discover, analyze, and cluster scientific research articles effortlessly.
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card feature-overlay-card" onClick={() => navigate("/arxiv")}>
              <h3 className="feature-title">🔍 Search</h3>
              <p className="feature-description">
                Use advanced search tools to find articles by query and sorting criteria.
              </p>
              <button className="feature-button">Explore Now</button>
            </div>
            <div className="feature-card feature-overlay-card" onClick={() => navigate("/analysis")}>
              <h3 className="feature-title">📊 Analyze</h3>
              <p className="feature-description">
                Extract and visualize key topics and trends in research publications.
              </p>
              <button className="feature-button">Analyze Now</button>
            </div>
            <div className="feature-card feature-overlay-card" onClick={() => navigate("/clustering")}>
              <h3 className="feature-title">📐 Match</h3>
              <p className="feature-description">
                Get the most similar articles based on cosine similarity for topic-based grouping.
              </p>
              <button className="feature-button">View Similarities</button>
            </div>
            <div className="feature-card feature-overlay-card" onClick={() => navigate("/cluster")}>
              <h3 className="feature-title">🧠 Cluster</h3>
              <p className="feature-description">
                Explore research articles by automatically grouping them into thematic clusters using k-means.
              </p>
              <button className="feature-button">Start Clustering</button>
            </div>
            <div className="feature-card feature-overlay-card hide-summarize" onClick={() => navigate("/summarization")}>
              <h3 className="feature-title">✍️ Summarize</h3>
              <p className="feature-description">
                Generate summaries of the most relevant scientific articles.
              </p>
              <button className="feature-button">Summarize Now</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <p>
          Built by <strong>João Dias</strong> and <strong>David Franco</strong> (ISCTE). Powered by{" "}
          <strong>FastAPI</strong> and <strong>React</strong>.
        </p>
      </footer>
    </div>
  );
}

export default Home;