import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password, userType }) => {
    const response = await fetch(`http://localhost:5000/api/${userType}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) throw new Error('Invalid credentials')
    return await response.json() 
  }
)

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
