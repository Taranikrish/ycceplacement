import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../slices/authSlice.js'
import { 
  User, 
  FileText, 
  Briefcase, 
  LogOut, 
  LayoutDashboard, 
  Menu, 
  X,
  ChevronRight
} from 'lucide-react' // Note: Install lucide-react or use SVG paths

function StudentSidebar({ detail }) {
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const { studentId, name } = detail || {}

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const navItems = [
    { 
      name: 'Profile', 
      path: `/student/dashboard/profile?studentId=${studentId}`, 
      icon: <User size={20} />,
      activeMatch: '/student/dashboard/profile'
    },
    { 
      name: 'Academic Details', 
      path: `/student/dashboard/details?studentId=${studentId}`, 
      icon: <FileText size={20} />,
      activeMatch: '/student/dashboard/details'
    },
    { 
      name: 'Job Portal', 
      path: '/student/dashboard/jobs', 
      icon: <Briefcase size={20} />,
      activeMatch: '/student/dashboard/jobs'
    },
  ]

  return (
    <>
      {/* --- MOBILE TOP BAR --- */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-cyan-100 px-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <img src="/YCC Logo.png" alt="Logo" className="w-8 h-8" />
          <span className="font-black text-cyan-800 text-sm tracking-tight uppercase">YCCE Portal</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-cyan-50 text-cyan-600 rounded-xl"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* --- SIDEBAR CONTAINER --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-gradient-to-b from-cyan-600 to-cyan-800 text-white 
        transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        transition-transform duration-300 ease-in-out md:translate-x-0 md:static
        flex flex-col shadow-2xl
      `}>
        
        {/* Branding Section */}
        <div className="p-8 flex flex-col items-center border-b border-white/10">
          <div className="p-3 bg-white rounded-2xl mb-4 shadow-lg">
            <img src="/YCC Logo.png" alt="YCC Logo" className="w-12 h-12 object-contain" />
          </div>
          <h2 className="text-xl font-black tracking-tight text-center">Student Dashboard</h2>
          <p className="text-cyan-200 text-[10px] uppercase tracking-[0.2em] mt-1 font-bold">Official Placement Cell</p>
        </div>

        {/* Navigation Group */}
        <nav className="flex-1 px-4 py-8 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.activeMatch;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center justify-between px-4 py-3.5 rounded-xl font-bold text-sm transition-all group
                  ${isActive 
                    ? 'bg-white text-cyan-700 shadow-lg shadow-cyan-900/20' 
                    : 'text-cyan-50 hover:bg-white/10'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <span className={`${isActive ? 'text-cyan-600' : 'text-cyan-200'}`}>
                    {item.icon}
                  </span>
                  {item.name}
                </div>
                <ChevronRight size={16} className={`transition-transform ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50 group-hover:translate-x-1'}`} />
              </Link>
            );
          })}
        </nav>

        {/* Footer / Logout Section */}
        <div className="p-6 bg-cyan-900/30">
          <button
            onClick={() => {
              handleLogout()
              setIsOpen(false)
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-grey-100 hover:border-grey-100 transition-all font-bold text-sm"
          >
            <LogOut size={20} className="text-cyan-300" />
            Logout Session
          </button>
          
          <div className="mt-6 flex items-center gap-3 px-2">
             <div className="w-8 h-8 rounded-full bg-cyan-400 flex items-center justify-center font-black text-cyan-800 text-xs shadow-inner">
               {name ? name.charAt(0) : 'S'}
             </div>
             <div className="flex flex-col overflow-hidden">
                <p className="text-xs font-black truncate">{name || "Student User"}</p>
                <p className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider">Online</p>
             </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-slate-900/60 backdrop-blur-sm md:hidden" 
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  )
}

export default StudentSidebar