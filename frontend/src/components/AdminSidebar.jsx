import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { logout } from '../slices/authSlice.js'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function AdminSidebar() {
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-cyan-700/85 text-white p-2 rounded"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-cyan-700/85 text-white transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0`}>
        <div className="p-4">
          <img src="/YCC Logo.png" alt="YCC Logo" className="w-16 h-16 mb-4 mx-auto" />
          <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
          <nav className="space-y-2">
            <Link
              to="/admin"
              className={`block px-4 py-2 rounded ${
                location.pathname === '/admin'
                  ? 'bg-cyan-900'
                  : 'hover:bg-cyan-700'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>
           
            <Link
              to="/admin/students"
              className={`block px-4 py-2 rounded ${
                location.pathname === '/admin/students'
                  ? 'bg-cyan-900'
                  : 'hover:bg-cyan-700'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Students
            </Link>
            <Link
              to="/admin/companies"
              className={`block px-4 py-2 rounded ${
                location.pathname === '/admin/companies'
                  ? 'bg-cyan-900'
                  : 'hover:bg-cyan-700'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Companies
            </Link>
             <Link
              to="/jobs"
              className={`block px-4 py-2 rounded ${
                location.pathname === '/jobs'
                  ? 'bg-cyan-900'
                  : 'hover:bg-cyan-700'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Jobs
            </Link>
            <button
              onClick={() => {
                handleLogout()
                setIsOpen(false)
              }}
              className="cursor-pointer w-full text-start hover:bg-cyan-700 text-white px-4 py-2 text-sm sm:text-base 2xl:text-lg"
            >
              Logout
            </button>
          </nav>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 z-30 bg-opacity-50 md:hidden" onClick={() => setIsOpen(false)}></div>}
    </>
  )
}

export default AdminSidebar
