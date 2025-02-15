import React from 'react';
import ReactDOM from 'react-dom/client'; // Importa o método correto
import './index.css';
import App from './App';

// Cria a raiz principal
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);