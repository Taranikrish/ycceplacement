import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { 
  User, 
  Mail, 
  Hash, 
  GraduationCap, 
  Award, 
  Phone, 
  FileCheck, 
  Video, 
  ExternalLink,
  AlertCircle,
  ShieldCheck
} from 'lucide-react'

function StudentProfile() {
  const [studentProfile, setStudentProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchStudentProfile = async () => {
    try {
      setLoading(true)
      const auth = JSON.parse(localStorage.getItem('auth'))
      const url = `${import.meta.env.VITE_API_BASE_URL}/api/student/profile`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth?.token}`,
        },
      })

      if (response.ok) {
        setStudentProfile(await response.json())
      } else {
        setError('Failed to fetch student profile')
      }
    } catch (error) {
      setError('Error connecting to the server')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudentProfile()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-center">
          <AlertCircle className="mx-auto text-red-500 mb-2" size={32} />
          <p className="text-red-700 font-bold">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* --- PROFILE HEADER CARD --- */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-cyan-900/5 overflow-hidden border border-slate-100 mb-8">
          {/* Decorative Banner */}
          <div className="h-32 bg-gradient-to-r from-cyan-600 to-cyan-800 relative">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          </div>
          
          <div className="px-8 pb-8 flex flex-col md:flex-row items-end -mt-16 gap-6">
            <div className="relative">
              {studentProfile?.profilePhoto ? (
                <img 
                  src={studentProfile.profilePhoto} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-3xl object-cover border-4 border-white shadow-lg bg-white" 
                />
              ) : (
                <div className="w-32 h-32 rounded-3xl bg-slate-100 border-4 border-white shadow-lg flex items-center justify-center text-slate-400">
                  <User size={48} />
                </div>
              )}
              {/* {studentProfile?.isregistered && (
                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1.5 rounded-full border-4 border-white">
                  <ShieldCheck size={18} />
                </div>
              )} */}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-black text-slate-900 leading-tight">{studentProfile?.name}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2">
                <span className="flex items-center gap-1.5 text-slate-500 font-medium text-sm">
                  <Mail size={16} className="text-cyan-600" /> {studentProfile?.email}
                </span>
                <span className="flex items-center gap-1.5 text-slate-500 font-medium text-sm">
                  {/* <Phone size={16} className="text-cyan-600" /> {studentProfile?.mobileNumber || 'N/A'} */}
                </span>
              </div>
            </div>

            <div className="pb-2">
              <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                studentProfile?.isregistered 
                ? 'bg-green-100 text-green-700' 
                : 'bg-amber-100 text-amber-700'
              }`}>
                {studentProfile?.isregistered ? 'Verified Student' : 'Action Required'}
              </span>
            </div>
          </div>
        </div>

        {/* --- MAIN CONTENT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Academic Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-6 text-slate-900">
                <GraduationCap className="text-cyan-600" size={24} />
                <h2 className="text-xl font-black">Academic Credentials</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <InfoBlock icon={<Hash />} label="Roll Number" value={studentProfile?.rollNumber} />
                <InfoBlock icon={<Award />} label="Current CGPA" value={studentProfile?.cgpa ? Number(studentProfile.cgpa).toFixed(2) : 'N/A'} isHighlight />
                <InfoBlock icon={<ExternalLink />} label="Engineering Branch" value={studentProfile?.branch} />
                <InfoBlock icon={<Phone />} label="Contact Number" value={studentProfile?.mobileNumber} />
                <InfoBlock icon={<Award />} label="Registration Status" value={studentProfile?.isregistered ? 'Complete' : 'Pending'} />
              </div>
            </div>

            {/* Warning for uncompleted profile */}
            {!studentProfile?.isregistered && (
              <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl flex gap-4 items-start">
                <AlertCircle className="text-amber-600 shrink-0" />
                <div>
                  <h4 className="font-black text-amber-800 uppercase text-xs tracking-wider mb-1">Registration Incomplete</h4>
                  <p className="text-amber-700 text-sm font-medium">
                    Your profile is currently restricted. Please complete the "Academic Details" section to be eligible for placements.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Documents & Resume */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
              <h2 className="text-xl font-black mb-6 text-slate-900">Professional Assets</h2>
              
              <div className="space-y-4">
                <ResumeLink 
                  icon={<FileCheck />} 
                  label="Resume (PDF)" 
                  url={studentProfile?.resumePdf} 
                  type="pdf" 
                />
                <ResumeLink 
                  icon={<Video />} 
                  label="Video Pitch" 
                  url={studentProfile?.resumeVideo} 
                  type="video" 
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

/* --- HELPER COMPONENTS --- */

const InfoBlock = ({ icon, label, value, isHighlight }) => (
  <div className="flex flex-col">
    <div className="flex items-center gap-2 text-slate-400 mb-1">
      {React.cloneElement(icon, { size: 14, className: "text-cyan-500" })}
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <p className={`text-lg font-bold ${isHighlight ? 'text-cyan-600' : 'text-slate-800'}`}>
      {value || 'Not specified'}
    </p>
  </div>
)

const ResumeLink = ({ icon, label, url, type }) => (
  <a 
    href={url || '#'} 
    target="_blank" 
    rel="noreferrer"
    className={`group flex items-center justify-between p-4 rounded-2xl border transition-all ${
      url 
      ? 'border-cyan-100 hover:bg-cyan-600 hover:border-cyan-600' 
      : 'border-slate-100 opacity-50 cursor-not-allowed'
    }`}
  >
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg transition-colors ${
        url ? 'bg-cyan-50 text-cyan-600 group-hover:bg-white/20 group-hover:text-white' : 'bg-slate-50 text-slate-400'
      }`}>
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <div>
        <p className={`text-sm font-bold transition-colors ${url ? 'text-slate-900 group-hover:text-white' : 'text-slate-400'}`}>
          {label}
        </p>
        <p className={`text-[10px] uppercase font-medium transition-colors ${url ? 'text-cyan-600 group-hover:text-cyan-100' : 'text-slate-400'}`}>
          {url ? 'View Document' : 'No File Uploaded'}
        </p>
      </div>
    </div>
    {url && <ExternalLink size={14} className="text-cyan-400 group-hover:text-white" />}
  </a>
)

export default StudentProfile