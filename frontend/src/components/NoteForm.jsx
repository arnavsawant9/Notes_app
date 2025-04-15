// import React, { useState, useEffect } from 'react';

// const NoteForm = ({ initialData = { title: '', content: '' }, onSubmit, buttonText = 'Save' }) => {
//   const [note, setNote] = useState(initialData);
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     setNote(initialData);
//   }, [initialData]);

//   const validateForm = () => {
//     const newErrors = {};
//     if (!note.title.trim()) {
//       newErrors.title = 'Title is required';
//     } else if (note.title.length > 100) {
//       newErrors.title = 'Title cannot be longer than 100 characters';
//     }
//     if (note.content && note.content.length > 10000) {
//       newErrors.content = 'Content cannot be longer than 10000 characters';
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setNote(prev => ({ ...prev, [name]: value }));
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setIsSubmitting(true);
//     try {
//       await onSubmit(note);
//     } catch (error) {
//       setErrors({ submit: error.message || 'Failed to save note' });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div>
//         <label htmlFor="title" className="block text-sm font-medium text-gray-700">
//           Title
//         </label>
//         <input
//           type="text"
//           id="title"
//           name="title"
//           value={note.title}
//           onChange={handleChange}
//           className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm
//             ${errors.title ? 'border-red-300' : 'border-gray-300'}`}
//           required
//         />
//         {errors.title && (
//           <p className="mt-1 text-sm text-red-600">{errors.title}</p>
//         )}
//       </div>

//       <div>
//         <label htmlFor="content" className="block text-sm font-medium text-gray-700">
//           Content
//         </label>
//         <textarea
//           id="content"
//           name="content"
//           rows="6"
//           value={note.content}
//           onChange={handleChange}
//           className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm
//             ${errors.content ? 'border-red-300' : 'border-gray-300'}`}
//         />
//         {errors.content && (
//           <p className="mt-1 text-sm text-red-600">{errors.content}</p>
//         )}
//       </div>

//       {errors.submit && (
//         <div className="rounded-md bg-red-50 p-4">
//           <div className="flex">
//             <div className="ml-3">
//               <h3 className="text-sm font-medium text-red-800">
//                 {errors.submit}
//               </h3>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="flex justify-end">
//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white 
//             ${isSubmitting 
//               ? 'bg-blue-400 cursor-not-allowed' 
//               : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
//             }`}
//         >
//           {isSubmitting ? 'Saving...' : buttonText}
//         </button>
//       </div>
//     </form>
//   );
// };

// export default NoteForm;



















// import React, { useState } from 'react';

// function NoteForm({ initialData, onSubmit, buttonText }) {
//   const [title, setTitle] = useState(initialData?.title || '');
//   const [content, setContent] = useState(initialData?.content || '');
//   const [error, setError] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     // Basic validation
//     if (!title.trim() || !content.trim()) {
//       setError('Title and content are required');
//       return;
//     }
    
//     onSubmit({ title, content });
//   };

//   return (
//     <form onSubmit={handleSubmit} className="card">
//       {error && (
//         <div className="alert alert-danger">
//           {error}
//         </div>
//       )}
      
//       <div className="form-group">
//         <label htmlFor="title" className="form-label">
//           Title
//         </label>
//         <input
//           type="text"
//           id="title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           className="form-control"
//           placeholder="Enter note title"
//         />
//       </div>
      
//       <div className="form-group">
//         <label htmlFor="content" className="form-label">
//           Content
//         </label>
//         <textarea
//           id="content"
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           rows="8"
//           className="form-control"
//           placeholder="Enter note content"
//         ></textarea>
//       </div>
      
//       <div className="flex justify-end">
//         <button
//           type="submit"
//           className="btn btn-primary"
//         >
//           {buttonText || 'Save Note'}
//         </button>
//       </div>
//     </form>
//   );
// }

// export default NoteForm;









import React, { useState } from 'react';

function NoteForm({ initialData = {}, onSubmit, buttonText }) {
  const [title, setTitle] = useState(initialData.title || '');
  const [content, setContent] = useState(initialData.content || '');
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (file) {
      formData.append('file', file);
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <div className="form-group">
        <label>Title:</label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
      </div>

      <div className="form-group">
        <label>Content:</label>
        <textarea value={content} onChange={e => setContent(e.target.value)} required />
      </div>

      <div className="form-group">
        <label>Upload File:</label>
        <input type="file" onChange={e => setFile(e.target.files[0])} />
      </div>

      <button type="submit">{buttonText}</button>
    </form>
  );
}

export default NoteForm;
















// import React, { useState, ChangeEvent, FormEvent } from 'react';

// interface NoteFormProps {
//   initialData?: {
//     title?: string;
//     content?: string;
//   };
//   onSubmit: (formData: FormData) => void;
//   buttonText: string;
// }

// const NoteForm: React.FC<NoteFormProps> = ({
//   initialData = {},
//   onSubmit,
//   buttonText
// }) => {
//   const [title, setTitle] = useState<string>(initialData.title || '');
//   const [content, setContent] = useState<string>(initialData.content || '');
//   const [file, setFile] = useState<File | null>(null);

//   const handleSubmit = (e: FormEvent) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append('title', title);
//     formData.append('content', content);
//     if (file) {
//       formData.append('file', file);
//     }
//     onSubmit(formData);
//   };

//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       setFile(e.target.files[0]);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} encType="multipart/form-data">
//       <div className="form-group">
//         <label>Title:</label>
//         <input
//           type="text"
//           value={title}
//           onChange={e => setTitle(e.target.value)}
//           required
//         />
//       </div>

//       <div className="form-group">
//         <label>Content:</label>
//         <textarea
//           value={content}
//           onChange={e => setContent(e.target.value)}
//           required
//         />
//       </div>

//       <div className="form-group">
//         <label>Upload File:</label>
//         <input type="file" onChange={handleFileChange} />
//       </div>

//       <button type="submit">{buttonText}</button>
//     </form>
//   );
// };

// export default NoteForm;
