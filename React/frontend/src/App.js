import logo from './logo.svg';
import './App.css';
import  './index.css';
import { useEffect, useState} from 'react';
import { useApi, request} from "../src/hooks/useApi";
import  ItemManager  from '../src/page/ItemManager';
import  Login  from './components/login';


function App() {
  const [user, setUser] = useState(null); // Stores {username, is_admin}
  const { request } = useApi();

  // src/App.js
  const handleLogout = async () => {
  const res = await request('POST', 'logout/');
  if (res.success) {
    setUser(null); // This MUST trigger to hide the buttons
    window.location.reload(); // Hard refresh to clear any residual cache
  }
};


  if (!user) {
    return <Login onLoginSuccess={(userData) => setUser(userData)} />;
  }

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>Welcome, {user.username} {user.is_admin ? "(Admin)" : "(User)"}</span>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <ItemManager user={user} /> {/* Pass user down for button logic */}
    </div>
  );
}


export default App;
