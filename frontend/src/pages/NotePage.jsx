// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { getNote, updateNote, createNote } from '../api';
// import NoteForm from '../components/NoteForm';

// const NotePage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const isNew = id === 'new';

//   const [note, setNote] = useState({ title: '', content: '' });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchNote = async () => {
//       if (!isNew && id) {
//         try {
//           setLoading(true);
//           setError(null);
//           const response = await getNote(id);
//           if (response.data) {
//             setNote(response.data);
//           } else {
//             setError('Note not found');
//             navigate('/');
//           }
//         } catch (error) {
//           console.error('Error fetching note:', error);
//           setError('Failed to load note. Please try again later.');
//           navigate('/');
//         } finally {
//           setLoading(false);
//         }
//       } else {
//         setLoading(false);
//       }
//     };

//     fetchNote();
//   }, [id, isNew, navigate]);

//   const handleSubmit = async (formData) => {
//     try {
//       setError(null);
//       if (isNew) {
//         await createNote(formData);
//       } else if (id) {
//         await updateNote(id, formData);
//       }
//       navigate('/');
//     } catch (error) {
//       console.error('Error saving note:', error);
//       setError('Failed to save note. Please try again later.');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="bg-red-50 p-4 rounded-md max-w-md w-full mx-4">
//           <div className="flex">
//             <div className="flex-shrink-0">
//               <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//               </svg>
//             </div>
//             <div className="ml-3">
//               <h3 className="text-sm font-medium text-red-800">{error}</h3>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4">
//         <div className="bg-white rounded-lg shadow-sm p-6">
//           <div className="flex items-center justify-between mb-6">
//             <h1 className="text-2xl font-bold text-gray-900">
//               {isNew ? 'Create New Note' : 'Edit Note'}
//             </h1>
//             <button
//               onClick={() => navigate('/')}
//               className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             >
//               <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//               </svg>
//               Back
//             </button>
//           </div>
//           <NoteForm
//             initialData={note}
//             onSubmit={handleSubmit}
//             buttonText={isNew ? 'Create' : 'Update'}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NotePage;























import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getNote, deleteNote } from '../api';

function NotePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

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

  const handleDelete = async () => {
    try {
      const response = await deleteNote(id);
      if (response.success) {
        navigate('/');
      } else {
        setError('Failed to delete note');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error(err);
    }
  };

  // Format the date
  // const formatDate = (dateString) => {
  //   const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  //   return new Date(dateString).toLocaleDateString(undefined, options);
  // };
  const formatDate = () => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date().toLocaleDateString(undefined, options);
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
        <Link to="/" className="back-link">
          ← Back to Notes
        </Link>
      </div>

      <div className="card">
        <h2 className="text-2xl font-bold mb-2">{note.title}</h2>
        <p className="note-meta">Created: {formatDate(note.date)}</p>
        
        <div className="mb-4">
          <p className="whitespace-pre-line">{note.content}</p>
        </div>
        
        <div className="note-actions">
          <Link
            to={`/edit/${note._id}`}
            className="btn btn-primary"
          >
            Edit Note
          </Link>
          
          {!deleteConfirm ? (
            <button
              onClick={() => setDeleteConfirm(true)}
              className="btn btn-danger"
            >
              Delete Note
            </button>
          ) : (
            <div className="note-delete-confirm">
              <button
                onClick={handleDelete}
                className="btn btn-danger"
              >
                Confirm Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        {note.file_name && (
  <div className="mt-2">
    <a href={`/uploads/${note.file_name}`} target="_blank" rel="noopener noreferrer">
      📎 View Attached File
    </a>
  </div>
)}

      </div>
    </div>
  );
}

export default NotePage;















// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import { getNote, deleteNote } from '../api';
// import { NoteType } from '../types';

// function NotePage(): JSX.Element {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const [note, setNote] = useState<NoteType | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);

//   useEffect(() => {
//     const fetchNote = async () => {
//       try {
//         const response = await getNote(id!);
//         if (response.success) {
//           setNote(response.note);
//         } else {
//           setError('Failed to fetch note');
//         }
//       } catch (err) {
//         setError('Error connecting to server');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNote();
//   }, [id]);

//   const handleDelete = async () => {
//     try {
//       const response = await deleteNote(id!);
//       if (response.success) {
//         navigate('/');
//       } else {
//         setError('Failed to delete note');
//       }
//     } catch (err) {
//       setError('Error connecting to server');
//       console.error(err);
//     }
//   };

//   const formatDate = (dateString: string): string => {
//     const options: Intl.DateTimeFormatOptions = {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <div className="spinner"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return <div className="alert alert-danger">{error}</div>;
//   }

//   if (!note) {
//     return (
//       <div className="notes-empty">
//         <p>Note not found</p>
//         <div className="mt-3 text-center">
//           <Link to="/" className="link">
//             ← Back to Notes
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="mb-3">
//         <Link to="/" className="back-link">
//           ← Back to Notes
//         </Link>
//       </div>

//       <div className="card">
//         <h2 className="text-2xl font-bold mb-2">{note.title}</h2>
//         <p className="note-meta">Created: {formatDate(note.date)}</p>

//         <div className="mb-4">
//           <p className="whitespace-pre-line">{note.content}</p>
//         </div>

//         <div className="note-actions">
//           <Link to={`/edit/${note._id}`} className="btn btn-primary">
//             Edit Note
//           </Link>

//           {!deleteConfirm ? (
//             <button onClick={() => setDeleteConfirm(true)} className="btn btn-danger">
//               Delete Note
//             </button>
//           ) : (
//             <div className="note-delete-confirm">
//               <button onClick={handleDelete} className="btn btn-danger">
//                 Confirm Delete
//               </button>
//               <button onClick={() => setDeleteConfirm(false)} className="btn btn-secondary">
//                 Cancel
//               </button>
//             </div>
//           )}
//         </div>

//         {note.file_name && (
//           <div className="mt-2">
//             <a href={`/uploads/${note.file_name}`} target="_blank" rel="noopener noreferrer">
//               📎 View Attached File
//             </a>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default NotePage;