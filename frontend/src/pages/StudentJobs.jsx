import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import JobDetailModal from '../components/JobDetailModal'
import { X, Send, Users, CheckCircle, Clock, Search, Filter, FileDown, Calendar, GraduationCap } from 'lucide-react'
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/* ===================== CONSTANT DATA ===================== */
const branches = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Telecommunication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering'
];

const domainMapping = {
  'Computer Science & Engineering': [
    'Web Development','Mobile Development','Data Science','Machine Learning',
    'Cybersecurity','Cloud Computing','DevOps','Blockchain','AI/ML','IoT',
    'Software Engineering','Database Management'
  ],
  'Information Technology': [
    'Web Development','Mobile Development','Data Science','Cybersecurity',
    'Cloud Computing','DevOps','Network Administration','System Administration',
    'Database Management','AI/ML','Blockchain','IoT'
  ],
  'Electronics & Telecommunication': [
    'Embedded Systems','IoT','Signal Processing','Communication Systems',
    'VLSI Design','Robotics','Control Systems','Wireless Communication',
    'Digital Electronics','Analog Electronics','Telecommunication','Network Security'
  ],
  'Mechanical Engineering': [
    'CAD/CAM','Robotics','Automotive Engineering','Manufacturing',
    'Thermal Engineering','Fluid Mechanics','Materials Science','Structural Analysis',
    'Mechatronics','Quality Control','Product Design','HVAC Systems'
  ],
  'Civil Engineering': [
    'Structural Engineering','Geotechnical Engineering','Transportation Engineering',
    'Environmental Engineering','Construction Management','Surveying','Water Resources',
    'Urban Planning','Building Information Modeling','Project Management',
    'Sustainable Design','Infrastructure Development'
  ],
  'Electrical Engineering': [
    'Power Systems','Control Systems','Electrical Machines','Renewable Energy',
    'Electronics','Instrumentation','Automation','Smart Grids','Embedded Systems',
    'Signal Processing','Electrical Design','Maintenance Engineering'
  ]
};

function StudentJobs({ role }) {
  // Common states
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [activeTab, setActiveTab] = useState(role === 'admin' ? 'pending' : 'jobs')

  // Student states
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [applying, setApplying] = useState(null)

  // Admin Applicants Modal States
  const [showApplicantsModal, setShowApplicantsModal] = useState(false)
  const [applicants, setApplicants] = useState([])
  const [loadingApplicants, setLoadingApplicants] = useState(false)
  const [placementStatusFilter, setPlacementStatusFilter] = useState('all') // 'all', 'placed', 'unplaced'
  const [selectedJob, setSelectedJob] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [branchSearch, setBranchSearch] = useState('')

  // Admin states
  const [pendingJobs, setPendingJobs] = useState([])
  const [approvedJobs, setApprovedJobs] = useState([])
  const [students, setStudents] = useState([])
  const [showSendModal, setShowSendModal] = useState(false)
  const [selectedStudents, setSelectedStudents] = useState([])
  const [sendToAll, setSendToAll] = useState(false)
  const [sending, setSending] = useState(false)
  
  // Admin Search States
  const [searchType, setSearchType] = useState('name');
  const [searchCriteria, setSearchCriteria] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');

  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (role === 'admin') {
      fetchPendingJobs()
      fetchApprovedJobs()
      fetchStudents()
    } else {
      fetchJobs()
      fetchApplications()
    }
  }, [role])

  const getAuthToken = () => {
    const auth = JSON.parse(localStorage.getItem('auth'))
    return auth?.token
  }

  /* ===================== ADMIN FUNCTIONS ===================== */
  const fetchPendingJobs = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/jobs/pending`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      })
      if (response.ok) {
        const data = await response.json()
        setPendingJobs(data)
      }
    } catch (err) { setError('Failed to fetch pending jobs') }
    finally { setLoading(false) }
  }

  const fetchApprovedJobs = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/jobs/approved`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      })
      if (response.ok) setApprovedJobs(await response.json())
    } catch (err) { console.error(err) }
  }

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/students`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      })
      if (response.ok) setStudents(await response.json())
    } catch (err) { console.error(err) }
  }

  const openSendModal = (job) => {
    setSelectedJob(job)
    setShowSendModal(true)
    setSelectedStudents([])
    setSendToAll(false)
    setSearchType('name')
    setSearchCriteria('')
    setSelectedBranch('')
  }

  const sendJobToStudents = async () => {
    if (!sendToAll && selectedStudents.length === 0) {
      setError('Please select at least one student or choose "Send to All"')
      return
    }
    setSending(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/jobs/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getAuthToken()}` },
        body: JSON.stringify({ jobId: selectedJob._id, studentIds: sendToAll ? [] : selectedStudents, sendToAll }),
      })
      if (response.ok) {
        setSuccess('Job sent to students successfully!')
        setShowSendModal(false)
        fetchPendingJobs(); fetchApprovedJobs();
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch (err) { setError('Error sending job') }
    finally { setSending(false) }
  }

  const fetchJobApplications = async (job) => {
    setSelectedJob(job)
    setShowApplicantsModal(true)
    setLoadingApplicants(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/jobs/${job._id}/applications`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      })
      if (response.ok) {
        setApplicants(await response.json())
      }
    } catch (err) {
      setError('Failed to fetch applicants')
    } finally {
      setLoadingApplicants(false)
    }
  }

  const markSelected = async (appId, sId, compName) => {
    if (!confirm(`Confirm selection of student for ${compName}?`)) return
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/jobs/select`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}` 
        },
        body: JSON.stringify({ applicationId: appId, studentId: sId, companyName: compName }),
      })
      if (response.ok) {
        setSuccess('Student marked as Selected!')
        fetchJobApplications(selectedJob); // Refresh list
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch (err) { setError('Failed to select student') }
  }

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('Applicant List', 105, 15, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Job Title: ${selectedJob.title}`, 14, 25);
    doc.text(`Company: ${selectedJob.companyId?.name}`, 14, 32);
    doc.text(`Date Generated: ${new Date().toLocaleDateString()}`, 14, 39);
    
    // Table
    const tableData = applicants.map((app, index) => [
      index + 1,
      app.studentId?.name,
      app.studentId?.rollNumber,
      app.studentId?.branch,
      app.studentId?.cgpa || 'N/A',
      app.studentId?.mobileNumber || 'N/A'
    ]);
    
    autoTable(doc, {
      startY: 45,
      head: [['#', 'Student Name', 'Roll Number', 'Branch', 'CGPA', 'Mobile']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [6, 182, 212] } // Cyan-600
    });
    
    doc.save(`${selectedJob.title}_Applicants.pdf`);
  }

  const revokeJob = async (jobId) => {
    if (!confirm('Are you sure you want to revoke this job?')) return
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/jobs/${jobId}/revoke`, {
        method: 'PUT', headers: { Authorization: `Bearer ${getAuthToken()}` },
      })
      if (response.ok) {
        setSuccess('Job revoked successfully')
        fetchPendingJobs(); fetchApprovedJobs();
      }
    } catch (err) { setError('Failed to revoke job') }
  }

  /* ===================== STUDENT FUNCTIONS ===================== */
  const fetchJobs = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/student/jobs`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      })
      if (response.ok) setJobs(await response.json())
    } catch (err) { setError('Error fetching jobs') }
    finally { setLoading(false) }
  }

  const fetchApplications = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/student/applications`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      })
      if (response.ok) setApplications(await response.json())
    } catch (err) { console.error('Error fetching applications:', err) }
  }

  const applyForJob = async (jobId) => {
    setApplying(jobId)
    setError(''); setSuccess('');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/student/jobs/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getAuthToken()}` },
        body: JSON.stringify({ jobId })
      })
      if (response.ok) {
        setSuccess('Application submitted successfully!')
        await fetchApplications(); // Refresh applications to update UI status
        setTimeout(() => setSuccess(''), 3000)
      } else {
        const data = await response.json()
        setError(data.message || 'Failed to apply')
      }
    } catch (err) { setError('Error applying for job') }
    finally { setApplying(null) }
  }

  // ID Matching helper (checks for object or string ID)
  const isApplied = (jobId) => applications.some(app => (app.jobId?._id || app.jobId) === jobId)
  
  const getApplicationStatus = (jobId) => {
    const application = applications.find(app => (app.jobId?._id || app.jobId) === jobId)
    return application ? application.status : null
  }

  /* ===================== FILTERING LOGIC ===================== */
  const filteredStudents = students.filter(student => {
    // Search Filters
    let matchesSearch = true;
    if (searchCriteria || searchType === 'branch' || searchType === 'domain') {
      if (searchType === 'name') matchesSearch = student.name.toLowerCase().includes(searchCriteria.toLowerCase());
      else if (searchType === 'rollNumber') matchesSearch = student.rollNumber.toLowerCase().includes(searchCriteria.toLowerCase());
      else if (searchType === 'branch') matchesSearch = !searchCriteria || student.branch === searchCriteria;
      else if (searchType === 'domain') {
        const matchesBranch = !selectedBranch || student.branch === selectedBranch;
        const matchesDomain = !searchCriteria || (student.domain && student.domain.includes(searchCriteria));
        matchesSearch = matchesBranch && matchesDomain;
      }
    }

    // Placement Status Filter
    let matchesStatus = true;
    if (placementStatusFilter === 'placed') matchesStatus = student.isSelected;
    else if (placementStatusFilter === 'unplaced') matchesStatus = !student.isSelected;

    return matchesSearch && matchesStatus;
  });

  const filteredJobs = jobs.filter(job => {
    if (!branchSearch) return true
    return job.branch && Array.isArray(job.branch) && job.branch.includes(branchSearch)
  })

  const handleStudentToggle = (id) => setSelectedStudents(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  const handleSelectAll = () => setSelectedStudents(selectedStudents.length === filteredStudents.length ? [] : filteredStudents.map(s => s._id))

  const renderSearchInput = () => {
    if (searchType === 'branch') {
      return (
        <select value={searchCriteria} onChange={e => setSearchCriteria(e.target.value)} className="flex-1 p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 outline-none">
          <option value="">Select Branch</option>
          {branches.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      );
    }
    if (searchType === 'domain') {
      const domains = selectedBranch ? domainMapping[selectedBranch] || [] : [];
      return (
        <div className="flex flex-col md:flex-row gap-2 flex-1">
          <select value={selectedBranch} onChange={e => { setSelectedBranch(e.target.value); setSearchCriteria(''); }} className="flex-1 p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 outline-none">
            <option value="">Select Branch First</option>
            {branches.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <select value={searchCriteria} onChange={e => setSearchCriteria(e.target.value)} disabled={!selectedBranch} className="flex-1 p-2.5 bg-white border border-gray-200 rounded-xl disabled:bg-gray-50 outline-none">
            <option value="">Select Domain</option>
            {domains.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      );
    }
    return (
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input type="text" placeholder={`Search by ${searchType}...`} value={searchCriteria} onChange={e => setSearchCriteria(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 outline-none" />
      </div>
    );
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-cyan-600"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {role === 'admin' ? 'Job Management' : 'Career Portal'}
            </h1>
            <p className="text-slate-500 text-sm mt-1 uppercase tracking-wider font-semibold">
              {role === 'admin' ? 'Placement Cell Administration' : 'Explore opportunities & track growth'}
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-cyan-50 text-cyan-700 rounded-full border border-cyan-100 font-bold text-xs">
             <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
             {role.toUpperCase()} SESSION
          </div>
        </div>
        
        {error && <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl text-red-700 font-medium text-sm animate-in fade-in slide-in-from-top-2">{error}</div>}
        {success && <div className="mb-6 p-4 bg-cyan-50 border-l-4 border-cyan-500 rounded-r-xl text-cyan-700 font-medium text-sm animate-in fade-in slide-in-from-top-2">{success}</div>}

        {/* Professional Tab Switcher */}
        <div className="flex p-1 bg-slate-100 rounded-xl w-fit mb-8">
          {role === 'admin' ? (
            <>
              <button onClick={() => setActiveTab('pending')} className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'pending' ? 'bg-white text-cyan-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                Pending ({pendingJobs.length})
              </button>
              <button onClick={() => setActiveTab('approved')} className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'approved' ? 'bg-white text-cyan-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                Approved ({approvedJobs.length})
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setActiveTab('jobs')} className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'jobs' ? 'bg-white text-cyan-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                Discover Jobs
              </button>
              <button onClick={() => setActiveTab('applications')} className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'applications' ? 'bg-white text-cyan-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                My Applications ({applications.length})
              </button>
            </>
          )}
        </div>

        {/* ADMIN VIEW */}
        {role === 'admin' && (
          <div className="animate-in fade-in duration-500">
            {activeTab === 'pending' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingJobs.map((job) => (
                  <div key={job._id} className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-cyan-300 transition-all shadow-sm flex flex-col">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{job.title}</h3>
                      <p className="text-cyan-600 font-bold text-xs uppercase tracking-wide mt-1">{job.companyId?.name}</p>
                    </div>
                    <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">{job.description}</p>
                    <button onClick={() => openSendModal(job)} className="w-full bg-cyan-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-sm hover:bg-cyan-700 transition shadow-lg shadow-cyan-100">
                      <Send size={16} /> Send to Students
                    </button>
                  </div>
                ))}
                {pendingJobs.length === 0 && <div className="col-span-full py-12 text-center text-slate-400 font-medium italic">No pending jobs found.</div>}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="divide-y divide-slate-100">
                  {approvedJobs.map((job) => (
                    <div key={job._id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                      <div>
                        <h3 className="text-md font-bold text-slate-900">{job.title}</h3>
                        <div className="flex items-center gap-2">
                          <p className="text-cyan-600 text-[10px] font-black uppercase tracking-widest">{job.companyId?.name}</p>
                          <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                            Audience: {job.isVisibleToAll ? 'Everyone' : `${job.visibleToStudents?.length || 0} Students`}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => fetchJobApplications(job)}
                          className="px-4 py-2 bg-cyan-600 text-white text-xs font-bold rounded-lg hover:bg-cyan-700 transition flex items-center gap-2"
                        >
                          <Users size={14} /> Applicants
                        </button>
                        <button onClick={() => revokeJob(job._id)} className="px-4 py-2 text-red-500 text-xs font-bold border border-red-100 rounded-lg hover:bg-red-50 transition">Revoke</button>
                      </div>
                    </div>
                  ))}
                  {approvedJobs.length === 0 && <div className="p-12 text-center text-slate-400 font-medium italic">No approved jobs available.</div>}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STUDENT VIEW */}
        {role === 'student' && (
          <div className="animate-in fade-in duration-500">
            {activeTab === 'jobs' ? (
              <>
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="relative w-full md:w-80">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <select value={branchSearch} onChange={(e) => setBranchSearch(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm font-semibold text-sm outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all appearance-none">
                      <option value="">Filter by Branch</option>
                      {branches.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Showing {filteredJobs.length} live opportunities
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredJobs.map((job) => (
                    <div key={job._id} className="group bg-white rounded-3xl border border-slate-100 p-7 hover:border-cyan-300 hover:shadow-xl transition-all cursor-pointer relative" onClick={() => { setSelectedJob(job); setIsModalOpen(true) }}>
                      <div className="mb-6">
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-cyan-600 transition-colors mb-1">{job.title}</h3>
                        <p className="text-cyan-600 font-bold text-xs uppercase tracking-widest">{job.companyId?.name}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-8">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Location</p>
                          <p className="text-sm font-semibold text-slate-700">📍 {job.companyId?.location}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Stipend/Salary</p>
                          <p className="text-sm font-semibold text-slate-700">💰 {job.salary ? `₹${job.salary}` : 'TBD'}</p>
                        </div>
                      </div>

                      <div className="mt-auto pt-4 border-t border-slate-50">
                        {isApplied(job._id) ? (
                          <div className={`w-full py-2.5 rounded-xl text-[10px] font-black uppercase text-center tracking-widest transition-colors ${getApplicationStatus(job._id) === 'accepted' ? 'bg-green-50 text-green-700' : 'bg-cyan-50 text-cyan-700'}`}>
                            {getApplicationStatus(job._id) || 'Application Sent'}
                          </div>
                        ) : (
                          <button 
                            onClick={(e) => { e.stopPropagation(); applyForJob(job._id) }}
                            disabled={applying === job._id}
                            className="w-full bg-cyan-600 text-white py-3 rounded-xl text-xs font-bold hover:bg-cyan-700 shadow-lg shadow-cyan-100 transition active:scale-95"
                          >
                            {applying === job._id ? 'Processing...' : 'Quick Apply'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {filteredJobs.length === 0 && <div className="col-span-full py-20 text-center text-slate-400 font-medium italic border-2 border-dashed border-slate-100 rounded-3xl">No jobs match your current branch filter.</div>}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <h2 className="text-lg font-bold text-slate-900">Application History</h2>
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded uppercase">Logs</span>
                </div>
                <div className="divide-y divide-slate-50">
                  {applications.map((app) => (
                    <div key={app._id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600 font-bold shadow-inner">
                            {app.jobId?.title?.charAt(0)}
                         </div>
                         <div>
                            <h3 className="font-bold text-slate-900 text-md">{app.jobId?.title}</h3>
                            <p className="text-cyan-600 font-bold text-[10px] uppercase tracking-wider">{app.companyId?.name}</p>
                            <p className="text-slate-400 text-[10px] mt-1 font-semibold uppercase">Applied: {new Date(app.appliedDate).toLocaleDateString()}</p>
                         </div>
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-center ${app.status === 'accepted' ? 'bg-green-100 text-green-700' : app.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-cyan-50 text-cyan-700 border border-cyan-100'}`}>
                        {app.status}
                      </span>
                    </div>
                  ))}
                  {applications.length === 0 && <div className="p-20 text-center text-slate-400 font-medium italic">You have no active applications.</div>}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ADMIN: Send Modal */}
        {role === 'admin' && showSendModal && selectedJob && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl scale-in-95 animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Publish Opportunity</h2>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">Role: {selectedJob.title}</p>
                </div>
                <button onClick={() => setShowSendModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition text-slate-400 hover:text-slate-600"><X size={20} /></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {/* Send to All Toggle */}
                <div 
                  onClick={() => setSendToAll(!sendToAll)}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${sendToAll ? 'bg-cyan-50 border-cyan-500 shadow-lg shadow-cyan-100' : 'bg-slate-50 border-slate-100 hover:border-slate-200'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${sendToAll ? 'bg-cyan-600' : 'bg-white border-2 border-slate-200'}`}>
                      {sendToAll && <CheckCircle size={14} className="text-white" />}
                    </div>
                    <div>
                      <p className={`font-bold text-sm ${sendToAll ? 'text-cyan-800' : 'text-slate-700'}`}>Broadcasting Mode</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Send to all {students.length} students</p>
                    </div>
                  </div>
                  <Users size={20} className={sendToAll ? 'text-cyan-600' : 'text-slate-300'} />
                </div>

                {!sendToAll && (
                  <div className="animate-in slide-in-from-top-4 duration-300 space-y-6">
                    <div className="bg-slate-100 p-4 rounded-2xl flex flex-col md:flex-row gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Search Via</label>
                        <select value={searchType} onChange={(e) => { setSearchType(e.target.value); setSearchCriteria(''); setSelectedBranch(''); }} className="md:w-36 p-2.5 bg-white border-none rounded-xl text-xs font-bold text-slate-600 shadow-sm outline-none">
                          <option value="name">NAME</option>
                          <option value="rollNumber">ROLL NO.</option>
                          <option value="branch">BRANCH</option>
                          <option value="domain">DOMAIN</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1 flex-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Filter Term</label>
                        {renderSearchInput()}
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Placement Status</label>
                        <select 
                          value={placementStatusFilter} 
                          onChange={(e) => setPlacementStatusFilter(e.target.value)} 
                          className="md:w-40 p-2.5 bg-white border-none rounded-xl text-xs font-bold text-slate-600 shadow-sm outline-none"
                        >
                          <option value="all">ALL STUDENTS</option>
                          <option value="unplaced">NOT PLACED YET</option>
                          <option value="placed">ALREADY PLACED</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-4 px-2">
                        <button onClick={handleSelectAll} className="text-cyan-600 font-bold text-[10px] hover:underline uppercase tracking-widest tracking-tighter">Toggle Result Page</button>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedStudents.length} Students Picked</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                        {filteredStudents.map((s) => (
                          <div 
                            key={s._id} 
                            onClick={() => handleStudentToggle(s._id)}
                            className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${selectedStudents.includes(s._id) ? 'bg-cyan-50 border-cyan-200' : 'bg-white border-slate-100 hover:border-slate-200'}`}
                          >
                            <div className={`w-4 h-4 rounded border transition-colors flex items-center justify-center ${selectedStudents.includes(s._id) ? 'bg-cyan-600 border-cyan-600 shadow-md shadow-cyan-100' : 'bg-white border-slate-300'}`}>
                              {selectedStudents.includes(s._id) && <CheckCircle size={10} className="text-white" />}
                            </div>
                            <div className="ml-3 truncate">
                              <p className="font-bold text-xs text-slate-800 truncate">{s.name}</p>
                              <p className="text-[9px] text-slate-500 font-bold uppercase truncate">{s.rollNumber} • {s.branch}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50">
                <button onClick={() => setShowSendModal(false)} className="px-6 py-2.5 text-slate-500 text-xs font-bold hover:text-slate-800 transition">Discard</button>
                <button 
                  onClick={sendJobToStudents} 
                  disabled={sending || (!sendToAll && selectedStudents.length === 0)} 
                  className="px-8 py-3 bg-cyan-600 text-white rounded-xl font-black text-xs shadow-xl shadow-cyan-100 disabled:opacity-50 hover:bg-cyan-700 transition flex items-center gap-2"
                >
                  <Send size={14} /> {sending ? 'PUBLISHING...' : 'PUBLISH NOW'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STUDENT: Detail Modal */}
        {role === 'student' && (
          <JobDetailModal
            job={selectedJob}
            isOpen={isModalOpen}
            onClose={() => { setIsModalOpen(false); setSelectedJob(null) }}
            onApply={applyForJob}
            applying={applying}
            isApplied={selectedJob ? isApplied(selectedJob._id) : false}
            applicationStatus={selectedJob ? getApplicationStatus(selectedJob._id) : null}
          />
        )}
        {/* ADMIN: Applicants Modal */}
        {role === 'admin' && showApplicantsModal && selectedJob && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[2rem] max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl relative overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                   <h2 className="text-xl font-bold text-slate-900 tracking-tight">Job Applications</h2>
                   <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
                     {selectedJob.title} • {applicants.length} Responses
                   </p>
                </div>
                <div className="flex gap-3">
                  {applicants.length > 0 && (
                    <button 
                      onClick={exportToPDF}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition shadow-lg"
                    >
                      <FileDown size={14} /> Export PDF
                    </button>
                  )}
                  <button onClick={() => setShowApplicantsModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition text-slate-400 hover:text-slate-600">
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                {loadingApplicants ? (
                   <div className="flex flex-col items-center justify-center py-20 grayscale">
                      <div className="w-10 h-10 border-4 border-cyan-100 border-t-cyan-600 rounded-full animate-spin mb-4"></div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compiling Database...</p>
                   </div>
                ) : applicants.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {applicants.map((app) => (
                      <div key={app._id} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-4 hover:shadow-md transition">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-cyan-600 font-black shadow-sm shrink-0">
                           {app.studentId?.name?.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="font-black text-sm text-slate-800 truncate">{app.studentId?.name}</p>
                           <div className="flex flex-wrap gap-y-1 gap-x-3 mt-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight flex items-center gap-1">
                                <GraduationCap size={12}/> {app.studentId?.branch}
                              </span>
                              <span className="text-[10px] font-bold text-cyan-600 uppercase tracking-tight font-black">
                                CGPA: {app.studentId?.cgpa || 'N/A'}
                              </span>
                           </div>
                           <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                             <Calendar size={12}/> Applied on {new Date(app.appliedDate).toLocaleDateString()}
                           </p>
                        </div>
                        <div className="shrink-0">
                           {app.studentId?.isSelected ? (
                             <div className="flex flex-col items-end">
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1 mb-1">
                                  <CheckCircle size={10}/> Selected
                                </span>
                                <p className="text-[8px] font-black text-slate-400 uppercase max-w-[80px] truncate text-right">@ {app.studentId?.selectedCompany}</p>
                             </div>
                           ) : (
                             <button 
                               onClick={() => markSelected(app._id, app.studentId?._id, selectedJob.companyId?.name)}
                               className="px-4 py-2 bg-white border border-cyan-100 text-cyan-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-cyan-600 hover:text-white transition shadow-sm"
                             >
                               Select Student
                             </button>
                           )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                     <Users size={48} className="mx-auto text-slate-200 mb-4" />
                     <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No students have applied yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentJobs