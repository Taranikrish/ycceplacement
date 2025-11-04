import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import App from './App.jsx'
import './index.css'

// Initialize auth on app start
const initializeAuth = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/me`, {
      credentials: 'include'
    });
    if (response.ok) {
      const user = await response.json();
      store.dispatch({
        type: 'auth/loginUser/fulfilled',
        payload: { user, token: 'session-token' }
      });
    }
  } catch (error) {
    console.log('No active session');
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
