import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const NotesList = () => {
  const [notes, setNotes] = useState([]);
  const { authFetch } = useContext(AuthContext);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await authFetch('http://localhost:5000/api/notes');
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const deleteNote = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await authFetch(`http://localhost:5000/api/notes/${id}`, {
          method: 'DELETE',
        });
        setNotes(notes.filter(note => note._id !== id));
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  return (
    <div className="notes-list">
      <h2>My Notes</h2>
      {notes.length === 0 ? (
        <p>No notes yet. <Link to="/create">Create your first note</Link></p>
      ) : (
        <div className="notes-grid">
          {notes.map(note => (
            <div key={note._id} className="note-card">
              <h3>{note.title}</h3>
              <p>{note.content.substring(0, 100)}...</p>
              <div className="note-actions">
                <Link to={`/edit/${note._id}`} className="edit-button">Edit</Link>
                <button onClick={() => deleteNote(note._id)} className="delete-button">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesList;