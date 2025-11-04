import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password, userType }) => {
    // For all user types, redirect to Google OAuth
    // Since backend handles Google auth, we simulate login success for now
    // In production, this would redirect to Google OAuth
    if (userType === 'admin') {
      return {
        user: { email, role: 'admin' },
        token: 'admin-token'
      }
    } else if (userType === 'company') {
      return {
        user: { email, role: 'company' },
        token: 'company-token'
      }
    } else {
      // For student, fetch from backend
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/${userType}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) throw new Error('Invalid credentials')
      return await response.json()
    }
  }
)

// Action to handle Google OAuth callback
export const handleGoogleCallback = (user, token) => ({
  type: 'auth/handleGoogleCallback',
  payload: { user, token }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    role: null,
    loading: false,
    error: null
  },
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.role = null
      localStorage.removeItem('auth')
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.role = action.payload.user.role
        state.token = action.payload.token
        localStorage.setItem('auth', JSON.stringify({
          user: state.user,
          role: state.role,
          token: state.token
        }))
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  }
})

export const { logout } = authSlice.actions
export default authSlice.reducer
