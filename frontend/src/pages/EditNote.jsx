// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { getNote, updateNote } from '../api';

// const EditNote = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');
//   const [date, setDate] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchNote();
//   }, [id]);

//   const fetchNote = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const note = await getNote(id);
//       setTitle(note.title);
//       setContent(note.content);
//       setDate(note.date || new Date().toISOString().split('T')[0]);
//     } catch (err) {
//       setError('Failed to fetch note. Please try again.');
//       console.error('Error fetching note:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!title.trim() || !content.trim() || !date) {
//       setError('Title, content, and date are required');
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);
//       await updateNote(id, { title, content, date });
//       navigate('/');
//     } catch (err) {
//       setError('Failed to update note. Please try again.');
//       console.error('Error updating note:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="page-container">
//         <div className="loading-spinner" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="page-container">
//         <div className="error-message">
//           {error}
//           <button onClick={fetchNote} className="btn btn-primary">
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="page-container">
//       <div className="header">
//         <h1 className="header-title">Edit Note</h1>
//       </div>

//       <div className="card">
//         <form onSubmit={handleSubmit} className="form">
//           <div className="form-group">
//             <label htmlFor="title" className="form-label">Title</label>
//             <input
//               type="text"
//               id="title"
//               className={`form-input ${error && !title.trim() ? 'error' : ''}`}
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="Enter note title"
//             />
//             {error && !title.trim() && (
//               <p className="error-message">Title is required</p>
//             )}
//           </div>

//           <div className="form-group">
//             <label htmlFor="date" className="form-label">Date</label>
//             <input
//               type="date"
//               id="date"
//               className={`form-input ${error && !date ? 'error' : ''}`}
//               value={date}
//               onChange={(e) => setDate(e.target.value)}
//             />
//             {error && !date && (
//               <p className="error-message">Date is required</p>
//             )}
//           </div>

//           <div className="form-group">
//             <label htmlFor="content" className="form-label">Content</label>
//             <textarea
//               id="content"
//               className={`form-textarea ${error && !content.trim() ? 'error' : ''}`}
//               value={content}
//               onChange={(e) => setContent(e.target.value)}
//               placeholder="Enter note content"
//             />
//             {error && !content.trim() && (
//               <p className="error-message">Content is required</p>
//             )}
//           </div>

//           <div className="form-actions">
//             <button
//               type="button"
//               className="btn btn-secondary"
//               onClick={() => navigate('/')}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="btn btn-primary"
//               disabled={loading}
//             >
//               {loading ? 'Saving...' : 'Save Changes'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditNote; 
























import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import NoteForm from '../components/NoteForm';
import { getNote, updateNote } from '../api';

function EditNote() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await getNote(id);
        if (response.success) {
          setNote(response.note);
        } else {
          setError('Failed to fetch note');
        }
      } catch (err) {
        setError('Error connecting to server');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      const response = await updateNote(id, formData);
      if (response.success) {
        navigate(`/note/${id}`);
      } else {
        setError('Failed to update note');
      }
    } catch (err) {
      console.error(err);
      setError('Error connecting to server');
    }
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        {error}
      </div>
    );
  }

  if (!note) {
    return (
      <div className="notes-empty">
        <p>Note not found</p>
        <div className="mt-3 text-center">
          <Link to="/" className="link">
            ← Back to Notes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3">
        <Link to={`/note/${id}`} className="back-link">
          ← Back to Note
        </Link>
      </div>

      <h2 className="notes-title mb-4">Edit Note</h2>
      
      <NoteForm 
        initialData={note} 
        onSubmit={handleSubmit} 
        buttonText="Update Note" 
      />
    </div>
  );
}

export default EditNote;