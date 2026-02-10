// src/components/Login.js
import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';

function Login({ onLoginSuccess }) {
  const [creds, setCreds] = useState({ username: '', password: '' });
  const { request, error, loading } = useApi();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await request('POST', 'login/', creds);
    if (res.success) {
      onLoginSuccess(res.payload); // Pass user data (is_admin) to parent
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '10px' }}>
      <h3>Login</h3>
      <input 
        placeholder="Username" 
        onChange={e => setCreds({...creds, username: e.target.value})} 
      />
      <input 
        type="password" 
        placeholder="Password" 
        onChange={e => setCreds({...creds, password: e.target.value})} 
      />
      <button type="submit" disabled={loading}>Login</button>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </form>
  );
}

export default Login;