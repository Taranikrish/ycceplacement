import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { logout } from '../slices/authSlice.js'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
function AdminSidebar() {
  const location = useLocation()
    const dispatch = useDispatch()
    const navigate = useNavigate()
     const handleLogout = () => {
        dispatch(logout())
        navigate('/')
      }

  return (
    <div className="w-64 bg-amber-800 text-white h-full">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
        <nav className="space-y-2">
          <Link
            to="/admin"
            className={`block px-4 py-2 rounded ${
              location.pathname === '/admin'
                ? 'bg-amber-900'
                : 'hover:bg-amber-700'
            }`}
          >
            Profile
          </Link>
          <Link
            to="/admin/students"
            className={`block px-4 py-2 rounded ${
              location.pathname === '/admin/students'
                ? 'bg-amber-900'
                : 'hover:bg-amber-700'
            }`}
          >
            Students
          </Link>
          <Link
            to="/admin/companies"
            className={`block px-4 py-2 rounded ${
              location.pathname === '/admin/companies'
                ? 'bg-amber-900'
                : 'hover:bg-amber-700'
            }`}
          >
            Companies
          </Link>
          <button
                onClick={handleLogout}
                className=" cursor-pointer w-full text-start hover:bg-amber-700  text-white px-4 py-2 text-sm sm:text-base 2xl:text-lg"
              >
                Logout
          </button>
        </nav>
      </div>
    </div>
  )
}

export default AdminSidebar
