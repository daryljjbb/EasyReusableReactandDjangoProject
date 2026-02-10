import React, { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi';

function ItemManager() {
  // 1. Only pull 'request', 'loading', and 'error' from the hook
  const { request, loading, error } = useApi();
  
  // 2. Create local states for your specific data types
  const [items, setItems] = useState([]); 
  const [user, setUser] = useState(null);
  const [inputValue, setInputValue] = useState('');

  // Function to fetch items and save them to 'items' state
  const refreshList = async () => {
    const res = await request('GET', 'items/');
    if (res.success) {
      setItems(res.payload); // res.payload comes from your hook's return
    }
  };

  useEffect(() => {
    const initPage = async () => {
      // Check user login status
      const userRes = await request('GET', 'user-info/');
      if (userRes.success) setUser(userRes.payload);

      // Fetch the items list
      await refreshList();
    };
    initPage();
  }, []);

  const handleAdd = async () => {
    const res = await request('POST', 'items/', { name: inputValue });
    if (res.success) {
      setInputValue('');
      refreshList();
    }
  };

  // ... (Keep handleEdit and handleDelete but call refreshList() inside them)

   // 3. UPDATE (Edit)
  const handleEdit = async (id, currentName) => {
    const newName = prompt("Update Item Name:", currentName);
    if (newName) {
      await request('PUT', `items/${id}/`, { name: newName });
      refreshList();
    }
  };

  // 4. DELETE
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await request('DELETE', `items/${id}/`);
      refreshList();
    }
  };


  return (
    <div style={{ padding: '20px' }}>
      <h2>Manager Pro</h2>
      
      <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
      <button onClick={handleAdd} disabled={loading}>Add Item</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {/* Use 'items' instead of 'data' */}
        {Array.isArray(items) && items.map(item => (
          <li key={item.id}>
            {item.name}
            {/* Show buttons only if user is logged in AND is_admin is true */}
            {user?.is_admin && (
              <>
                <button onClick={() => handleEdit(item.id, item.name)}>Edit</button>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
export default ItemManager;
