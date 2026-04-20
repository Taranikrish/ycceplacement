import React, { useState, useEffect } from 'react'
import AdminSidebar from './AdminSidebar.jsx'
import { 
  ShieldCheck, 
  Mail, 
  User, 
  Building, 
  LayoutDashboard, 
  BadgeCheck, 
  Settings, 
  Terminal,
  Clock
} from 'lucide-react'

function AdminDashboard() {
  const [adminProfile, setAdminProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const auth = JSON.parse(localStorage.getItem('auth'))
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/profile`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth?.token}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          setAdminProfile(data)
        }
      } catch (error) {
        console.error('Error fetching admin profile:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAdminProfile()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-slate-50">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-cyan-100 border-t-cyan-600 rounded-full animate-spin"></div>
          < ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-600" size={24} />
        </div>
        <p className="mt-4 text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">Authenticating Admin Session</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <AdminSidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* --- EXECUTIVE HEADER --- */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 md:px-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">System Control</p>
              </div>
              <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                Administrative Profile
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-[10px] font-black text-cyan-600 uppercase tracking-widest">Server Status</span>
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                  Online <Clock size={12} />
                </span>
             </div>
             <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                <Terminal size={18} />
             </div>
          </div>
        </header>

        {/* --- CONTENT AREA --- */}
        <div className="p-6 md:p-10 max-w-5xl w-full mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Admin Identity Card */}
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            {/* Banner with Gradient */}
            <div className="h-32 bg-gradient-to-r from-slate-800 to-slate-950 relative">
              <div className="absolute -bottom-12 left-10">
                <div className="w-24 h-24 rounded-3xl bg-white shadow-2xl flex items-center justify-center border-4 border-white">
                  <div className="w-full h-full rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600">
                    <User size={40} />
                  </div>
                </div>
              </div>
              <div className="absolute top-4 right-6">
                <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <BadgeCheck size={14} className="text-cyan-400" /> Root Access
                </span>
              </div>
            </div>

            <div className="pt-16 px-10 pb-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                    {adminProfile?.name || 'Admin User'}
                  </h2>
                  <p className="text-cyan-600 text-xs font-bold uppercase tracking-[0.2em] mt-1">
                    {adminProfile?.role || 'Administrator'}
                  </p>
                </div>
                <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95">
                  <Settings size={16} /> Account Settings
                </button>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <AdminInfoBox 
                  icon={<Mail size={20} />} 
                  label="Network Identity (Email)" 
                  value={adminProfile?.email} 
                />
                <AdminInfoBox 
                  icon={<ShieldCheck size={20} />} 
                  label="Permission Tier" 
                  value={adminProfile?.role} 
                  isCapitalize
                />
                <AdminInfoBox 
                  icon={<Building size={20} />} 
                  label="Assigned Department" 
                  value={adminProfile?.department || 'Central Administration'} 
                />
                <AdminInfoBox 
                  icon={<LayoutDashboard size={20} />} 
                  label="Access Node" 
                  value="Placement Cell Portal" 
                />
              </div>
            </div>
          </div>

          {/* Activity Footer */}
          <div className="flex items-center justify-between px-6 py-4 bg-slate-100/50 rounded-2xl border border-slate-200">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Terminal size={14} /> Security Key: {Math.random().toString(36).substring(7).toUpperCase()}
            </p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              V2.4.0 Stable
            </p>
          </div>

        </div>
      </main>
    </div>
  )
}

// Reusable Admin Component
function AdminInfoBox({ icon, label, value, isCapitalize }) {
  return (
    <div className="group p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-cyan-200 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center gap-3 mb-3 text-slate-400 group-hover:text-cyan-600 transition-colors">
        {icon}
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">
          {label}
        </span>
      </div>
      <p className={`text-lg font-bold text-slate-800 tracking-tight ${isCapitalize ? 'capitalize' : ''}`}>
        {value || 'N/A'}
      </p>
    </div>
  )
}

export default AdminDashboard