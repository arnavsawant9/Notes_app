// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { createNote } from '../api';

// const CreateNote = () => {
//   const navigate = useNavigate();
//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');
//   const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!title.trim() || !content.trim() || !date) {
//       setError('Title, content, and date are required');
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);
//       await createNote({ title, content, date });
//       navigate('/');
//     } catch (err) {
//       setError('Failed to create note. Please try again.');
//       console.error('Error creating note:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="page-container">
//       <div className="header">
//         <h1 className="header-title">Create New Note</h1>
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
//               {loading ? 'Creating...' : 'Create Note'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateNote; 





















import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import NoteForm from '../components/NoteForm';
import { createNote } from '../api';
import '../index.css'; // Import the external CSS

function CreateNote() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSubmit = async (noteData) => {
    try {
      setError(null);
      const response = await createNote(noteData);
      if (response.success) {
        navigate('/');
      } else {
        setError('Failed to create note');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error(err);
    }
  };

  return (
    <div className="page-container">
      <div className="header">
        <h1 className="header-title">Create New Note</h1>
      </div>

      <div className="mb-3">
        <Link to="/" className="back-link">
          ← Back to Notes
        </Link>
      </div>

      <div className="card">
        {error && (
          <div className="alert alert-danger error-message">
            {error}
          </div>
        )}

        <NoteForm onSubmit={handleSubmit} buttonText="Create Note" />
      </div>
    </div>
  );
}

export default CreateNote;
