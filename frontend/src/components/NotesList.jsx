import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function NotesList() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authFetch } = useContext(AuthContext);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      // Use authFetch to get notes
      const response = await authFetch('http://localhost:5000/api/notes');
      
      // With axios, the response data is in response.data, not response.json()
      setNotes(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError('Failed to load notes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete note function
  const deleteNote = async (id) => {
    try {
      await authFetch(`http://localhost:5000/api/notes/${id}`, {
        method: 'DELETE'
      });
      // After deletion, update the notes list
      fetchNotes();
    } catch (err) {
      console.error('Error deleting note:', err);
      setError('Failed to delete note. Please try again.');
    }
  };

  if (loading) return <div className="loading">Loading notes...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="notes-container">
      <div className="notes-header">
        <h2>Your Notes</h2>
        <Link to="/create" className="add-button">Add New Note</Link>
      </div>
      
      {notes.length === 0 ? (
        <div className="empty-notes">
          <p>You don't have any notes yet. Create your first note!</p>
        </div>
      ) : (
        <div className="notes-grid">
          {notes.map(note => (
            <div key={note._id} className="note-card">
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              <div className="note-actions">
                <Link to={`/edit/${note._id}`} className="edit-button">Edit</Link>
                <button 
                  onClick={() => deleteNote(note._id)} 
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotesList;