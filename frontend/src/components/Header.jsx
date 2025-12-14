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
    <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm shadow-sm">
      <nav className="container px-6 py-4 flex justify-between items-center">
        <Link className="flex items-center gap-3" to="/">
          <img alt="YCCE College Logo" className="h-10 w-10" src="/YCC Logo.png" />
          <span className="text-xl font-bold text-slate-600 ">Placement Cell, YCCE Nagpur</span>
        </Link>
        <div className="hidden md:flex items-center  space-x-2">
          <a className="px-4 mx-10 py-2   text-slate-600   transition-colors" href="#overview">Overview</a>
          <a className="px-4 mx-10 py-2  text-slate-600   transition-colors" href="#info">Information</a>
          <a className="px-4 mx-10 py-2  text-slate-600   transition-colors" href="#contact">Contact</a>
        </div>
        
      </nav>
    </header>
  )
}

export default Header
