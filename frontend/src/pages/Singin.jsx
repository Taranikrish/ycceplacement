import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../slices/authSlice.js'

export default function Signin() {
  const { role } = useParams() // will be 'student' | 'company' | 'admin'
  const dispatch = useDispatch()
  const { loading, error } = useSelector((state) => state.auth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false) // State for password visibility

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(loginUser({ email, password, userType: role }))
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl text-amber-800 text-center font-bold mb-6 capitalize">
        Sign-in to YCCE Placement Portal
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
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-80">
        <input 
          type="email" 
          placeholder="Email"
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="border px-3 py-2 rounded"
        />
        <div className="relative">
          <input 
            type={showPassword ? "text" : "password"} // Toggle between text and password
            placeholder="Password"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="border px-3 py-2 rounded w-full"
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)} 
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            {showPassword ? '‿' : '👁'} {/* Change text based on visibility */}
          </button>
        </div>
        <button 
          type="submit" 
          className="bg-blue-600 text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {error && <p className="text-red-500 text-center">{error}</p>}
      </form>
    </div>
  )
}
