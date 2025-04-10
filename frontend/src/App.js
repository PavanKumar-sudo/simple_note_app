import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = "http://localhost:5000/api/notes"; // Update this when deploying!

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setNotes(response.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch notes. Please try again later.');
      setLoading(false);
    }
  };

  const createNote = async () => {
    if (!title || !content) {
      setError('Title and content cannot be empty.');
      return;
    }
    try {
      await axios.post(API_URL, { title, content });
      setTitle('');
      setContent('');
      setError('');
      fetchNotes();
    } catch (err) {
      console.error(err);
      setError('Failed to create note. Please try again.');
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setError('');
      fetchNotes();
    } catch (err) {
      console.error(err);
      setError('Failed to delete note. Please try again.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Simple Notes App</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <input 
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        /><br/>
        <textarea
          placeholder="Content"
          value={content}
          onChange={e => setContent(e.target.value)}
        /><br/>
        <button onClick={createNote}>Add Note</button>
      </div>

      <hr />

      <h2>All Notes</h2>

      {loading ? (
        <p>Loading notes...</p>
      ) : (
        notes.map(note => (
          <div key={note.id} style={{ border: '1px solid gray', padding: '10px', marginBottom: '10px' }}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <button onClick={() => deleteNote(note.id)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
}

export default App;
