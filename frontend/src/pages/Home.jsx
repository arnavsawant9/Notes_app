// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import Note from '../components/Note';
// import { getNotes, deleteNote } from '../api';

// const Home = () => {
//   const [notes, setNotes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchNotes();
//   }, []);

//   const fetchNotes = async () => {
//     try {
//       setLoading(true);
//       const data = await getNotes();
//       setNotes(data);
//       setError(null);
//     } catch (err) {
//       setError('Failed to fetch notes. Please try again later.');
//       console.error('Error fetching notes:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await deleteNote(id);
//       setNotes(notes.filter(note => note._id !== id));
//     } catch (err) {
//       setError('Failed to delete note. Please try again later.');
//       console.error('Error deleting note:', err);
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
//           <button onClick={fetchNotes} className="btn btn-primary">
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="page-container">
//       <div className="header">
//         <h1 className="header-title">My Notes</h1>
//         <Link to="/create" className="btn btn-primary">
//           Create New Note
//         </Link>
//       </div>

//       <div className="container">
//         {notes.length === 0 ? (
//           <div className="empty-state">
//             <p>No notes yet. Create your first note!</p>
//             <Link to="/create" className="btn btn-primary">
//               Create Note
//             </Link>
//           </div>
//         ) : (
//           notes.map(note => (
//             <Note
//               key={note._id}
//               note={note}
//               onDelete={handleDelete}
//             />
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default Home;






















import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Note from '../components/Note';
import { getNotes } from '../api';

function Home() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await getNotes();
        if (response.success) {
          setNotes(response.notes);
        } else {
          setError('Failed to fetch notes');
        }
      } catch (err) {
        setError('Error connecting to server');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

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

  return (
    <div>
      <div className="notes-header">
        <h2 className="notes-title">My Notes</h2>
        <Link
          to="/create"
          className="btn btn-success"
        >
          Create New Note
        </Link>
      </div>

      {notes.length === 0 ? (
        <div className="notes-empty">
          <p>
            You don't have any notes yet. Click the "Create New Note" button to get started!
          </p>
        </div>
      ) : (
        <div className="grid">
          {notes.map((note) => (
            <Note key={note._id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;










// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import Note from '../components/Note';
// import { getNotes } from '../api';
// import { NoteType } from '../types';

// function Home(): JSX.Element {
//   const [notes, setNotes] = useState<NoteType[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchNotes = async () => {
//       try {
//         const response = await getNotes();
//         if (response.success) {
//           setNotes(response.notes);
//         } else {
//           setError('Failed to fetch notes');
//         }
//       } catch (err) {
//         setError('Error connecting to server');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNotes();
//   }, []);

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

//   return (
//     <div>
//       <div className="notes-header">
//         <h2 className="notes-title">My Notes</h2>
//         <Link to="/create" className="btn btn-success">
//           Create New Note
//         </Link>
//       </div>

//       {notes.length === 0 ? (
//         <div className="notes-empty">
//           <p>You don't have any notes yet. Click the "Create New Note" button to get started!</p>
//         </div>
//       ) : (
//         <div className="grid">
//           {notes.map((note) => (
//             <Note key={note._id} note={note} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default Home;
