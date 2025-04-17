from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import json
import bcrypt
import jwt
import datetime
import random
import string
from functools import wraps
import traceback  # For better error logging
import os
from dotenv import load_dotenv
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Load environment variables
load_dotenv()
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key')  # Load from .env
CORS(app)

# MongoDB connection
try:
    client = MongoClient(os.getenv('MONGO_URI', 'mongodb://localhost:27017/'))
    db = client['notesdb']
    notes_collection = db['notes']
    users_collection = db['users']
    otp_collection = db['otps']  # New collection for storing OTPs
    print("MongoDB connection successful")
except Exception as e:
    print(f"MongoDB connection error: {e}")

# Email configuration - updated to match your .env variable names
EMAIL_USER = os.getenv('MAIL_USERNAME', 'your-email@gmail.com')  
EMAIL_PASSWORD = os.getenv('MAIL_PASSWORD', '')  # App password from Google
EMAIL_SERVER = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
EMAIL_PORT = int(os.getenv('MAIL_PORT', 587))

# Improved email sending function with detailed debugging
def send_email(to_email, subject, body):
    try:
        print(f"Sending email to: {to_email}")
        msg = MIMEMultipart()
        msg['From'] = EMAIL_USER
        msg['To'] = to_email
        msg['Subject'] = subject
        
        msg.attach(MIMEText(body, 'plain'))
        
        print("Connecting to SMTP server...")
        server = smtplib.SMTP(EMAIL_SERVER, EMAIL_PORT)
        
        print("Starting TLS...")
        server.starttls()
        
        # Detailed debugging
        server.set_debuglevel(1)
        
        print(f"Logging in with {EMAIL_USER}...")
        server.login(EMAIL_USER, EMAIL_PASSWORD)
        
        print("Sending message...")
        server.send_message(msg)
        
        print("Quitting server...")
        server.quit()
        
        print("Email sent successfully")
        return True
    except Exception as e:
        print(f"Email error: {str(e)}")
        print(f"Error type: {type(e).__name__}")
        traceback.print_exc()
        return False

# Function to generate a random OTP
def generate_otp(length=6):
    return ''.join(random.choices(string.digits, k=length))

# JWT token verification decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = users_collection.find_one({'_id': ObjectId(data['user_id'])})
            
            if not current_user:
                return jsonify({'message': 'User not found!'}), 401
            
            if not current_user.get('verified', False):
                return jsonify({'message': 'Account not verified!'}), 403
        except Exception as e:
            print(f"Token verification error: {e}")
            return jsonify({'message': 'Token is invalid!'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

# User registration endpoint with OTP generation
@app.route('/api/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        
        # Validate input
        if not data or not data.get('name') or not data.get('email') or not data.get('password'):
            return jsonify({'message': 'Missing required fields!'}), 400
        
        # Print received data for debugging (remove in production)
        print(f"Signup request data: {data}")
        
        # Check if email already exists
        if users_collection.find_one({'email': data['email']}):
            return jsonify({'message': 'User already exists!'}), 409
        
        # Hash the password
        hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
        
        # Create new user (unverified)
        new_user = {
            'name': data['name'],
            'email': data['email'],
            'password': hashed_password.decode('utf-8'),
            'verified': False,  # User starts as unverified
            'created_at': datetime.datetime.utcnow()
        }
        
        result = users_collection.insert_one(new_user)
        user_id = str(result.inserted_id)
        
        # Generate OTP
        otp = generate_otp()
        otp_expiry = datetime.datetime.utcnow() + datetime.timedelta(minutes=10)  # OTP valid for 10 minutes
        
        # Store OTP
        otp_data = {
            'user_id': user_id,
            'email': data['email'],
            'otp': otp,
            'expires_at': otp_expiry,
            'verified': False
        }
        otp_collection.insert_one(otp_data)
        
        # Print the OTP clearly in the console
        print("\n" + "="*50)
        print(f"🔑 OTP FOR USER {data['email']}: {otp}")
        print("="*50 + "\n")
        
        # Try to send email, but don't worry if it fails
        try:
            email_subject = "Verify Your Notes App Account"
            email_body = f"""Hello {data['name']},

Your verification code is: {otp}

This code will expire in 10 minutes.

Thank you for using Notes App!"""
            
            send_email(data['email'], email_subject, email_body)
        except Exception as e:
            print(f"Email sending failed, but OTP is available in logs: {str(e)}")
        
        return jsonify({
            'message': 'User created successfully! Check the console for OTP code.',
            'id': user_id,
            'email': data['email']
        }), 201
        
    except Exception as e:
        print(f"Signup error: {e}")
        print(traceback.format_exc())  # Detailed error information
        return jsonify({'message': f'Server error: {str(e)}'}), 500

# Modified OTP verification endpoint to automatically log in user after successful verification
@app.route('/api/verify-otp', methods=['POST'])
def verify_otp():
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('otp'):
            return jsonify({'message': 'Email and OTP are required!'}), 400
        
        print(f"Verifying OTP: {data['otp']} for email: {data['email']}")
        
        # Find the OTP record
        otp_record = otp_collection.find_one({
            'email': data['email'],
            'otp': data['otp'],
            'verified': False,
            'expires_at': {'$gt': datetime.datetime.utcnow()}  # OTP not expired
        })
        
        if not otp_record:
            print(f"Invalid OTP attempt: {data['otp']} for email: {data['email']}")
            return jsonify({'message': 'Invalid or expired OTP!'}), 400
        
        # Mark OTP as verified
        otp_collection.update_one(
            {'_id': otp_record['_id']},
            {'$set': {'verified': True}}
        )
        
        # Mark user as verified
        user = users_collection.find_one({'_id': ObjectId(otp_record['user_id'])})
        users_collection.update_one(
            {'_id': ObjectId(otp_record['user_id'])},
            {'$set': {'verified': True}}
        )
        
        print(f"User verified successfully: {data['email']}")
        
        # Generate JWT token for automatic login
        token = jwt.encode({
            'user_id': str(user['_id']),
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
        }, app.config['SECRET_KEY'])
        
        # Return token and user info for automatic login
        return jsonify({
            'message': 'Account verified successfully!',
            'token': token,
            'user_id': str(user['_id']),
            'name': user['name'],
            'verified': True
        }), 200
    except Exception as e:
        print(f"Verify OTP error: {e}")
        return jsonify({'message': f'Server error: {str(e)}'}), 500

# Resend OTP endpoint
@app.route('/api/resend-otp', methods=['POST'])
def resend_otp():
    try:
        data = request.get_json()
        
        if not data or not data.get('email'):
            return jsonify({'message': 'Email is required!'}), 400
        
        # Find user
        user = users_collection.find_one({'email': data['email']})
        if not user:
            return jsonify({'message': 'User not found!'}), 404
        
        if user.get('verified', False):
            return jsonify({'message': 'User is already verified!'}), 400
        
        # Generate new OTP
        otp = generate_otp()
        otp_expiry = datetime.datetime.utcnow() + datetime.timedelta(minutes=10)
        
        # Update existing OTP or create new one
        otp_collection.update_one(
            {'email': data['email'], 'verified': False},
            {
                '$set': {
                    'otp': otp,
                    'expires_at': otp_expiry
                }
            },
            upsert=True
        )
        
        # Print the OTP clearly in the console
        print("\n" + "="*50)
        print(f"🔑 NEW OTP FOR USER {data['email']}: {otp}")
        print("="*50 + "\n")
        
        # Try to send email, but don't worry if it fails
        try:
            email_subject = "Your New Verification Code - Notes App"
            email_body = f"""Hello,

Your new verification code is: {otp}

This code will expire in 10 minutes.

Thank you for using Notes App!"""
            
            send_email(data['email'], email_subject, email_body)
        except Exception as e:
            print(f"Email sending failed, but OTP is available in logs: {str(e)}")
            
        return jsonify({'message': 'Verification code resent! Check the console for OTP code.'}), 200
    except Exception as e:
        print(f"Resend OTP error: {e}")
        return jsonify({'message': f'Server error: {str(e)}'}), 500

# Update your login endpoint to check if user is verified
@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'message': 'Email and password are required!'}), 400
        
        # Find the user
        user = users_collection.find_one({'email': data['email']})
        
        if not user:
            return jsonify({'message': 'Invalid credentials!'}), 401
        
        # Check if user is verified
        if not user.get('verified', False):
            return jsonify({
                'message': 'Account not verified!',
                'verified': False,
                'email': data['email']
            }), 403
        
        # Check password
        if bcrypt.checkpw(data['password'].encode('utf-8'), user['password'].encode('utf-8')):
            # Generate JWT token
            token = jwt.encode({
                'user_id': str(user['_id']),
                'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
            }, app.config['SECRET_KEY'])
            
            return jsonify({
                'token': token,
                'user_id': str(user['_id']),
                'name': user['name'],
                'verified': True
            }), 200
        
        return jsonify({'message': 'Invalid credentials!'}), 401
    except Exception as e:
        print(f"Login error: {e}")
        print(traceback.format_exc())  # Add detailed traceback
        return jsonify({'message': f'Server error: {str(e)}'}), 500

# Test route to verify API is working
@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({'message': 'API is working!'}), 200

# Get all notes for the current user
@app.route('/api/notes', methods=['GET'])
@token_required
def get_all_notes(current_user):
    try:
        notes = []
        for note in notes_collection.find({'user_id': str(current_user['_id'])}):
            note['_id'] = str(note['_id'])
            notes.append(note)
        return jsonify(notes)
    except Exception as e:
        print(f"Get notes error: {e}")
        return jsonify({'message': f'Server error: {str(e)}'}), 500

# Create a new note
@app.route('/api/notes', methods=['POST'])
@token_required
def add_note(current_user):
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data or 'title' not in data or 'content' not in data:
            return jsonify({'message': 'Title and content are required!'}), 400
        
        # Create the note object
        note = {
            'title': data['title'],
            'content': data['content'],
            'user_id': str(current_user['_id']),
            'created_at': datetime.datetime.utcnow()
        }
        
        # Insert the note
        result = notes_collection.insert_one(note)
        
        # Return the note ID
        return jsonify({
            'message': 'Note created successfully!',
            '_id': str(result.inserted_id)
        }), 201
    except Exception as e:
        print(f"Add note error: {e}")
        print(traceback.format_exc())  # Add detailed traceback
        return jsonify({'message': f'Server error: {str(e)}'}), 500

# Get a specific note
@app.route('/api/notes/<id>', methods=['GET'])
@token_required
def get_note(current_user, id):
    try:
        note = notes_collection.find_one({'_id': ObjectId(id), 'user_id': str(current_user['_id'])})
        if note:
            note['_id'] = str(note['_id'])
            return jsonify(note)
        return jsonify({'message': 'Note not found'}), 404
    except Exception as e:
        print(f"Get note error: {e}")
        return jsonify({'message': f'Server error: {str(e)}'}), 500

# Update a note
@app.route('/api/notes/<id>', methods=['PUT'])
@token_required
def update_note(current_user, id):
    try:
        data = request.get_json()
        notes_collection.update_one(
            {'_id': ObjectId(id), 'user_id': str(current_user['_id'])},
            {'$set': {'title': data['title'], 'content': data['content']}}
        )
        return jsonify({'message': 'Note updated'})
    except Exception as e:
        print(f"Update note error: {e}")
        return jsonify({'message': f'Server error: {str(e)}'}), 500

# Delete a note
@app.route('/api/notes/<id>', methods=['DELETE'])
@token_required
def delete_note(current_user, id):
    try:
        notes_collection.delete_one({'_id': ObjectId(id), 'user_id': str(current_user['_id'])})
        return jsonify({'message': 'Note deleted'})
    except Exception as e:
        print(f"Delete note error: {e}")
        return jsonify({'message': f'Server error: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True)
