import React, { useState } from 'react';
import axios from 'axios';

function Login({ setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // 1. POST request to our new login endpoint
      const response = await axios.post('http://127.0.0.1:8000/api/login/', {
        username,
        password
      });

      // 2. Save token and user info to LocalStorage (Browser memory)
      localStorage.setItem('token', response.data.access);
      const userData = { 
        name: response.data.username, 
        is_admin: response.data.is_admin 
      };
      localStorage.setItem('user', JSON.stringify(userData));

      // 3. Update the App's state
      setUser(userData);
      setError('');
    } catch (err) {
      // CATCH ERROR: If password is wrong or server is down
      setError("Invalid username or password");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
export default Login;