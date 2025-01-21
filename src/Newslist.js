import axios from 'axios';
import React, { useEffect, useState } from 'react';

const NewsList = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    // Fetch the news data from the backend
    axios.get('http://localhost:5000/news')
      .then(response => {
        setNews(response.data);
      })
      .catch(error => {
        console.error('Error fetching the news:', error);
      });
  }, []);

  return (
    <div>
      <h1>News Articles</h1>
      <ul>
        {news.map((article, index) => (
          <li key={index}>
            <h2>{article.headline}</h2>
            <p>{article.category} - {new Date(article.date).toDateString()}</p>
            <p>Sentiment: {article.sentiment}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsList;
