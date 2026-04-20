import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../slices/authSlice.js'
import { 
  ShieldCheck, 
  Users, 
  Building2, 
  Briefcase, 
  LogOut, 
  Menu, 
  X,
  ChevronRight,
  LayoutDashboard
} from 'lucide-react'

function AdminSidebar() {
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const navItems = [
    { 
      name: 'Profile', 
      path: '/admin', 
      icon: <ShieldCheck size={20} />,
      active: location.pathname === '/admin'
    },
    { 
      name: 'Students', 
      path: '/admin/students', 
      icon: <Users size={20} />,
      active: location.pathname === '/admin/students'
    },
    { 
      name: 'Companies', 
      path: '/admin/companies', 
      icon: <Building2 size={20} />,
      active: location.pathname === '/admin/companies'
    },
    { 
      name: 'Jobs', 
      path: '/jobs', 
      icon: <Briefcase size={20} />,
      active: location.pathname === '/jobs'
    },
  ]

  return (
    <>
      {/* --- MOBILE TOP BAR --- */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-cyan-100 px-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <img src="/YCC Logo.png" alt="Logo" className="w-8 h-8" />
          <span className="font-black text-cyan-800 text-sm tracking-tight uppercase">YCCE Admin</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-cyan-50 text-cyan-600 rounded-xl transition-all active:scale-90"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* --- SIDEBAR CONTAINER --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-gradient-to-b from-cyan-700 to-cyan-900 text-white 
        transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        transition-transform duration-300 ease-in-out md:translate-x-0 md:static
        flex flex-col shadow-2xl h-screen
      `}>
        
        {/* Branding Section */}
        <div className="p-8 flex flex-col items-center border-b border-white/10">
          <div className="p-3 bg-white rounded-2xl mb-4 shadow-xl">
            <img src="/YCC Logo.png" alt="YCC Logo" className="w-12 h-12 object-contain" />
          </div>
          <h2 className="text-xl font-black tracking-tight text-center leading-tight">Admin Console</h2>
          <p className="text-cyan-200 text-[10px] uppercase tracking-[0.2em] mt-1 font-bold">Root Management</p>
        </div>

        {/* Navigation Group */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center justify-between px-4 py-3.5 rounded-xl font-bold text-sm transition-all group
                  ${item.active 
                    ? 'bg-white text-cyan-800 shadow-lg shadow-cyan-950/20' 
                    : 'text-cyan-50 hover:bg-white/10'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <span className={`${item.active ? 'text-cyan-600' : 'text-cyan-200 group-hover:text-white'}`}>
                    {item.icon}
                  </span>
                  {item.name}
                </div>
                <ChevronRight size={16} className={`transition-transform duration-300 ${item.active ? 'opacity-100' : 'opacity-0 group-hover:opacity-50 group-hover:translate-x-1'}`} />
              </Link>
            );
          })}
        </nav>

        {/* Footer / Logout Section */}
        <div className="p-6 bg-cyan-950/20 border-t border-white/5">
          <button
            onClick={() => {
              handleLogout()
              setIsOpen(false)
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-red-500/20 hover:border-red-500/30 transition-all font-bold text-sm group"
          >
            <LogOut size={20} className="text-cyan-300 group-hover:text-red-400 transition-colors" />
            <span className="group-hover:text-red-100">Logout Session</span>
          </button>
          
          <div className="mt-6 flex items-center gap-3 px-2">
             <div className="w-10 h-10 rounded-full bg-cyan-400 flex items-center justify-center font-black text-cyan-900 text-xs shadow-inner ring-2 ring-white/20">
               <ShieldCheck size={20} />
             </div>
             <div className="flex flex-col overflow-hidden">
                <p className="text-xs font-black truncate">Primary Admin</p>
                <p className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  System Online
                </p>
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

export default AdminSidebar