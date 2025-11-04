import React, { useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../slices/authSlice.js'

export default function Signin() {
  const { role } = useParams() // will be 'student' | 'company' | 'admin'
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading, error, user } = useSelector((state) => state.auth)

  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google/${role}`
  }

  // Check for auth callback on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    const userData = urlParams.get('user')

    if (token && userData) {
      const user = JSON.parse(decodeURIComponent(userData))
      // Dispatch the fulfilled action directly
      dispatch({
        type: 'auth/loginUser/fulfilled',
        payload: { user, token }
      })
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [dispatch])

  // Redirect after successful login
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin')
      } else if (user.role === 'company') {
        navigate('/company/dashboard')
      } else if (user.role === 'student') {
        navigate('/student/dashboard') // Assuming student dashboard exists
      }
    }
  }, [user, navigate])

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl text-amber-800 text-center font-bold mb-6 capitalize">
        Sign-in to YCCE Placement Portal as {role}
      </h1>

      <div className='relative mt-20 mb-8'>
          <div className='flex gap-x-14 md:gap-x-16 lg:gap-x-24 p-4'>
              <Link to={"/Signin/student"} className={`text-amber-800/60 text-lg md:text-2xl ${location.pathname === '/Signin/student' ? 'text-amber-900 underline underline-offset-16' : ''}`}>
                    Student
              </Link>
              <Link to={"/Signin/company"} className={`text-amber-800/60 text-lg md:text-2xl ${location.pathname === '/Signin/company' ? 'text-amber-900 underline underline-offset-16' : ''}`}>
                    Company
              </Link>
              <Link to={"/Signin/admin"} className={`text-amber-800/60 text-lg md:text-2xl ${location.pathname === '/Signin/admin' ? 'text-amber-900 underline underline-offset-16' : ''}`}>
                    Admin
              </Link>
          </div>
          <div className='h-0.5 w-full block absolute bottom-1 bg-black/10'></div>
      </div>

      <div className="flex flex-col gap-3 w-80">
          {role === 'student' && (
            <h2 className="text-amber-800 text-center font-bold">Please sign-in using college email</h2>
          )}
        <button
          onClick={handleGoogleLogin}
          className="bg-red-600 text-white py-3 px-4 rounded flex items-center justify-center gap-2 hover:bg-red-700"
          disabled={loading}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? 'Signing in...' : `Sign in with Google as ${role}`}
        </button>

        {error && <p className="text-red-500 text-center">{error}</p>}
      </div>
    </div>
  )
}
