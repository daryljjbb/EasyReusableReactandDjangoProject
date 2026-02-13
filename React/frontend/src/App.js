import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';
import Login from './components/Login';

function App() {
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);

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
      const response = await axios.get('http://127.0.0.1:8000/api/items/');
      setItems(response.data);
    } catch (err) {
      console.log("Fetch failed", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
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
                {item.name}
                {/* 2. ADMIN ONLY BUTTONS: Only shows if user.is_admin is true */}
                {user.is_admin && (
                  <button onClick={() => alert("Admin Edit")}>Edit</button>
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