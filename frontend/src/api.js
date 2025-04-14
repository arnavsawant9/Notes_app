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