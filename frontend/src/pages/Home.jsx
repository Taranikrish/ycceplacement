import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Header from '../components/Header.jsx'

function Home() {
  const { user } = useSelector((state) => state.auth)

  return (
    <div className='h-screen w-full relative'>
      <div >
        {!user?<Header />:""}
      </div>
      <div style={{backgroundImage:'url("/cover.webp")'}} className='bg-contain bg-cover bg-center w-full h-[80%]'></div>
      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 grid grid-cols-1 gap-4'>
        {user ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Welcome back, {user.name}!</h2>
            <p className="text-white/80 mb-6">You are logged in as {user.role}</p>
            {user.role === 'admin' && (
              <Link to={'/admin'} className='bg-amber-800/80 px-6 py-3 rounded-2xl text-center text-white hover:bg-amber-700 transition-colors'>
                Go to Admin Dashboard
              </Link>
            )}
            {user.role === 'company' && (
              <Link to={'/company/dashboard'} className='bg-amber-800/80 px-6 py-3 rounded-2xl text-center text-white hover:bg-amber-700 transition-colors'>
                Go to Company Dashboard
              </Link>
            )}
            {user.role === 'student' && (
              <Link to={'/student/dashboard'} className='bg-amber-800/80 px-6 py-3 rounded-2xl text-center text-white hover:bg-amber-700 transition-colors'>
                Go to Student Dashboard
              </Link>
            )}
          </div>
        ) : (
          <>
            <Link to={'/Signin/student'} className='bg-amber-800/80 px-4 py-2 rounded-2xl text-center text-white hover:bg-amber-700 transition-colors'>
              Student
            </Link>
            <Link to={'/Signin/company'} className='bg-amber-800/80 px-4 py-2 rounded-2xl text-center text-white hover:bg-amber-700 transition-colors'>
              Company
            </Link>
            <Link to={'/Signin/admin'} className='bg-amber-800/80 px-4 py-2 rounded-2xl text-center text-white hover:bg-amber-700 transition-colors'>
              Admin
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default Home
