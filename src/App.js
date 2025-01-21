import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import './App.css';

function App() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('');

  // Define the list of categories (sectors)
  const categories = [
    'Automobile',
    'Finance',
    'IT',
    'Pharmaceuticals',
    'Energy',
    'Consumer Goods',
    'Metals and Mining',
    'Real Estate',
    'Telecommunication',
    'Infrastructure'
  ];

  // Function to fetch news from API
  const fetchNews = async (category) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/news?category=${category}`);
      if (response.status === 200) {
        setNews(response.data);
        setCategory(category);
      } else {
        setError('No news found for this category.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch news.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header className="bg-dark text-white p-3 text-center mb-4">
        <h1>News Screener</h1>
      </header>

      {/* Horizontal Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
        <div className="navbar-nav">
          {categories.map((cat) => (
            <button
              key={cat}
              className="nav-item nav-link btn btn-primary mx-2"
              onClick={() => fetchNews(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>

      <div className="content">
        <h2>{category ? `News for ${category}` : 'Select a Category'}</h2>

        {loading && <p>Loading...</p>}
        {error && <p className="text-danger">{error}</p>}

        {news.length > 0 && (
          <table className="table table-striped">
            <thead className="thead-dark">
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Published At</th>
                <th>Source</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {news.map((article, index) => (
                <tr key={index}>
                  <td>{article.title}</td>
                  <td>{article.description}</td>
                  <td>{article.publishedAt}</td>
                  <td>{article.source}</td>
                  <td>
                    <a href={article.link} target="_blank" rel="noopener noreferrer">
                      Read More
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;
