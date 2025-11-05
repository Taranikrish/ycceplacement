import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../slices/authSlice.js'

function StudentSidebar() {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const dispatch = useDispatch()      // ✅ Added
  const navigate = useNavigate()      // ✅ Added

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
      className="bg-amber-800 text-white p-2 rounded"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  </div>

  {/* Desktop Logout Button (Right side) */}
  <div className="hidden md:flex fixed top-4 right-6 z-40">
    <button
      onClick={handleLogout}
      className="bg-amber-800 hover:bg-amber-700 text-white px-4 py-2 rounded"
    >
      Logout
    </button>
  </div>

  {/* Mobile Sidebar */}
  <div
    className={`fixed inset-y-0 right-0 z-40 w-40 bg-amber-800 text-white transform ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    } transition-transform duration-300 ease-in-out md:hidden`}
  >
    <div className="p-4">
      <nav className="space-y-2">
        <button
          onClick={() => {
            handleLogout()
            setIsOpen(false)
          }}
          className="cursor-pointer w-full text-start hover:bg-amber-700 text-white px-4 py-2 text-sm sm:text-base 2xl:text-lg"
        >
          Logout
        </button>
      </nav>
    </div>
  </div>

  {/* Overlay for mobile */}
  {isOpen && (
    <div
      className="fixed inset-0 z-30 bg-opacity-50 md:hidden"
      onClick={() => setIsOpen(false)}
    ></div>
  )}
</>

  )
}

export default StudentSidebar;
