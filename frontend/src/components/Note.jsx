// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';

// const Note = ({ note, onDelete }) => {
//   const [showConfirm, setShowConfirm] = useState(false);

//   const handleDelete = () => {
//     setShowConfirm(true);
//   };

//   const confirmDelete = () => {
//     onDelete(note._id);
//     setShowConfirm(false);
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   return (
//     <div className="note-card">
//       <Link to={`/edit/${note._id}`} className="note-title">
//         {note.title}
//       </Link>
//       <p className="note-content">{note.content}</p>
//       <div className="note-footer">
//         <span className="note-date">{formatDate(note.date)}</span>
//         <button 
//           onClick={handleDelete}
//           className="btn btn-danger"
//         >
//           Delete
//         </button>
//       </div>

//       {/* Confirmation Dialog */}
//       {showConfirm && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <h3 className="modal-title">Confirm Delete</h3>
//             <p className="modal-text">Are you sure you want to delete this note? This action cannot be undone.</p>
//             <div className="modal-actions">
//               <button
//                 onClick={() => setShowConfirm(false)}
//                 className="btn btn-secondary"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmDelete}
//                 className="btn btn-danger"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Note;

















import React from 'react';
import { Link } from 'react-router-dom';

function Note({ note }) {
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

  return (
    <div className="card">
      <h3 className="card-title">{note.title}</h3>
      <p className="card-content">
        {note.content.length > 100 
          ? `${note.content.substring(0, 100)}...` 
          : note.content}
      </p>
      <div className="card-footer">
        <span>{formatDate(note.date)}</span>
        <Link to={`/note/${note._id}`} className="link">
          View Note
        </Link>
      </div>
    </div>
  );
}

export default Note;