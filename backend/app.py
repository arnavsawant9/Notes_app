# from flask import Flask
# from flask_cors import CORS
# from flask_pymongo import PyMongo
# from dotenv import load_dotenv
# import os
# from routes.notes import init_notes_routes

# load_dotenv()

# app = Flask(__name__)

# # Configure CORS
# CORS(app, resources={
#     r"/api/*": {
#         "origins": ["http://localhost:5173"],
#         "methods": ["GET", "POST", "PUT", "DELETE"],
#         "allow_headers": ["Content-Type"]
#     }
# })

# # Configure MongoDB
# app.config['MONGO_URI'] = os.getenv('MONGO_URI')
# if not app.config['MONGO_URI']:
#     raise ValueError("MONGO_URI environment variable is not set")

# try:
#     mongo = PyMongo(app)
#     # Test the connection
#     mongo.db.command('ping')
# except Exception as e:
#     print(f"Error connecting to MongoDB: {e}")
#     raise

# # Initialize routes
# init_notes_routes(app, mongo)

# @app.route('/')
# def home():
#     return "Notes App Backend"

# if __name__ == '__main__':
#     app.run(debug=True)









from flask import Flask
from flask_cors import CORS
from routes.notes import notes_bp
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Register blueprints
app.register_blueprint(notes_bp, url_prefix='/api/notes')

if __name__ == '__main__':
    app.run(debug=True)