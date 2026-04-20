import React from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  FileText, 
  UserCircle, 
  ShieldCheck, 
  ShieldAlert,
  Edit3,
  Trash2,
  ExternalLink
} from 'lucide-react'

function CompanyProfile({ company }) {
  const navigate = useNavigate()

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone and will delete all your jobs and applications.')) {
      return
    }

    try {
      const auth = JSON.parse(localStorage.getItem('auth'))
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/company/profile`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth?.token}`,
        }
      })

      if (response.ok) {
        localStorage.removeItem('auth')
        navigate('/Signin/company')
      } else {
        const errorData = await response.json().catch(() => ({}))
        alert(errorData.message || 'Failed to delete account')
      }
    } catch (err) {
      console.error('Error deleting account:', err)
      alert('Error deleting account')
    }
  }

  return (
    <div className="max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        
        {/* --- HEADER BANNER --- */}
        <div className="h-32 bg-gradient-to-r from-cyan-600 to-cyan-800 relative">
          <div className="absolute -bottom-12 left-10">
            <div className="w-24 h-24 rounded-3xl bg-white shadow-xl flex items-center justify-center border-4 border-white">
              <Building2 size={40} className="text-cyan-600" />
            </div>
          </div>
        </div>

        {/* --- CONTENT --- */}
        <div className="pt-16 px-10 pb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">{company.name}</h2>
              <div className="flex items-center gap-2 mt-2">
                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  company.verified 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {company.verified ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                  {company.verified ? 'Verified Partner' : 'Verification Pending'}
                </span>
                <span className="text-slate-400 text-xs font-bold flex items-center gap-1">
                  <MapPin size={14} /> {company.location || 'Location not set'}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate('/company/dashboard/edit')}
                className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-cyan-200 active:scale-95"
              >
                <Edit3 size={18} /> Edit Profile
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex items-center gap-2 bg-white hover:bg-red-50 text-red-500 border border-red-100 px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95"
              >
                <Trash2 size={18} /> Delete Account
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Information Card Item */}
            <InfoItem 
              icon={<Mail size={20} />} 
              label="Official Email" 
              value={company.email} 
            />
            
            <InfoItem 
              icon={<Phone size={20} />} 
              label="Phone Number" 
              value={company.phoneNumber || 'Not provided'} 
            />

            <InfoItem 
              icon={<UserCircle size={20} />} 
              label="Contact Person" 
              value={company.contactPerson || 'Not provided'} 
            />

            <InfoItem 
              icon={<FileText size={20} />} 
              label="DPIIT Number" 
              value={company.dpiitNumber || 'Not provided'} 
            />

            {/* LinkedIn Special Item */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-cyan-200 transition-colors">
              <div className="flex items-center gap-3 mb-2 text-cyan-600">
                <Linkedin size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-cyan-600">LinkedIn Presence</span>
              </div>
              {company.linkedInUrl ? (
                <a 
                  href={company.linkedInUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-slate-900 font-bold text-sm flex items-center gap-1 hover:text-cyan-600 transition-colors"
                >
                  Visit Profile <ExternalLink size={14} />
                </a>
              ) : (
                <p className="text-slate-400 font-bold text-sm">Not linked</p>
              )}
            </div>

            <InfoItem 
              icon={<ShieldCheck size={20} />} 
              label="Account Status" 
              value={company.verified ? 'Active & Verified' : 'Restricted Access'} 
              isHighlighted={company.verified}
            />

          </div>
        </div>
      </div>
    </div>
  )
}

// Reusable Sub-component for clean code
function InfoItem({ icon, label, value, isHighlighted }) {
  return (
    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 group hover:bg-white hover:shadow-md transition-all">
      <div className="flex items-center gap-3 mb-2 text-slate-400 group-hover:text-cyan-600 transition-colors">
        {icon}
        <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-slate-500 transition-colors">{label}</span>
      </div>
      <p className={`text-base font-bold tracking-tight ${isHighlighted ? 'text-green-600' : 'text-slate-800'}`}>
        {value}
      </p>
    </div>
  )
}

export default CompanyProfile