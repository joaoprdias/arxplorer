import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ArxivSearch from "./pages/ArxivSearch";
import KeywordAnalysis from "./pages/KeywordAnalysis";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/arxiv" element={<ArxivSearch />} />
        <Route path="/analysis" element={<KeywordAnalysis />} />
      </Routes>
    </Router>
  );
}

export default App;