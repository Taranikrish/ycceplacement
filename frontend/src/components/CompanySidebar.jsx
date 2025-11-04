import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

function CompanySidebar() {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

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

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-amber-800 text-white transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0`}>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-6">Company Dashboard</h2>
          <nav className="space-y-2">
            <Link
              to="/company/dashboard"
              className={`block px-4 py-2 rounded ${
                location.pathname === '/company/dashboard' && !location.hash
                  ? 'bg-amber-900'
                  : 'hover:bg-amber-700'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>
            <Link
              to="/company/dashboard#jobs"
              className={`block px-4 py-2 rounded ${
                location.hash === '#jobs' ? 'bg-amber-900' : 'hover:bg-amber-700'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Jobs
            </Link>
            <Link
              to="/company/dashboard#applications"
              className={`block px-4 py-2 rounded ${
                location.hash === '#applications' ? 'bg-amber-900' : 'hover:bg-amber-700'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Applied Students
            </Link>
          </nav>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden" onClick={() => setIsOpen(false)}></div>}
    </>
  )
}

export default CompanySidebar
