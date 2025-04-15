// import axios from 'axios';

// const API_URL = 'http://localhost:5000/api';

// // Create axios instance
// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Get all notes
// export const getNotes = async () => {
//   const response = await api.get('/notes');
//   return response.data;
// };

// // Get a single note
// export const getNote = async (id) => {
//   const response = await api.get(`/notes/${id}`);
//   return response.data;
// };

// // Create a new note
// export const createNote = async (note) => {
//   const response = await api.post('/notes', note);
//   return response.data;
// };

// // Update a note
// export const updateNote = async (id, note) => {
//   const response = await api.put(`/notes/${id}`, note);
//   return response.data;
// };

// // Delete a note
// export const deleteNote = async (id) => {
//   const response = await api.delete(`/notes/${id}`);
//   return response.data;
// };
















import axios from 'axios';

//const API_URL = 'https://notes-app-xcx4.onrender.com/api';
const API_URL = 'http://localhost:5000/api';

export const getNotes = async () => {
  try {
    const response = await axios.get(`${API_URL}/notes/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
};

export const getNote = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/notes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching note ${id}:`, error);
    throw error;
  }
};

export const createNote = async (noteData) => {
  try {
    const response = await axios.post(`${API_URL}/notes/`, noteData);
    return response.data;
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
};

export const updateNote = async (id, formData) => {
  const response = await fetch(`/api/notes/${id}`, {
    method: 'PUT',
    body: formData,
  });
  return await response.json();
};

export const deleteNote = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/notes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting note ${id}:`, error);
    throw error;
  }
};









// import axios from 'axios';

// // Define the base URL for API requests
// const API_URL = 'http://localhost:5000/api';

// // Type for the note data
// export interface NoteType {
//   _id: string;
//   title: string;
//   content: string;
//   date: string;
//   file_name?: string;
// }

// // Generic API response type
// interface ApiResponse<T = any> {
//   success: boolean;
//   data: T;
// }

// // Get all notes
// export const getNotes = async (): Promise<NoteType[]> => {
//   try {
//     const response = await axios.get<ApiResponse<NoteType[]>>(`${API_URL}/notes/`);
//     return response.data.data; // Assuming response data is in `data` property
//   } catch (error) {
//     console.error('Error fetching notes:', error);
//     throw error;
//   }
// };

// // Get a specific note by ID
// export const getNote = async (id: string): Promise<NoteType> => {
//   try {
//     const response = await axios.get<ApiResponse<NoteType[]>>(`${API_URL}/notes/${id}`);
//     return response.data?.notes; // Assuming response data is in `data` property
//   } catch (error) {
//     console.error(`Error fetching note ${id}:`, error);
//     throw error;
//   }
// };

// // Create a new note
// export const createNote = async (noteData: NoteType): Promise<NoteType> => {
//   try {
//     const response = await axios.post<ApiResponse<NoteType>>(`${API_URL}/notes/`, noteData);
//     return response.data.data; // Assuming response data is in `data` property
//   } catch (error) {
//     console.error('Error creating note:', error);
//     throw error;
//   }
// };

// // Update an existing note
// export const updateNote = async (id: string, formData: FormData): Promise<NoteType> => {
//   const response = await fetch(`/api/notes/${id}`, {
//     method: 'PUT',
//     body: formData,
//   });
//   return await response.json();
// };

// // Delete a note
// export const deleteNote = async (id: string): Promise<void> => {
//   try {
//     const response = await axios.delete<ApiResponse>(`${API_URL}/notes/${id}`);
//     if (!response.data.success) {
//       throw new Error('Failed to delete note');
//     }
//   } catch (error) {
//     console.error(`Error deleting note ${id}:`, error);
//     throw error;
//   }
// };
