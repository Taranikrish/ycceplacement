import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import { handleGoogleCallback } from './slices/authSlice'
import App from './App.jsx'
import './index.css'

// Initialize auth on app start
const initializeAuth = async () => {
  const authData = JSON.parse(localStorage.getItem('auth'));
  const token = authData?.token;

  try {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/me`, {
      method: 'GET',
      headers,
      credentials: 'include'
    });

    if (response.ok) {
      const user = await response.json();
      // Use the actual action from authSlice
      store.dispatch(handleGoogleCallback({ user, token: token || 'session-token' }));
    } else if (response.status === 401) {
      // Quietly handle unauthorized (user is just not logged in)
      if (token) localStorage.removeItem('auth');
    }
  } catch (error) {
    console.error('Auth initialization failed:', error);
  }
};

(async () => {
  await initializeAuth();
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </StrictMode>,
  );
})();
