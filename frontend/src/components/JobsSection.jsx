import React, { useState, useEffect } from 'react'
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  DollarSign, 
  GraduationCap, 
  Trash2, 
  Eye, 
  FileText, 
  Plus, 
  X,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  FileUp,
  Clock,
  Users
} from 'lucide-react'

function JobsSection({ jobs: initialJobs, company, branches }) {
  const [jobs, setJobs] = useState(initialJobs || [])
  const [selectedJobId, setSelectedJobId] = useState(null)
  const [showJobForm, setShowJobForm] = useState(false)
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    requirements: '',
    salary: '',
    location: '',
    deadline: '',
    branch: [],
    jdFile: null
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Field level validation errors
  const [fieldErrors, setFieldErrors] = useState({})

  useEffect(() => {
    setJobs(initialJobs || [])
  }, [initialJobs])

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] ?? null
    if (!file) {
      setJobData((s) => ({ ...s, jdFile: null }))
      return
    }
    const allowedTypes = ['application/pdf']
    const maxSize = 10 * 1024 * 1024
    if (!allowedTypes.includes(file.type)) {
      setError('Only PDF files are allowed for JD.')
      return
    }
    if (file.size > maxSize) {
      setError('JD file must be under 10MB.')
      return
    }
    setError('')
    setJobData((s) => ({ ...s, jdFile: file }))
  }

  const validateForm = () => {
    const errors = {}
    
    // RegEx Patterns
    const titleRegex = /^[a-zA-Z\s\(\)\-\/\&]{3,100}$/
    const salaryRegex = /^[\d\s\-\.LPAkK\/\,]{1,50}$/i
    const locationRegex = /^[a-zA-Z\s\,\-]{2,100}$/

    if (!titleRegex.test(jobData.title)) {
      errors.title = "Please enter a valid job title (letters and standard characters only)."
    }
    if (jobData.salary && !salaryRegex.test(jobData.salary)) {
      errors.salary = "Invalid salary format. Use e.g. '12 LPA' or '50,000'."
    }
    if (jobData.location && !locationRegex.test(jobData.location)) {
      errors.location = "Please enter a valid location (letters and cities only)."
    }
    if (jobData.branch.length === 0) {
      errors.branch = "Please select at least one eligible branch."
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleJobSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      setError('Please correct the highlighted errors before publishing.')
      return
    }

    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const formData = new FormData()
      formData.append('title', jobData.title)
      formData.append('description', jobData.description)
      formData.append('requirements', jobData.requirements || '')
      formData.append('salary', jobData.salary || '')
      formData.append('location', jobData.location || '')
      if (jobData.deadline) formData.append('deadline', jobData.deadline)
      jobData.branch.forEach(b => formData.append('branch', b))
      if (jobData.jdFile) formData.append('jd_file', jobData.jdFile)

      const auth = JSON.parse(localStorage.getItem('auth'))
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/company/jobs`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${auth?.token}` },
        body: formData,
      })

      if (!res.ok) throw new Error('Failed to create job')

      const createdJob = await res.json()
      setJobs((prev) => [createdJob, ...prev])
      setJobData({ title: '', description: '', requirements: '', salary: '', location: '', deadline: '', branch: [], jdFile: null })
      setShowJobForm(false)
      setSuccess('Job live on portal!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Permanent Action: Delete this job?')) return
    try {
      const auth = JSON.parse(localStorage.getItem('auth'))
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/company/jobs/${jobId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${auth?.token}` }
      })
      if (response.ok) {
        setJobs((prev) => prev.filter(job => job._id !== jobId))
        setSuccess('Job removed.')
      }
    } catch (err) { setError('Delete failed.') }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* --- HEADER STATS --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Job Inventory</h2>
          <p className="text-slate-500 text-sm font-medium">Manage your active recruitment listings</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="px-6 py-2 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Openings</p>
            <p className="text-xl font-black text-cyan-600">{jobs.length}</p>
          </div>
          {company?.verified && (
            <button
              onClick={() => setShowJobForm(true)}
              className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-cyan-200 active:scale-95"
            >
              <Plus size={20} /> Create New Opening
            </button>
          )}
        </div>
      </div>

      {/* --- MESSAGES --- */}
      {success && (
        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-6 py-4 rounded-2xl border border-green-100 animate-bounce">
          <CheckCircle2 size={18} /> <span className="text-sm font-bold">{success}</span>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 text-red-700 px-6 py-4 rounded-2xl border border-red-100">
          <AlertCircle size={18} /> <span className="text-sm font-bold">{error}</span>
        </div>
      )}

      {/* --- JOBS LIST --- */}
      <div className="grid grid-cols-1 gap-6">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div key={job._id} className="group bg-white rounded-[2rem] border border-slate-100 hover:border-cyan-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="p-8">
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">{job.title}</h3>
                      <span className="px-3 py-1 bg-cyan-50 text-cyan-600 text-[10px] font-black uppercase tracking-widest rounded-lg">
                        ID: {job._id.slice(-6)}
                      </span>
                      {job.isApproved ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1">
                          <CheckCircle2 size={12} /> Live
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1">
                          <Clock size={12} /> Pending Approval
                        </span>
                      )}
                    </div>

                    <p className="text-slate-500 text-sm mb-6 leading-relaxed line-clamp-2">{job.description}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-8">
                      <MetaInfo icon={<GraduationCap size={16}/>} label="Branches" value={Array.isArray(job.branch) ? job.branch.join(', ') : (job.branch || 'Any')} />
                      <MetaInfo icon={<DollarSign size={16}/>} label="Salary" value={job.salary || 'Competitive'} />
                      <MetaInfo icon={<Calendar size={16}/>} label="Deadline" value={job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Rolling'} />
                      <MetaInfo icon={<MapPin size={16}/>} label="Location" value={job.location || 'Hybrid/Remote'} />
                    </div>
                  </div>

                  <div className="flex lg:flex-col justify-end gap-3 shrink-0">
                    {job.jd_file && (
                      <a
                        href={job.jd_file} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-cyan-50 text-slate-600 hover:text-cyan-600 rounded-xl transition-colors font-bold text-xs uppercase tracking-widest"
                      >
                        <FileText size={16} /> View JD
                      </a>
                    )}
                    <button
                      onClick={() => handleDeleteJob(job._id)}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl border border-slate-100 hover:border-red-100 transition-all font-bold text-xs uppercase tracking-widest"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedJobId(selectedJobId === job._id ? null : job._id)}
                    className="flex items-center gap-2 text-cyan-600 font-black text-xs uppercase tracking-widest hover:translate-x-1 transition-transform"
                  >
                    {selectedJobId === job._id ? <><ChevronUp size={16}/> Hide Details</> : <><Eye size={16}/> Full Analysis</>}
                  </button>
                  <p className="text-[10px] text-slate-300 font-bold italic">Posted on {new Date(job.createdDate || Date.now()).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Expandable Details */}
              {selectedJobId === job._id && (
                <div className="px-8 pb-8 animate-in slide-in-from-top-4 duration-500">
                  <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                     <h4 className="text-xs font-black uppercase tracking-widest text-cyan-600 mb-4 flex items-center gap-2">
                       <Briefcase size={14}/> Job Deep Dive
                     </h4>
                     <div className="space-y-6">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Requirements</p>
                          <p className="text-slate-700 text-sm leading-relaxed">{Array.isArray(job.requirements) ? job.requirements.join(', ') : job.requirements}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Target Audience</p>
                          <div className="bg-white p-4 rounded-2xl border border-slate-100">
                            {job.isVisibleToAll ? (
                              <p className="text-green-600 font-bold text-sm tracking-tight flex items-center gap-2">
                                <Users size={16}/> Visibility: All Registered Students
                              </p>
                            ) : (Array.isArray(job.visibleToStudents) && job.visibleToStudents.length > 0) ? (
                              <div className="space-y-2">
                                <p className="text-cyan-600 font-bold text-xs uppercase tracking-widest">
                                  Selectively Published ({job.visibleToStudents.length} Students)
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {Array.isArray(job.visibleToStudents) && job.visibleToStudents.slice(0, 10).map(s => s && (
                                    <span key={s._id} className="px-2 py-1 bg-slate-100 rounded-md text-[10px] font-bold text-slate-600">
                                      {s.name} ({s.branch})
                                    </span>
                                  ))}
                                  {job.visibleToStudents.length > 10 && (
                                    <span className="text-[10px] text-slate-400 font-bold italic">+{job.visibleToStudents.length - 10} more...</span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <p className="text-amber-600 font-bold text-sm tracking-tight flex items-center gap-2">
                                <AlertCircle size={16}/> Waiting for admin to assign audience
                              </p>
                            )}
                          </div>
                        </div>
                     </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-slate-200 text-center">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase size={40} className="text-slate-300" />
             </div>
             <h3 className="text-xl font-black text-slate-900 tracking-tight">Zero Postings Found</h3>
             <p className="text-slate-500 text-sm mt-2">Start your recruitment drive by adding your first job.</p>
          </div>
        )}
      </div>

      {/* --- CREATE JOB MODAL --- */}
      {showJobForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowJobForm(false)}></div>
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl p-8 md:p-12 animate-in zoom-in-95 duration-300">
            <button onClick={() => setShowJobForm(false)} className="absolute top-8 right-8 p-2 hover:bg-slate-100 rounded-full transition-colors"><X/></button>
            
            <div className="mb-10 text-center">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">Create Job Posting</h3>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2 italic">Fill in the professional details below</p>
            </div>

            <form onSubmit={handleJobSubmit} className="space-y-8">
              {/* Segmented Form Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormGroup label="Job Title" sub="e.g. Senior Software Architect" error={fieldErrors.title}>
                  <input 
                    type="text" required 
                    value={jobData.title} 
                    onChange={(e)=>setJobData({...jobData, title: e.target.value})} 
                    className={`form-input-formal ${fieldErrors.title ? 'border-red-300' : ''}`}
                    placeholder="Enter formal designation" 
                  />
                </FormGroup>

                <FormGroup label="Location" sub="City, State or Remote status" error={fieldErrors.location}>
                  <input 
                    type="text" 
                    value={jobData.location} 
                    onChange={(e)=>setJobData({...jobData, location: e.target.value})} 
                    className={`form-input-formal ${fieldErrors.location ? 'border-red-300' : ''}`}
                    placeholder="e.g. Mumbai, MH" 
                  />
                </FormGroup>

                <FormGroup label="Salary Package" sub="Annual CTC or stipends" error={fieldErrors.salary}>
                  <input 
                    type="text" 
                    value={jobData.salary} 
                    onChange={(e)=>setJobData({...jobData, salary: e.target.value})} 
                    className={`form-input-formal ${fieldErrors.salary ? 'border-red-300' : ''}`}
                    placeholder="e.g. 10 - 12 LPA" 
                  />
                </FormGroup>

                <FormGroup label="Application Deadline" sub="Final date for students">
                  <input 
                    type="date" 
                    value={jobData.deadline} 
                    onChange={(e)=>setJobData({...jobData, deadline: e.target.value})} 
                    className="form-input-formal" 
                  />
                </FormGroup>
              </div>

              <FormGroup label="Detailed Job Description" sub="Describe roles and team culture">
                <textarea 
                  rows="4" required 
                  value={jobData.description} 
                  onChange={(e)=>setJobData({...jobData, description: e.target.value})} 
                  className="form-input-formal resize-none min-h-[100px]" 
                  placeholder="Provide comprehensive details..."
                ></textarea>
              </FormGroup>

              <FormGroup label="Requirements" sub="Skills and qualifications">
                <textarea 
                  rows="3" required 
                  value={jobData.requirements} 
                  onChange={(e)=>setJobData({...jobData, requirements: e.target.value})} 
                  className="form-input-formal resize-none min-h-[80px]" 
                  placeholder="List required tech stack..."
                ></textarea>
              </FormGroup>

              <div className="space-y-4 bg-slate-50/50 p-6 rounded-3xl border border-slate-100 shadow-inner">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[11px] font-black uppercase tracking-[0.25em] text-cyan-600 block">Eligible Disciplines</label>
                  {fieldErrors.branch && <span className="text-[10px] text-red-500 font-bold uppercase">{fieldErrors.branch}</span>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {branches.map((b) => (
                    <label key={b} className={`flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer select-none ${jobData.branch.includes(b) ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400'}`}>
                      <input type="checkbox" className="hidden" checked={jobData.branch.includes(b)} onChange={(e) => {
                        const next = e.target.checked ? [...jobData.branch, b] : jobData.branch.filter(item => item !== b);
                        setJobData({ ...jobData, branch: next });
                      }} />
                      <span className="text-[11px] font-black uppercase tracking-tight">{b}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <label className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 block mb-3">Upload Formal JD (PDF)</label>
                  <label className="flex items-center justify-center gap-3 p-8 border-2 border-dashed border-slate-200 rounded-[2rem] bg-white cursor-pointer hover:bg-slate-50 transition-all group">
                    <FileUp size={24} className="text-slate-300 group-hover:text-cyan-600" />
                    <span className="text-sm font-black text-slate-700">{jobData.jdFile ? jobData.jdFile.name : 'Choose Official Document'}</span>
                    <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="flex gap-4 pt-8">
                <button type="submit" disabled={submitting} className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black shadow-2xl transition-all disabled:opacity-50 active:scale-95">
                  {submitting ? 'Broadcasting...' : 'Publish Official Opening'}
                </button>
                <button type="button" onClick={() => setShowJobForm(false)} className="px-10 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">
                  Discard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// Internal Helper Components for Cleanliness
function MetaInfo({ icon, label, value }) {
  return (
    <div className="flex flex-col gap-1 group/meta">
      <div className="flex items-center gap-2 text-slate-300 group-hover/meta:text-cyan-500 transition-colors">
        {icon}
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-xs font-bold text-slate-600 pl-6">{value}</p>
    </div>
  )
}

function FormGroup({ label, sub, error, children }) {
  return (
    <div className="space-y-2">
      <div className="flex flex-col">
        <label className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-900">{label}</label>
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight italic">{sub}</span>
          {error && <span className="text-[9px] text-red-500 font-bold uppercase tracking-widest animate-pulse">{error}</span>}
        </div>
      </div>
      {children}
    </div>
  )
}

export default JobsSection