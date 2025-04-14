# from flask import Blueprint, request, jsonify
# from models.note import Note
# from datetime import datetime
# from bson.errors import InvalidId

# notes_bp = Blueprint('notes', __name__)

# def init_notes_routes(app, mongo):
#     note_model = Note(mongo)
    
#     @notes_bp.route('/notes', methods=['GET'])
#     def get_notes():
#         try:
#             notes = note_model.get_all_notes()
#             return jsonify(notes)
#         except Exception as e:
#             return jsonify({'error': str(e)}), 500
    
#     @notes_bp.route('/notes', methods=['POST'])
#     def create_note():
#         try:
#             data = request.get_json()
#             if not data:
#                 return jsonify({'error': 'No data provided'}), 400
#             if not data.get('title'):
#                 return jsonify({'error': 'Title is required'}), 400
                
#             note_id = note_model.create_note(data['title'], data.get('content', ''))
#             return jsonify({'id': note_id}), 201
#         except ValueError as e:
#             return jsonify({'error': str(e)}), 400
#         except Exception as e:
#             return jsonify({'error': str(e)}), 500
    
#     @notes_bp.route('/notes/<note_id>', methods=['GET'])
#     def get_note(note_id):
#         try:
#             note = note_model.get_note_by_id(note_id)
#             if not note:
#                 return jsonify({'error': 'Note not found'}), 404
#             return jsonify(note)
#         except ValueError as e:
#             return jsonify({'error': str(e)}), 400
#         except Exception as e:
#             return jsonify({'error': str(e)}), 500
    
#     @notes_bp.route('/notes/<note_id>', methods=['PUT'])
#     def update_note(note_id):
#         try:
#             data = request.get_json()
#             if not data:
#                 return jsonify({'error': 'No data provided'}), 400
#             if not data.get('title'):
#                 return jsonify({'error': 'Title is required'}), 400
                
#             success = note_model.update_note(note_id, data['title'], data.get('content', ''))
#             if not success:
#                 return jsonify({'error': 'Note not found'}), 404
#             return jsonify({'message': 'Note updated successfully'})
#         except ValueError as e:
#             return jsonify({'error': str(e)}), 400
#         except Exception as e:
#             return jsonify({'error': str(e)}), 500
    
#     @notes_bp.route('/notes/<note_id>', methods=['DELETE'])
#     def delete_note(note_id):
#         try:
#             success = note_model.delete_note(note_id)
#             if not success:
#                 return jsonify({'error': 'Note not found'}), 404
#             return jsonify({'message': 'Note deleted successfully'})
#         except ValueError as e:
#             return jsonify({'error': str(e)}), 400
#         except Exception as e:
#             return jsonify({'error': str(e)}), 500
    
#     app.register_blueprint(notes_bp, url_prefix='/api')


















# from flask import Blueprint, request, jsonify
# from pymongo import MongoClient
# import os
# from models.note import Note
# from bson.errors import InvalidId

# notes_bp = Blueprint('notes', __name__)

# # Connect to MongoDB
# # Change this line to explicitly specify the database name
# mongodb_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/notes_app')
# client = MongoClient(mongodb_uri)
# # Extract database name from URI or use a default name
# db_name = mongodb_uri.split('/')[-1] if '/' in mongodb_uri else 'notes_app'
# db = client[db_name]
# note_model = Note(db)

# @notes_bp.route('/', methods=['GET'])
# def get_all_notes():
#     try:
#         notes = note_model.get_all()
#         return jsonify({"success": True, "notes": notes}), 200
#     except Exception as e:
#         return jsonify({"success": False, "error": str(e)}), 500

# @notes_bp.route('/<note_id>', methods=['GET'])
# def get_note(note_id):
#     try:
#         note = note_model.get_by_id(note_id)
#         if note:
#             return jsonify({"success": True, "note": note}), 200
#         return jsonify({"success": False, "error": "Note not found"}), 404
#     except InvalidId:
#         return jsonify({"success": False, "error": "Invalid note ID"}), 400
#     except Exception as e:
#         return jsonify({"success": False, "error": str(e)}), 500

# @notes_bp.route('/', methods=['POST'])
# def create_note():
#     try:
#         data = request.get_json()
#         if not data:
#             return jsonify({"success": False, "error": "No data provided"}), 400
        
#         title = data.get('title')
#         content = data.get('content')
        
#         if not title or not content:
#             return jsonify({"success": False, "error": "Title and content are required"}), 400
        
#         note_id = note_model.create(title, content)
#         return jsonify({"success": True, "message": "Note created", "id": note_id}), 201
#     except Exception as e:
#         return jsonify({"success": False, "error": str(e)}), 500

# @notes_bp.route('/<note_id>', methods=['PUT'])
# def update_note(note_id):
#     try:
#         data = request.get_json()
#         if not data:
#             return jsonify({"success": False, "error": "No data provided"}), 400
        
#         title = data.get('title')
#         content = data.get('content')
        
#         if not title or not content:
#             return jsonify({"success": False, "error": "Title and content are required"}), 400
        
#         success = note_model.update(note_id, title, content)
#         if success:
#             return jsonify({"success": True, "message": "Note updated"}), 200
#         return jsonify({"success": False, "error": "Note not found"}), 404
#     except InvalidId:
#         return jsonify({"success": False, "error": "Invalid note ID"}), 400
#     except Exception as e:
#         return jsonify({"success": False, "error": str(e)}), 500

# @notes_bp.route('/<note_id>', methods=['DELETE'])
# def delete_note(note_id):
#     try:
#         success = note_model.delete(note_id)
#         if success:
#             return jsonify({"success": True, "message": "Note deleted"}), 200
#         return jsonify({"success": False, "error": "Note not found"}), 404
#     except InvalidId:
#         return jsonify({"success": False, "error": "Invalid note ID"}), 400
#     except Exception as e:
#         return jsonify({"success": False, "error": str(e)}), 500











from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from pymongo import MongoClient
from models.note import Note
import os

# Create blueprint
notes_bp = Blueprint('notes', __name__)

# Setup MongoDB
client = MongoClient(os.getenv("MONGODB_URI", "mongodb://localhost:27017/"))
db = client.notes_app  # Change if your DB is named differently
notes_model = Note(db)

# File upload config
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'docx'}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Routes

@notes_bp.route('/', methods=['GET'])
def get_notes():
    notes = notes_model.get_all()
    return jsonify(success=True, notes=notes)

@notes_bp.route('/<note_id>', methods=['GET'])
def get_note(note_id):
    note = notes_model.get_by_id(note_id)
    if note:
        return jsonify(success=True, note=note)
    else:
        return jsonify(success=False, message="Note not found"), 404

@notes_bp.route('/', methods=['POST'])
def create_note():
    title = request.form.get('title')
    content = request.form.get('content')
    file = request.files.get('file')

    file_name = None
    if file and allowed_file(file.filename):
        file_name = secure_filename(file.filename)
        file.save(os.path.join(UPLOAD_FOLDER, file_name))

    note_id = notes_model.create(title, content, file_name)
    return jsonify(success=True, note_id=note_id)

@notes_bp.route('/<note_id>', methods=['PUT'])
def update_note(note_id):
    title = request.form.get('title')
    content = request.form.get('content')
    file = request.files.get('file')

    file_name = None
    if file and allowed_file(file.filename):
        file_name = secure_filename(file.filename)
        file.save(os.path.join(UPLOAD_FOLDER, file_name))

    updated = notes_model.update(note_id, title, content, file_name)
    if updated:
        return jsonify(success=True)
    else:
        return jsonify(success=False, message="Update failed"), 400

@notes_bp.route('/<note_id>', methods=['DELETE'])
def delete_note(note_id):
    deleted = notes_model.delete(note_id)
    if deleted:
        return jsonify(success=True)
    else:
        return jsonify(success=False, message="Delete failed"), 400
