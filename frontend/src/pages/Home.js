import React, { useState } from 'react';
import { fetchArxivArticles } from '../services/api';

function Home() {
  const [query, setQuery] = useState('');
  const [articles, setArticles] = useState([]);

  const handleSearch = async () => {
    try {
      const data = await fetchArxivArticles(query);
      setArticles(data); // Atualiza o estado com os artigos
    } catch (error) {
      console.error('Error fetching articles:', error);
      alert('Error fetching articles. Check the console for details.');
    }
  };

  return (
    <div>
      <h1>Arxiv Explorer</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your search query"
      />
      <button onClick={handleSearch}>Search</button>

      <h2>Articles</h2>
      <ul>
        {articles.map((article, index) => (
          <li key={index}>
            <strong>{article.Title}</strong> - {article.Authors}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
