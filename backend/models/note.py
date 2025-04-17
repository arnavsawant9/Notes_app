# from datetime import datetime
# from flask_pymongo import PyMongo
# from bson import ObjectId

# class Note:
#     def __init__(self, mongo):
#         self.mongo = mongo
    
#     def validate_note(self, title, content):
#         if not title or len(title.strip()) == 0:
#             raise ValueError("Title cannot be empty")
#         if len(title) > 100:
#             raise ValueError("Title cannot be longer than 100 characters")
#         if content and len(content) > 10000:
#             raise ValueError("Content cannot be longer than 10000 characters")
    
#     def create_note(self, title, content):
#         self.validate_note(title, content)
#         note_data = {
#             'title': title.strip(),
#             'content': content.strip() if content else '',
#             'created_at': datetime.utcnow(),
#             'updated_at': datetime.utcnow()
#         }
#         result = self.mongo.db.notes.insert_one(note_data)
#         return str(result.inserted_id)
    
#     def get_all_notes(self):
#         notes = list(self.mongo.db.notes.find().sort('updated_at', -1))
#         for note in notes:
#             note['_id'] = str(note['_id'])
#         return notes
    
#     def get_note_by_id(self, note_id):
#         try:
#             note = self.mongo.db.notes.find_one({'_id': ObjectId(note_id)})
#             if note:
#                 note['_id'] = str(note['_id'])
#             return note
#         except Exception as e:
#             raise ValueError(f"Invalid note ID: {str(e)}")
    
#     def update_note(self, note_id, title, content):
#         self.validate_note(title, content)
#         try:
#             result = self.mongo.db.notes.update_one(
#                 {'_id': ObjectId(note_id)},
#                 {'$set': {
#                     'title': title.strip(),
#                     'content': content.strip() if content else '',
#                     'updated_at': datetime.utcnow()
#                 }}
#             )
#             return result.modified_count > 0
#         except Exception as e:
#             raise ValueError(f"Invalid note ID: {str(e)}")
    
#     def delete_note(self, note_id):
#         try:
#             result = self.mongo.db.notes.delete_one({'_id': ObjectId(note_id)})
#             return result.deleted_count > 0
#         except Exception as e:
#             raise ValueError(f"Invalid note ID: {str(e)}")


















from bson import ObjectId
from datetime import datetime
import pymongo
import os

class Note:
    def __init__(self, db):
        self.collection = db.notes

    def get_all(self):
        notes = list(self.collection.find().sort("date", pymongo.DESCENDING))
        for note in notes:
            note["_id"] = str(note["_id"])
        return notes

    def get_by_id(self, note_id):
        try:
            note = self.collection.find_one({"_id": ObjectId(note_id)})
            if note:
                note["_id"] = str(note["_id"])
            return note
        except:
            return None

    def create(self, title, content, file_name=None):
        note = {
            "title": title,
            "content": content,
            "date": datetime.now(),
            "file_name": file_name  # new field
        }
        result = self.collection.insert_one(note)
        return str(result.inserted_id)

    def update(self, note_id, title, content, file_name=None):
        try:
            update_fields = {
                "title": title,
                "content": content,
                "date": datetime.now()
            }
            if file_name:
                update_fields["file_name"] = file_name

            result = self.collection.update_one(
                {"_id": ObjectId(note_id)},
                {"$set": update_fields}
            )
            return result.modified_count > 0
        except:
            return False

    def delete(self, note_id):
        try:
            result = self.collection.delete_one({"_id": ObjectId(note_id)})
            return result.deleted_count > 0
        except:
            return False


