import React, { useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { handleGoogleCallback } from '../slices/authSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShieldHalved, faArrowLeft, faCircleCheck } from '@fortawesome/free-solid-svg-icons'

export default function Signin() {
  const { role } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user, loading, error } = useSelector((state) => state.auth)

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google/${role}`
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const userData = params.get('user')

    if (token && userData) {
      const parsedUser = JSON.parse(decodeURIComponent(userData))
      dispatch(handleGoogleCallback({ user: parsedUser, token }))
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [dispatch])

  useEffect(() => {
    if (!user) return
    if (user.role === 'admin') navigate('/admin')
    else if (user.role === 'company') navigate('/company/dashboard')
    else if (user.role === 'student') navigate('/student/dashboard')
  }, [user, navigate])

  return (
    <div className="min-h-screen bg-cyan-50/30 flex items-center justify-center p-6 font-sans">
      
      {/* --- FLOATING BACK BUTTON --- */}
      <Link to="/" className="absolute top-8 left-8 text-cyan-700 hover:text-cyan-500 font-bold flex items-center gap-2 transition-all">
        <FontAwesomeIcon icon={faArrowLeft} /> Back to Home
      </Link>

      <div className="max-w-5xl w-full bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(8,145,178,0.15)] overflow-hidden flex flex-col md:flex-row border border-cyan-100">
        
        {/* --- LEFT BRAND PANEL: UPDATED TO CYAN GRADIENT --- */}
        <div className="md:w-5/12 bg-gradient-to-br from-cyan-600 to-cyan-800 p-12 text-white relative flex flex-col justify-between overflow-hidden">
          {/* Subtle Decorative Background Elements */}
          <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-5%] left-[-5%] w-32 h-32 bg-cyan-400/20 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-3 mb-16">
              <div className="p-2 bg-white rounded-xl">
                <img src="/YCC Logo.png" className="h-10 w-10 object-contain" alt="YCCE Logo" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xl leading-tight tracking-tight">YCCE</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-cyan-200 font-bold">Nagpur</span>
              </div>
            </Link>
            
            <h1 className="text-4xl font-black mb-6 leading-[1.1]">
              Gateway to <br /> Your Future <span className="text-cyan-200">Career.</span>
            </h1>
            
            <div className="space-y-4">
               {[
                 "Track Applications",
                 "Explore Opportunities",
                 "Connect with Recruiters"
               ].map((text, i) => (
                 <div key={i} className="flex items-center gap-3 text-sm font-bold text-cyan-50">
                   <FontAwesomeIcon icon={faCircleCheck} className="text-cyan-300" />
                   {text}
                 </div>
               ))}
            </div>
          </div>

          <div className="relative z-10 pt-12 border-t border-white/20">
            <div className="flex items-center gap-4 text-white">
              <FontAwesomeIcon icon={faShieldHalved} className="text-2xl text-cyan-300" />
              <div>
                <p className="text-xs font-black uppercase tracking-widest">Secure Portal</p>
                <p className="text-[10px] text-cyan-100 font-bold opacity-80">OAuth 2.0 Institutional Protection</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT SIGN-IN PANEL --- */}
        <div className="md:w-7/12 p-8 md:p-16 flex flex-col justify-center bg-white">
          
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-xs font-black text-cyan-600 uppercase tracking-[0.3em] mb-2">Account Login</h2>
            <h3 className="text-3xl font-black text-slate-900 capitalize tracking-tight">Sign in as {role}</h3>
          </div>

          {/* --- PILL ROLE SWITCHER --- */}
          <div className="inline-flex p-1.5 bg-cyan-50/50 rounded-2xl mb-12 w-full max-w-md mx-auto md:mx-0 border border-cyan-100">
            {['student', 'company', 'admin'].map((r) => (
              <Link
                key={r}
                to={`/Signin/${r}`}
                className={`flex-1 py-3 text-center text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                  role === r 
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-200' 
                  : 'text-cyan-600/60 hover:text-cyan-600 hover:bg-white'
                }`}
              >
                {r}
              </Link>
            ))}
          </div>

          <div className="max-w-md mx-auto md:mx-0 w-full space-y-6">
            {role === 'student' && (
              <div className="p-4 bg-cyan-50 border border-cyan-100 rounded-xl flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse"></div>
                <p className="text-xs font-bold text-cyan-700">Required: Use official @ycce.edu email</p>
              </div>
            )}

            {/* --- GOOGLE BUTTON --- */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full group flex items-center justify-center gap-4 bg-white border-2 border-cyan-100 py-4 px-6 rounded-2xl font-bold text-slate-700 hover:border-cyan-500 hover:bg-cyan-50/30 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {loading ? 'Authenticating...' : `Continue to ${role} Portal`}
            </button>

            {error && (
              <p className="text-center text-xs font-bold text-red-500 bg-red-50 p-3 rounded-xl border border-red-100">
                {error}
              </p>
            )}

            <div className="pt-8 text-center border-t border-slate-100">
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                 Official Yeshwantrao Chavan <br /> College of Engineering Portal
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}