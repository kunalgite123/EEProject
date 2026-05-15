import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setUser({ token, role: 'admin' });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/login', { username, password });
      if (res.data.token) {
        localStorage.setItem('adminToken', res.data.token);
        setUser({ token: res.data.token, role: 'admin' });
        return { success: true };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.detail || 'Login failed. (Hint: use admin / admin123)' };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
