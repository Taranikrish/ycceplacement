import { createSlice } from '@reduxjs/toolkit'

const storedAuth = JSON.parse(localStorage.getItem('auth'))

const initialState = {
  user: storedAuth?.user || null,
  token: storedAuth?.token || null,
  role: storedAuth?.role || null,
  loading: false,
  error: null
}


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    handleGoogleCallback: (state, action) => {
      const { user, token } = action.payload

      state.user = user
      state.role = user.role
      state.token = token
      state.loading = false
      state.error = null

      localStorage.setItem(
        'auth',
        JSON.stringify({ user, role: user.role, token })
      )
    },

    logout: (state) => {
      state.user = null
      state.token = null
      state.role = null
      localStorage.removeItem('auth')
    }
  }
})

export const { handleGoogleCallback, logout } = authSlice.actions
export default authSlice.reducer
