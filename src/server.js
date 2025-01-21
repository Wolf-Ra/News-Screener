const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/newsScreenerDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const NewsSchema = new mongoose.Schema({
  headline: String,
  category: String,
  date: Date,
  sentiment: String,
  // Additional fields based on your news data
});

const News = mongoose.model('News', NewsSchema);

// API to fetch news from an external API and store in MongoDB
app.get('/fetch-news', async (req, res) => {
  try {
    const response = await axios.get('https://gnews.io/api/v4/top-headlines?country=in'); // Use your gnews API

    const newsArticles = response.data.articles.map(article => ({
      headline: article.title,
      category: 'General', // Customize based on your news data
      date: new Date(article.publishedAt),
      sentiment: 'neutral', // You can add sentiment analysis logic here
    }));

    // Store the fetched news in MongoDB
    await News.insertMany(newsArticles);
    res.json({ message: 'News successfully fetched and saved to database', news: newsArticles });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ message: 'Error fetching news' });
  }
});

// API to get all news from MongoDB
app.get('/news', async (req, res) => {
  try {
    const news = await News.find();
    res.json(news);
  } catch (error) {
    console.error('Error retrieving news:', error);
    res.status(500).json({ message: 'Error retrieving news' });
  }
});

// API to add a single news article manually
app.post('/news', async (req, res) => {
  try {
    const newArticle = new News(req.body);
    await newArticle.save();
    res.json(newArticle);
  } catch (error) {
    console.error('Error adding news article:', error);
    res.status(500).json({ message: 'Error adding news article' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

