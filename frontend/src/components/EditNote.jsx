import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const EditNote = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { authFetch } = useContext(AuthContext);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await authFetch(`http://localhost:5000/api/notes/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch note');
        }
        
        const data = await response.json();
        setTitle(data.title);
        setContent(data.content);
        setLoading(false);
      } catch (error) {
        setError('Error fetching note: ' + error.message);
        console.error('Error fetching note:', error);
        setLoading(false);
      }
    };

    fetchNote();
  }, [id, authFetch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    try {
      const response = await authFetch(`http://localhost:5000/api/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        throw new Error('Failed to update note');
      }

      navigate('/');
    } catch (error) {
      setError('Error updating note: ' + error.message);
      console.error('Error updating note:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="edit-note">
      <h2>Edit Note</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="10"
            required
          ></textarea>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-primary">Update Note</button>
          <button type="button" className="btn-secondary" onClick={() => navigate('/')}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditNote;