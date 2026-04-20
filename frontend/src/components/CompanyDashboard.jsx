import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { 
  ArrowLeft, 
  ShieldCheck, 
  ShieldAlert, 
  Building2, 
  LayoutDashboard, 
  Bell, 
  Info 
} from 'lucide-react'
import CompanySidebar from './CompanySidebar.jsx'
import CompanyProfile from './CompanyProfile.jsx'
import EditProfile from './EditProfile.jsx'
import JobsSection from './JobsSection.jsx'
import ApplicationsSection from './ApplicationsSection.jsx'

function CompanyDashboard() {
  const [searchParams] = useSearchParams()
  const companyId = searchParams.get('companyId')
  const [company, setCompany] = useState(null)
  const [applications, setApplications] = useState([])
  const [jobs, setJobs] = useState([])
  const navigate = useNavigate()
  const location = useLocation()

  const branches = [
    "All Branches",
    'Computer Science & Engineering',
    'Information Technology',
    'Electronics & Telecommunication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering'
  ];

  const isAdminView = companyId && JSON.parse(localStorage.getItem('auth'))?.role === 'admin'

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const auth = JSON.parse(localStorage.getItem('auth'))
        const profileUrl = isAdminView
          ? `${import.meta.env.VITE_API_BASE_URL}/api/company/profile/${companyId}`
          : `${import.meta.env.VITE_API_BASE_URL}/api/company/profile`

        const profileResponse = await fetch(profileUrl, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth?.token}`,
          },
        })

        if (profileResponse.ok) {
          const profileData = await profileResponse.json()
          setCompany(profileData.company || profileData)
        }

        if (!isAdminView) {
          const [jobsRes, appsRes] = await Promise.all([
            fetch(`${import.meta.env.VITE_API_BASE_URL}/api/company/jobs`, {
              headers: { Authorization: `Bearer ${auth?.token}` }
            }),
            fetch(`${import.meta.env.VITE_API_BASE_URL}/api/company/applications`, {
              headers: { Authorization: `Bearer ${auth?.token}` }
            })
          ])

          if (jobsRes.ok) setJobs(await jobsRes.json())
          if (appsRes.ok) setApplications(await appsRes.json())
        }
      } catch (err) {
        console.error('Error fetching company data:', err)
      }
    }
    fetchCompanyData()
  }, [companyId, isAdminView])

  if (!company) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-slate-50">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div>
          <Building2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-600" size={24} />
        </div>
        <p className="mt-4 text-slate-500 font-bold tracking-widest animate-pulse text-xs uppercase">Loading Portal...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {!isAdminView && <CompanySidebar />}

      <main className="flex-1 flex flex-col min-w-0">
        {/* --- STICKY HEADER --- */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 md:px-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {isAdminView && (
              <button
                onClick={() => navigate('/admin/companies')}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-600 mb-0.5">
                {isAdminView ? "Admin Console" : "Recruiter Dashboard"}
              </p>
              <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                {isAdminView ? "Company Evaluation" : company.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="hidden md:flex flex-col items-end mr-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Status</span>
                <span className={`text-[11px] font-black px-2 py-0.5 rounded-md uppercase ${company.verified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {company.verified ? 'Verified' : 'Pending'}
                </span>
             </div>
             <button className="p-2 text-slate-400 hover:text-cyan-600 transition-colors">
                <Bell size={20} />
             </button>
          </div>
        </header>

        {/* --- MAIN CONTENT SCROLL AREA --- */}
        <div className="p-6 md:p-10 max-w-7xl w-full mx-auto space-y-8">
          
          {/* Verification Banner */}
          {!company.verified && !isAdminView && (
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl p-1 shadow-lg shadow-orange-200">
              <div className="bg-white/95 rounded-[22px] p-6 flex items-center gap-6">
                <div className="hidden sm:flex w-14 h-14 bg-amber-100 rounded-2xl items-center justify-center text-amber-600 shrink-0">
                  <ShieldAlert size={30} />
                </div>
                <div className="flex-1">
                  <h3 className="text-slate-900 font-black text-lg">Action Required: Profile Verification</h3>
                  <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                    Your company account is currently in <span className="font-bold text-amber-600 italic">Review Mode</span>. 
                    Verification by the Placement Cell is required before you can publish job listings.
                  </p>
                </div>
                <button className="hidden lg:block px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all">
                  Contact Support
                </button>
              </div>
            </div>
          )}

          {/* Dynamic Content Sections */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {isAdminView ? (
              <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                  <h2 className="text-slate-900 font-black flex items-center gap-2 tracking-tight">
                    <Info className="text-cyan-600" size={20} /> Corporate Profile Details
                  </h2>
                </div>
                
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {[
                    { label: "Registered Name", value: company.name, icon: <Building2 size={16}/> },
                    { label: "Official Email", value: company.email, icon: <LayoutDashboard size={16}/> },
                    { label: "Contact Number", value: company.phoneNumber || 'Not provided' },
                    { label: "Office Location", value: company.location || 'Not provided' },
                    { label: "Representative", value: company.contactPerson || 'Not provided' },
                    { 
                      label: "Verification Status", 
                      value: company.verified ? 'Certified Member' : 'Under Review',
                      isStatus: true 
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                        {item.label}
                      </label>
                      <p className={`text-slate-700 font-bold text-base ${item.isStatus ? (company.verified ? 'text-green-600' : 'text-amber-600') : ''}`}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-10">
                {location.pathname === '/company/dashboard' && <CompanyProfile company={company} />}
                {location.pathname === '/company/dashboard/edit' && <EditProfile />}
                {location.pathname === '/company/dashboard/jobs' && <JobsSection jobs={jobs} company={company} branches={branches} />}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default CompanyDashboard