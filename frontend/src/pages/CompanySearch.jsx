import React, { useState, useEffect } from 'react'
import AdminSidebar from '../components/AdminSidebar.jsx'
import { useNavigate } from 'react-router-dom'
import { 
  Building2, 
  ShieldCheck, 
  ShieldX, 
  Trash2, 
  Search, 
  MapPin, 
  User, 
  Mail, 
  Filter, 
  RefreshCw,
  CheckCircle2,
  XCircle,
  ChevronRight
} from 'lucide-react'

function CompanySearch() {
  const navigate = useNavigate()
  const [companies, setCompanies] = useState([])
  const [filteredCompanies, setFilteredCompanies] = useState([])
  const [loading, setLoading] = useState(false)
  const [filterBy, setFilterBy] = useState('all') 
  const [verifying, setVerifying] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const fetchAllCompanies = async () => {
    setLoading(true)
    try {
      const auth = JSON.parse(localStorage.getItem('auth'))
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/companies`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth?.token}`,
        }
      })
      if (response.ok) {
        const data = await response.json()
        setCompanies(data)
        filterCompanies(data)
      } else {
        console.error('Failed to fetch companies')
        setCompanies([])
        setFilteredCompanies([])
      }
    } catch (error) {
      console.error('Error fetching companies:', error)
      setCompanies([])
      setFilteredCompanies([])
    } finally {
      setLoading(false)
    }
  }

  const filterCompanies = (companiesList = companies) => {
    if (filterBy === 'all') {
      setFilteredCompanies(companiesList)
    } else if (filterBy === 'verified') {
      setFilteredCompanies(companiesList.filter(company => company.isVerified))
    } else if (filterBy === 'unverified') {
      setFilteredCompanies(companiesList.filter(company => !company.isVerified))
    }
  }

  const handleVerifyCompany = async (companyId, currentStatus) => {
    const newStatus = currentStatus ? 'unverified' : 'verified'
    if (!window.confirm(`Are you sure you want to mark this company as ${newStatus}? ${!currentStatus ? 'This will allow them to post jobs.' : 'This will remove all their jobs and applications.'}`)) {
      return
    }

    setVerifying(companyId)
    try {
      const auth = JSON.parse(localStorage.getItem('auth'))
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/companies/${companyId}/verify`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth?.token}`,
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        const result = await response.json()
        setCompanies(prev => prev.map(company =>
          company._id === companyId
            ? { ...company, isVerified: !currentStatus }
            : company
        ))
        filterCompanies()
        alert(result.message)
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to update company status')
      }
    } catch (error) {
      console.error('Error updating company status:', error)
      alert('Error updating company status')
    } finally {
      setVerifying(null)
    }
  }

  const handleDeleteCompany = async (companyId, companyName) => {
    if (!window.confirm(`Are you sure you want to delete ${companyName}? This will permanently remove the company and all associated jobs and applications.`)) {
      return
    }

    setDeleting(companyId)
    try {
      const auth = JSON.parse(localStorage.getItem('auth'))
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/companies/${companyId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth?.token}`,
        }
      })

      if (response.ok) {
        const result = await response.json()
        setCompanies(prev => prev.filter(company => company._id !== companyId))
        filterCompanies()
        alert(result.message)
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to delete company')
      }
    } catch (error) {
      console.error('Error deleting company:', error)
      alert('Error deleting company')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <AdminSidebar />
      
      <main className="flex-1 flex flex-col min-w-0">
        {/* --- EXECUTIVE HEADER --- */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 md:px-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Recruiter Management</p>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Company Directory</h1>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
            <Building2 size={18} className="text-cyan-600" />
            <span className="text-xs font-black text-slate-600 uppercase tracking-widest">{filteredCompanies.length} Organizations</span>
          </div>
        </header>

        <div className="p-6 md:p-10 max-w-7xl w-full mx-auto space-y-8">
          
          {/* --- FILTER CONTROL PANEL --- */}
          <section className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="h-10 w-[1px] bg-slate-100 hidden lg:block mx-2"></div>

              <div className="flex items-center gap-4 w-full">
                <div className="flex items-center gap-3 flex-1 lg:max-w-xs">
                  <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400">
                    <Filter size={18} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Filter Visibility</label>
                    <select
                      value={filterBy}
                      onChange={(e) => {
                        setFilterBy(e.target.value)
                        if (companies.length > 0) filterCompanies()
                      }}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-cyan-500 transition-all"
                    >
                      <option value="all">All Organizations</option>
                      <option value="verified">Verified Partners</option>
                      <option value="unverified">Unverified/Pending</option>
                    </select>
                  </div>
                </div>
                <button
                onClick={fetchAllCompanies}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.15em] hover:bg-slate-800 transition-all shadow-lg active:scale-95 whitespace-nowrap"
              >
                <RefreshCw size={16} /> Get All Companies
              </button>
              </div>
              
            </div>
          </section>

          {/* --- COMPANIES LIST --- */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
               <div className="w-12 h-12 border-4 border-cyan-100 border-t-cyan-600 rounded-full animate-spin mb-4"></div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compiling Records...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map((company, index) => (
                  <div 
                    key={index} 
                    className="group bg-white rounded-[2rem] border border-slate-100 hover:border-cyan-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                    onClick={() => navigate(`/company/dashboard?companyId=${company._id}`)}
                  >
                    <div className="p-8">
                      <div className="flex flex-col lg:flex-row justify-between gap-8">
                        {/* Identity Section */}
                        <div className="flex gap-6 items-start">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center text-slate-400 group-hover:from-cyan-500 group-hover:to-cyan-700 group-hover:text-white transition-all shadow-inner">
                            <Building2 size={28} />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-xl font-black text-slate-900 tracking-tight">{company.name}</h3>
                              <span className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                company.isVerified ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600 border border-red-50'
                              }`}>
                                {company.isVerified ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                {company.isVerified ? 'Verified' : 'Pending'}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-x-6 gap-y-2">
                               <span className="flex items-center gap-2 text-xs font-bold text-slate-400"><Mail size={14} className="text-cyan-500" /> {company.emailId}</span>
                               <span className="flex items-center gap-2 text-xs font-bold text-slate-400"><MapPin size={14} className="text-cyan-500" /> {company.location}</span>
                               <span className="flex items-center gap-2 text-xs font-bold text-slate-400"><User size={14} className="text-cyan-500" /> {company.contactPerson}</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions Section */}
                        <div className="flex lg:flex-col items-center lg:items-end justify-center gap-3 pt-6 lg:pt-0 border-t lg:border-t-0 border-slate-50">
                           <div className="flex gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleVerifyCompany(company._id, company.isVerified);
                                }}
                                disabled={verifying === company._id}
                                className={`px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                                  company.isVerified
                                    ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    : 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-200'
                                } disabled:opacity-50`}
                              >
                                {verifying === company._id ? 'Processing...' : (company.isVerified ? 'Revoke Access' : 'Grant Access')}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteCompany(company._id, company.name);
                                }}
                                disabled={deleting === company._id}
                                className="px-4 py-2.5 rounded-xl bg-white border border-red-100 text-red-500 font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                              >
                                {deleting === company._id ? 'Deleting...' : <Trash2 size={16} />}
                              </button>
                           </div>
                           <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest hidden lg:block group-hover:text-cyan-600 transition-colors">
                             View Analytics <ChevronRight size={12} className="inline ml-1" />
                           </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-slate-100 text-center">
                   <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search size={40} className="text-slate-200" />
                   </div>
                   <h3 className="text-xl font-black text-slate-900 tracking-tight">No Matching Partners</h3>
                   <p className="text-slate-400 text-sm mt-2">Adjust your filters to see more organizations.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default CompanySearch