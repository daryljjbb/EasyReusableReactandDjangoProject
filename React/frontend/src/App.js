import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';
import Login from './components/Login';

function App() {
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);

  const [editingId, setEditingId] = useState(null); // Which item are we editing?
  const [editText, setEditText] = useState("");      // What is the new text?

  // 1. On refresh, check if user is already logged in
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('https://easyreusablereactanddjangoproject.onrender.com/api/items/');
      setItems(response.data);
    } catch (err) {
      console.log("Fetch failed", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

 // React side
const handleSave = async (id) => {
  // 1. Get the token (Digital ID card) from browser storage
  const token = localStorage.getItem('token'); 
  
  try {
    // 2. Try to send the update to the backend
    await axios.put(
      `http://127.0.0.1:8000/api/items/update/${id}/`, 
      { name: editText }, 
      { 
        headers: {
          Authorization: `Bearer ${token}` 
        }
      }
    );

    // 3. SUCCESS: Update the list on the screen and close the edit box
    setItems(items.map(item => item.id === id ? { ...item, name: editText } : item));
    setEditingId(null);
    alert("Update Successful!");

  } catch (err) {
    // 4. ERROR CATCHING: If the code above fails, we land here.
    
    if (err.response) {
      /* 
         THE SERVER TALKED BACK BUT SAID "NO":
         This happens if:
         - You aren't an admin (403 Forbidden)
         - Your token expired (401 Unauthorized)
         - The item ID doesn't exist (404 Not Found)
      */
      console.error("Server Error Data:", err.response.data);
      console.error("Server Error Status:", err.response.status);
      alert(`Server rejected request: ${err.response.status} - ${JSON.stringify(err.response.data)}`);

    } else if (err.request) {
      /* 
         THE SERVER DID NOT ANSWER:
         This happens if:
         - Your Django server is turned off (Not running)
         - The URL is wrong (Typo in the link)
         - You have a network/internet issue
      */
      console.error("No response received:", err.request);
      alert("Cannot connect to the server. Is your Django backend running?");

    } else {
      /* 
         SOMETHING ELSE WENT WRONG:
         This happens if there is a mistake in your JavaScript code itself.
      */
      console.error("Error Message:", err.message);
      alert("An unexpected error occurred: " + err.message);
    }
  }
};
const handleDelete = async (id) => {
  try {
    const token = localStorage.getItem('token'); // Get your "ID Card"
    
    // Send the DELETE request to Django
    await axios.delete(`http://127.0.0.1:8000/api/items/delete/${id}/`, 
      { headers: { Authorization: `Bearer ${token}` } } // The proof we are admin
    );

    // Update the local list so the UI changes immediately
    setItems(items.filter(item => item.id !== id));
  } catch (err) {
    alert("Failed to delete. Are you sure you're an admin?");
  }
};

  return (
    <div className="App">
      {user ? (
        <>
          <p>Welcome, {user.name} ({user.is_admin ? "Admin" : "User"})</p>
          <button onClick={handleLogout}>Logout</button>
          
          <ul>
          {Array.isArray(items) && items.map(item => (
            <li key={item.id}>
              
              {/* 1. If this is the item we are editing, show an Input */}
              {editingId === item.id ? (
                <input 
                  value={editText} 
                  onChange={(e) => setEditText(e.target.value)} 
                />
              ) : (
                <span>{item.name}</span> // Otherwise, just show the name
              )}

              {/* 2. Admin Permissions */}
              {user?.is_admin && (
                <>
                  {editingId === item.id ? (
                    // If editing, show Save button
                    <button onClick={() => handleSave(item.id)}>Save</button>
                  ) : (
                    // If not editing, show Edit button
                    <button onClick={() => {
                      setEditingId(item.id);
                      setEditText(item.name); // Pre-fill the box with the old name
                    }}>Edit</button>
                  )}
                  <button onClick={() => handleDelete(item.id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
        </>
      ) : (
        <Login setUser={setUser} />
      )}
    </div>
  );
}

export default App;