import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AdminSidebar from './AdminSidebar.jsx'
import CompanySidebar from './CompanySidebar.jsx'
import { 
  ArrowLeft, 
  Mail, 
  IdCard, 
  GraduationCap, 
  Phone, 
  FileText, 
  Video, 
  Award, 
  ShieldCheck, 
  ShieldAlert, 
  ExternalLink,
  BookOpen,
  MapPin,
  Calendar
} from 'lucide-react'

function AdminStudentView({ role }) {
  const { studentId } = useParams()
  const navigate = useNavigate()
  const [studentProfile, setStudentProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchStudentProfile()
  }, [studentId])

  const fetchStudentProfile = async () => {
    try {
      const auth = JSON.parse(localStorage.getItem('auth'))
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/student/profile/${studentId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth?.token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setStudentProfile(data)
      } else {
        setError('Candidate record not found or access denied.')
      }
    } catch (error) {
      setError('Internal server error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-slate-50">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-cyan-100 border-t-cyan-600 rounded-full animate-spin"></div>
          <GraduationCap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-600" size={24} />
        </div>
        <p className="mt-4 text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">Retrieving Academic Record</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {role === 'admin' ? <AdminSidebar /> : <CompanySidebar />}

      <main className="flex-1 flex flex-col min-w-0">
        {/* --- STICKY HEADER --- */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 md:px-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors text-slate-600 border border-transparent hover:border-slate-200"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-600 mb-0.5">
                Candidate Profile
              </p>
              <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                {studentProfile?.name}
              </h1>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3">
             <span className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest ${
                studentProfile?.isregistered ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600'
             }`}>
                {studentProfile?.isregistered ? <ShieldCheck size={14}/> : <ShieldAlert size={14}/>}
                {studentProfile?.isregistered ? 'Profile Verified' : 'Registration Pending'}
             </span>
          </div>
        </header>

        {/* --- MAIN CONTENT --- */}
        <div className="p-6 md:p-10 max-w-6xl w-full mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {studentProfile && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* LEFT COLUMN: Identity & Documents */}
              <div className="lg:col-span-1 space-y-8">
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                  <div className="h-24 bg-gradient-to-br from-cyan-600 to-cyan-800"></div>
                  <div className="px-6 pb-8 text-center">
                    <div className="relative -mt-12 mb-4 inline-block">
                      <img
                        src={studentProfile.profilePhoto || "/default-avatar.png"}
                        alt="Profile"
                        className="w-32 h-32 object-cover rounded-[2rem] border-4 border-white shadow-lg mx-auto bg-white"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-xl shadow-md border border-slate-100">
                         <div className={`w-3 h-3 rounded-full ${studentProfile.isregistered ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      </div>
                    </div>
                    <h2 className="text-xl font-black text-slate-900">{studentProfile.name}</h2>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">{studentProfile.branch}</p>
                    
                    {/* Resume Buttons */}
                    <div className="mt-8 space-y-3">
                      <a 
                        href={studentProfile.resumePdf} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95"
                      >
                        <FileText size={18} /> View PDF Resume
                      </a>
                      <a 
                        href={studentProfile.resumeVideo} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-white text-cyan-600 border border-cyan-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-cyan-50 transition-all active:scale-95"
                      >
                        <Video size={18} /> Video Introduction
                      </a>
                    </div>
                  </div>
                </div>

                {/* Domain / Skills Section */}
                <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                     <BookOpen size={14} className="text-cyan-600"/> Domains of Expertise
                   </h3>
                   <div className="flex flex-wrap gap-2">
                      {studentProfile.domain?.map((d, i) => (
                        <span key={i} className="px-3 py-1.5 bg-slate-50 text-slate-600 border border-slate-100 rounded-xl text-xs font-bold transition-colors hover:bg-cyan-50 hover:text-cyan-600">
                          {d}
                        </span>
                      ))}
                   </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Academics & Details */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Academic Highlights */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <StatCard label="CGPA" value={studentProfile.cgpa?.toFixed(2) || 'N/A'} icon={<Award className="text-amber-500" size={18}/>} />
                  <StatCard label="Roll No" value={studentProfile.rollNumber} icon={<IdCard className="text-cyan-500" size={18}/>} />
                  <StatCard label="Status" value={studentProfile.isregistered ? 'Regd' : 'Pending'} icon={<ShieldCheck className="text-green-500" size={18}/>} />
                  <StatCard label="Branch" value={studentProfile.branch?.split(' ')[0]} icon={<GraduationCap className="text-blue-500" size={18}/>} />
                </div>

                {/* Detailed Info Grid */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
                  <InfoBox label="Official Email" value={studentProfile.email} icon={<Mail size={18}/>} />
                  {role === 'admin' && <InfoBox label="Contact Number" value={studentProfile.mobileNumber} icon={<Phone size={18}/>} />}
                  <InfoBox label="Department" value={studentProfile.branch} icon={<BookOpen size={18}/>} />
                  <InfoBox label="Academic Standing" value={studentProfile.cgpa >= 7.5 ? "Distinction" : "Standard"} icon={<Award size={18}/>} />
                </div>

                {/* SGPA Breakdown */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                    <Calendar size={14} className="text-cyan-600"/> Semester Wise Performance
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {studentProfile.sgpa?.map((sgpa, index) => (
                      <div key={index} className="group p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:border-cyan-200 hover:shadow-md transition-all">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">SEM {index + 1}</p>
                        <p className="text-lg font-black text-slate-800">{sgpa || '—'}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {!studentProfile.isregistered && (
                  <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex items-center gap-4">
                     <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
                        <ShieldAlert size={24} />
                     </div>
                     <p className="text-amber-800 text-sm font-bold">
                       Warning: This student's registration is incomplete. Academic data might be unverified.
                     </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

// Internal Helper Components
function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-1">
      <div className="p-2 bg-slate-50 rounded-xl mb-1">{icon}</div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-base font-black text-slate-900">{value}</p>
    </div>
  )
}

function InfoBox({ label, value, icon }) {
  return (
    <div className="space-y-1 group">
      <div className="flex items-center gap-2 text-slate-400 group-hover:text-cyan-600 transition-colors">
        {icon}
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
      </div>
      <p className="text-slate-800 font-bold text-sm tracking-tight pl-6">{value || 'Not Provided'}</p>
    </div>
  )
}

export default AdminStudentView