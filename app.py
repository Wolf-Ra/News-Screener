from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from pymongo import MongoClient
import pandas as pd
from gnews import GNews
from bson import ObjectId

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# MongoDB connection
client = MongoClient('mongodb://localhost:27017/')
db = client['news_screener']
news_collection = db['news']

# Fetch news function
def fetch_news(category):
    gnews = GNews(language='en', country='IN')
    news = gnews.get_news(category)
    
    # Insert each article into MongoDB with the correct category field
    for article in news:
        news_document = {
            'title': article['title'],
            'description': article['description'],
            'content': article.get('content', ''),
            'publishedAt': article['published date'],
            'source': article['publisher']['title'],
            'link': article['url'],
            'image': article.get('image', ''),
            'category': category  # Include category field
        }
        news_collection.update_one(
            {'title': article['title']},
            {'$set': news_document},
            upsert=True
        )

@app.route('/api/news', methods=['GET'])
def get_news():
    category = request.args.get('category')
    fetch_news(category)
    news_data = list(news_collection.find({"category": category}))

    # Convert ObjectId to string for JSON serialization
    for item in news_data:
        item['_id'] = str(item['_id'])  # Convert ObjectId to string

    return jsonify(news_data)

if __name__ == '__main__':
    app.run(debug=True)
