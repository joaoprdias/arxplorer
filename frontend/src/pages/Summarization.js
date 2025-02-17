import React, { useState, useEffect } from "react";
import { fetchSummaries, fetchArxivArticles } from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Summarization.css";

const loadingMessages = [
  "Analyzing the top articles...",
  "Summarizing key ideas...",
  "Extracting insights from scientific papers...",
  "Refining the summary...",
  "Almost done..."
];

const Summarization = () => {
  const [topic, setTopic] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [typingEffect, setTypingEffect] = useState("");
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [dotAnimation, setDotAnimation] = useState(""); // Para animação "Generating..."
  const navigate = useNavigate();

  // Alternar frases de loading sem repetir (tempo médio: 90 segundos)
  useEffect(() => {
    if (loading) {
      let index = 0;
      const messageInterval = setInterval(() => {
        if (index < loadingMessages.length - 1) {
          setLoadingMessageIndex((prev) => prev + 1);
          index++;
        } else {
          clearInterval(messageInterval); // Para quando todas as frases forem mostradas
        }
      }, 18000); // Cada frase dura 18 segundos (90s no total)

      return () => clearInterval(messageInterval);
    }
  }, [loading]);

  // Animação dos pontinhos no "Generating..."
  useEffect(() => {
    if (loading) {
      const dotInterval = setInterval(() => {
        setDotAnimation((prev) => (prev.length < 3 ? prev + "." : ""));
      }, 500);
      return () => clearInterval(dotInterval);
    }
  }, [loading]);

  // Função para pesquisar artigos e gerar o resumo
  const handleGenerateSummary = async () => {
    if (!topic.trim()) return;

    setLoading(true);
    setSummary("");
    setTypingEffect("");
    setLoadingMessageIndex(0); // Reset da animação das mensagens

    try {
      // Pesquisar apenas os 3 artigos mais relevantes
      const fetchedArticles = await fetchArxivArticles(topic, 3, "relevance");

      // Gerar o resumo
      const response = await fetchSummaries(fetchedArticles, 3);

      let cleanSummary = response.summary.trim();
      setSummary(cleanSummary);
      setTypingEffect(""); 

      const sentences = cleanSummary.split(". ").filter(sentence => sentence.trim() !== ""); // Remove frases vazias
      let index = 0;

      const interval = setInterval(() => {
        if (index < sentences.length) {
          setTypingEffect((prev) => prev + (prev ? ". " : "") + sentences[index]);
          index++;
        } else {
          clearInterval(interval);
        }
      }, 150); 

    } catch (error) {
      console.error("Error generating summary:", error);
    }

    setLoading(false);
  };

  return (
    <div className="summarization-container">
      <header className="header">
        <h1 className="main-title">Scientific Article Summarizer</h1>
        <p className="subtitle">Enter a topic to get a quick summary of the most relevant articles.</p>
      </header>

      <section className="search-section">
        <div className="search-controls">
          <div className="input-group">
            <label>Topic</label>
            <input
              type="text"
              placeholder="Enter a topic..."
              className="input"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <button className="search-button" onClick={handleGenerateSummary} disabled={loading}>
            {loading ? `Generating${dotAnimation}` : "Generate"}
          </button>
        </div>
      </section>

      {loading && (
        <div className="loading-screen">
          <div className="loading-icon">🧠</div>
          <p className="loading-text">{loadingMessages[loadingMessageIndex]}</p>
        </div>
      )}

      {summary && (
        <section className="summary-container">
          <h2>Summary</h2>
          <p>{typingEffect}</p>
        </section>
      )}

      <button className="home-button" onClick={() => navigate("/")}>Go to Homepage</button>
    </div>
  );
};

export default Summarization;