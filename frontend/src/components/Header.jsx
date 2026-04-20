import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../slices/authSlice.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSignOutAlt,
  faUserCircle,
  faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons'

function Header() {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    try {
      const auth = JSON.parse(localStorage.getItem('auth'))
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/logout`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth?.token}`,
        },
      })
    } catch (error) {
      console.error('Logout error:', error)
    }
    dispatch(logout())
    navigate('/')
  }

  const isActive = (hash) => location.hash === hash

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
      <nav className="container mx-auto px-6 py-3 flex items-center justify-between">

        {/* ---------- LOGO ---------- */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/YCC Logo.png"
            alt="YCCE Logo"
            className="h-11 w-11 object-contain transition-transform duration-300 group-hover:scale-110"
          />
          <div className="leading-tight">
            <h1 className="text-lg font-extrabold text-slate-900">
              Placement Cell
            </h1>
            {/* <p className="text-[11px] font-bold tracking-widest text-cyan-600 uppercase">
              YCCE Nagpur
            </p> */}
          </div>
        </Link>

        {/* ---------- NAV LINKS ---------- */}
        <div className="hidden lg:flex items-center gap-2">
          {[
            { name: 'Overview', href: '#overview' },
            { name: 'Information', href: '#info' },
            { name: 'Contact', href: '#contact' },
          ].map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`relative px-4 py-2 text-sm font-semibold rounded-full transition-all
                ${
                  isActive(link.href)
                    ? 'text-cyan-700 bg-cyan-100'
                    : 'text-slate-700 hover:text-cyan-600 hover:bg-cyan-50'
                }`}
            >
              {link.name}
            </a>
          ))}

          <span className="mx-4 h-6 w-px bg-slate-200" />

          <a
            href="https://ycce.edu/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-cyan-600 transition-colors"
          >
            Main Website
            <FontAwesomeIcon icon={faExternalLinkAlt} className="text-[10px]" />
          </a>
        </div>

        {/* ---------- AUTH ACTIONS ---------- */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to={`/${user.role}/dashboard`}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-bold hover:bg-cyan-500 transition-all shadow-md"
              >
                <FontAwesomeIcon icon={faUserCircle} />
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-600 hover:text-red-600 transition-colors"
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/Signin/student"
                className="px-5 py-2.5 text-xs font-bold rounded-xl bg-white border border-cyan-600 text-cyan-700 hover:bg-cyan-50 transition-all"
              >
                Student Login
              </Link>
              <Link
                to="/Signin/company"
                className="px-5 py-2.5 text-xs font-bold rounded-xl bg-cyan-600 text-white hover:bg-cyan-500 shadow-lg shadow-cyan-200 transition-all"
              >
                Employer Login
              </Link>
            </>
          )}
        </div>

      </nav>
    </header>
  )
}

export default Header
