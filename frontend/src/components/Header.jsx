import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../slices/authSlice.js'

function Header() {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/logout`, {
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    dispatch(logout())
    navigate('/')
  }

  return (
    <header className="bg-amber-800 text-white shadow-md">
      <div className="container  px-2 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src="/YCC Logo.png" alt="YCC Logo" className="h-8 w-8 sm:h-10 sm:w-10 2xl:h-12 2xl:w-12 mr-2 sm:mr-3 2xl:mr-4" />
          <h1 className="text-xs sm:text-xl 2xl:text-2xl font-bold">Placement Cell, YCCE Nagpur</h1>
        </Link>
      </div>
    </header>
  )
}

export default Header
