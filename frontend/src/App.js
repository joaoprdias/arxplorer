import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ArxivSearch from "./pages/ArxivSearch";
import KeywordAnalysis from "./pages/KeywordAnalysis";
import SimilarArticles from "./pages/SimilarArticles";
import Summarization from "./pages/Summarization";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/arxiv" element={<ArxivSearch />} />
        <Route path="/analysis" element={<KeywordAnalysis />} />
        <Route path="/clustering" element={<SimilarArticles />} />
        <Route path="/summarization" element={<Summarization />} />
      </Routes>
    </Router>
  );
}

export default App;