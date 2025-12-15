import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import CompanySidebar from './CompanySidebar.jsx'

function CompanyDashboard() {
  const [searchParams] = useSearchParams()
  const companyId = searchParams.get('companyId')
  const [company, setCompany] = useState(null)
  const [applications, setApplications] = useState([])
  const [jobs, setJobs] = useState([])
  const [showJobForm, setShowJobForm] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    requirements: '',
    salary: '',
    location: '',
    deadline: '',
    jdFile: null
  })
  const [activeTab, setActiveTab] = useState('profile')
  const [editForm, setEditForm] = useState({
    phoneNumber: '',
    location: '',
    contactPerson: '',
    linkedInUrl: '',
    dpiitNumber: ''
  })
  const [saving, setSaving] = useState(false)
  const [submitting, setSubmitting] = useState(false) // for job posting
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
// Define branches array
const branches = [
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
        // Fetch company profile
        const profileUrl = isAdminView
          ? `${import.meta.env.VITE_API_BASE_URL}/api/company/profile/${companyId}`
          : `${import.meta.env.VITE_API_BASE_URL}/api/company/profile`

        const profileResponse = await fetch(profileUrl, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (profileResponse.ok) {
          const profileData = await profileResponse.json()
          // profileData may be object or wrapped, adapt if your API returns { company: {...} }
          const profile = profileData.company || profileData
          setCompany(profile)
          setEditForm({
            phoneNumber: profile.phoneNumber || '',
            location: profile.location || '',
            contactPerson: profile.contactPerson || '',
            linkedInUrl: profile.linkedInUrl || '',
            dpiitNumber: profile.dpiitNumber || ''
          })
        }

        // Only fetch jobs and applications if not admin view
        if (!isAdminView) {
          // Fetch jobs
          const jobsResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/company/jobs`, {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          })
          if (jobsResponse.ok) {
            const jobsData = await jobsResponse.json()
            setJobs(jobsData)
          }

          // Fetch applications
          const appsResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/company/applications`, {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          })
          if (appsResponse.ok) {
            const appsData = await appsResponse.json()
            setApplications(appsData)
          }
        }
      } catch (err) {
        console.error('Error fetching company data:', err)
        setError('Failed to load company data')
        setTimeout(() => setError(''), 4000)
      }
    }
    fetchCompanyData()
  }, [companyId, isAdminView])

  // file change handler for JD PDF
  const handleFileChange = (e) => {
    const file = e.target.files?.[0] ?? null
    if (!file) {
      setJobData((s) => ({ ...s, jdFile: null }))
      return
    }

    // basic client-side validation
    const allowedTypes = ['application/pdf']
    const maxSize = 10 * 1024 * 1024 // 10 MB

    if (!allowedTypes.includes(file.type)) {
      setError('Only PDF files are allowed for JD.')
      setTimeout(() => setError(''), 4000)
      return
    }
    if (file.size > maxSize) {
      setError('JD file must be under 10MB.')
      setTimeout(() => setError(''), 4000)
      return
    }

    setError('')
    setJobData((s) => ({ ...s, jdFile: file }))
  }

  // Submit job (uploads JD if provided)
  const handleJobSubmit = async (e) => {
    e.preventDefault()
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
    if (jobData.branch) formData.append('branch', jobData.branch) // add branch here

      // Attach JD file using the field name expected by backend (uploadJdFile.single('jd_file'))
      if (jobData.jdFile) {
      // file is the File object from <input type="file" />
      formData.append('jd_file', jobData.jdFile, jobData.jdFile.name);
      }

      // If admin creating on behalf of a company (only if your backend allows it)
      if (isAdminView && companyId) {
        formData.append('companyId', companyId)
      }

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/company/jobs`, {
        method: 'POST',
        credentials: 'include',
        // DO NOT set Content-Type header — browser will set multipart boundary
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || 'Failed to create job')
      }

      const createdJob = await res.json()

      // Add job to local state so UI updates without refetch
      setJobs((prev) => [createdJob, ...prev])

      // Clear form
      setJobData({
        title: '',
        description: '',
        requirements: '',
        salary: '',
        location: '',
        deadline: '',
        branch: '',
        jdFile: null
      })

      setShowJobForm(false)
      setSuccess('Job posted successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Error creating job:', err)
      setError(err.message || 'Error creating job')
      setTimeout(() => setError(''), 4000)
    } finally {
      setSubmitting(false)
    }
  }

  const handleJobClick = (job) => {
    if (selectedJob && selectedJob._id === job._id) {
      setSelectedJob(null)
    } else {
      setSelectedJob(job)
    }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/company/profile`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm)
      })

      if (response.ok) {
        const data = await response.json()
        const updatedCompany = data.company || data
        setCompany(updatedCompany)
        setSuccess('Profile updated successfully!')
        setActiveTab('profile')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        const errorData = await response.json().catch(() => ({}))
        setError(errorData.message || 'Failed to update profile')
        setTimeout(() => setError(''), 4000)
      }
    } catch (err) {
      console.error('Error updating profile:', err)
      setError('Error updating profile')
      setTimeout(() => setError(''), 4000)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone and will delete all your jobs and applications.')) {
      return
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/company/profile`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        // Clear auth and redirect to signin
        localStorage.removeItem('auth')
        navigate('/Signin/company')
      } else {
        const errorData = await response.json().catch(() => ({}))
        setError(errorData.message || 'Failed to delete account')
        setTimeout(() => setError(''), 3000)
      }
    } catch (err) {
      console.error('Error deleting account:', err)
      setError('Error deleting account')
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job? This will also remove all applications for this job.')) {
      return
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/company/jobs/${jobId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        // Remove the job from the local state
        setJobs((prev) => prev.filter(job => job._id !== jobId))
        // Clear selected job if it was the deleted one
        if (selectedJob && selectedJob._id === jobId) {
          setSelectedJob(null)
        }
        setSuccess('Job deleted successfully!')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        const errorData = await response.json().catch(() => ({}))
        setError(errorData.message || 'Failed to delete job')
        setTimeout(() => setError(''), 3000)
      }
    } catch (err) {
      console.error('Error deleting job:', err)
      setError('Error deleting job')
      setTimeout(() => setError(''), 3000)
    }
  }

const renderContent = () => {
    if (activeTab === 'edit') {
      return (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Edit Profile</h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800">{success}</p>
            </div>
          )}

          <form onSubmit={handleEditSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="text"
                value={editForm.phoneNumber}
                onChange={(e) => setEditForm({...editForm, phoneNumber: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Url</label>
              <input
                type="text"
                value={editForm.linkedInUrl}
                onChange={(e) => setEditForm({...editForm, linkedInUrl: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Enter linkedInUrl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">DPIIT Number</label>
              <input
                type="text"
                value={editForm.dpiitNumber}
                onChange={(e) => setEditForm({...editForm, dpiitNumber: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Enter DPIIT Number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={editForm.location}
                onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Enter location"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
              <input
                type="text"
                value={editForm.contactPerson}
                onChange={(e) => setEditForm({...editForm, contactPerson: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Enter contact person name"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-cyan-800 text-white px-6 py-2 rounded hover:bg-cyan-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )
    } else if (location.hash === '#jobs') {
      return (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Jobs Created</h2>
            <div className="text-sm text-gray-600">
              Total Jobs: <span className="font-semibold text-cyan-600">{jobs.length}</span>
            </div>
          </div>

          {jobs.length > 0 ? (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job._id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                        <div className="flex items-center gap-2">
                          {job.jd_file && (
                            <a
                              href={job.jd_file}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              View JD
                            </a>
                          )}
                          <button
                            onClick={() => handleDeleteJob(job._id)}
                            className="inline-flex items-center px-3 py-1 text-sm bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-3 line-clamp-2">{job.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                        {/* ⚠️ Added Branch Field to Job Listing */}
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                          </svg>
                          Branch: {job.branch || 'Any'}
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                          Salary: {job.salary ? `₹${job.salary}` : 'Not specified'}
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'No deadline'}
                        </div>

                        {job.location && (
                          <div className="flex items-center text-sm text-gray-500">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Location: {job.location}
                          </div>
                        )}
                      </div>

                      {job.requirements && Array.isArray(job.requirements) && job.requirements.length > 0 && (
                        <div className="mb-3">
                          <span className="text-sm font-medium text-gray-700 mr-2">Requirements:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {job.requirements.slice(0, 4).map((req, index) => (
                              <span key={index} className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                {req}
                              </span>
                            ))}
                            {job.requirements.length > 4 && (
                              <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                +{job.requirements.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <button
                      onClick={() => handleJobClick(job)}
                      className="text-cyan-600 hover:text-cyan-700 font-medium text-sm flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {selectedJob && selectedJob._id === job._id ? 'Hide Details' : 'View Details'}
                    </button>
                    <div className="text-xs text-gray-400">
                      ID: {job._id.slice(-6)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs created</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating your first job posting.</p>
            </div>
          )}

          {selectedJob && (
            <div className="mt-6 border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Job Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Job Title</label>
                  <p className="mt-1 text-lg">{selectedJob.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Salary Range</label>
                  <p className="mt-1 text-lg">{selectedJob.salary}</p>
                </div>
                {/* ⚠️ Added Branch Field to Job Details */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Eligible Branch</label>
                  <p className="mt-1 text-lg">{selectedJob.branch || 'Any'}</p>
                </div>
                {/* ⚠️ Corrected Date Field (Previously duplicate 'Created Date') */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Application Deadline</label>
                  <p className="mt-1 text-lg">
                    {selectedJob.deadline ? new Date(selectedJob.deadline).toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      timeZone: 'Asia/Kolkata' // Omitted time for deadline clarity
                    }) : 'No deadline'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Created Date</label>
                  <p className="mt-1 text-lg">
                    {new Date(selectedJob.createdDate).toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                      timeZone: 'Asia/Kolkata'
                    })}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1">{selectedJob.description}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Requirements</label>
                  {/* Assuming requirements is a string or array that needs formatting */}
                  <p className="mt-1">{Array.isArray(selectedJob.requirements) ? selectedJob.requirements.join(', ') : selectedJob.requirements}</p>
                </div>
              </div>
            </div>
          )}

          {/* ... Create New Job Form is retained and correct for branch input ... */}
          {company?.verified && (
            <div className="mt-6">
              <button
                onClick={() => setShowJobForm(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Create New Job
              </button>
            </div>
          )}

          {showJobForm && (
            <div className="mt-6 border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Create Job Posting</h3>
              {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
              <form onSubmit={handleJobSubmit} className="space-y-4">
                {/* ... existing job form fields ... */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Job Title</label>
                  <input
                    type="text"
                    required
                    value={jobData.title}
                    onChange={(e) => setJobData({...jobData, title: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    placeholder="e.g., Software Engineer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    required
                    value={jobData.description}
                    onChange={(e) => setJobData({...jobData, description: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    rows="4"
                    placeholder="Job description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Requirements</label>
                  <textarea
                    required
                    value={jobData.requirements}
                    onChange={(e) => setJobData({...jobData, requirements: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    rows="3"
                    placeholder="Required skills, experience..."
                  />
                </div>

                {/* Branch Input - Already exists and is correct */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Eligible Branch</label>
                  <select
                    value={jobData.branch || ''}
                    onChange={(e) => setJobData({ ...jobData, branch: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white focus:ring-cyan-500 focus:border-cyan-500"
                  >
                    <option value="" disabled>Select a branch</option>
                    {branches.map((branch, index) => (
                      <option key={index} value={branch}>{branch}</option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-500 mt-1">Select the eligible branch for this job.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Salary Range</label>
                    <input
                      type="text"
                      value={jobData.salary}
                      onChange={(e) => setJobData({...jobData, salary: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      placeholder="e.g., 5-8 LPA"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                      type="text"
                      value={jobData.location}
                      onChange={(e) => setJobData({ ...jobData, location: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      placeholder="e.g., Pune, Mumbai, Remote"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">JD (PDF)</label>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                    {jobData.jdFile && (
                      <p className="mt-2 text-sm text-gray-600">Selected file: {jobData.jdFile.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Application Deadline</label>
                    <input
                      type="date"
                      value={jobData.deadline}
                      onChange={(e) => setJobData({...jobData, deadline: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-60"
                  >
                    {submitting ? 'Posting...' : 'Post Job'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowJobForm(false)}
                    className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )
    } else if (location.hash === '#applications') {
      return (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Applications Received</h2>
          {applications.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Roll Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Branch
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CGPA
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((application, index) => (
                    <tr key={index} className="hover:bg-gray-50 cursor-pointer" onClick={() => window.location.href = `/company/dashboard/applications/${application.studentId._id}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {application.studentId.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {application.studentId.emailId.split('@')[0]}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {application.studentId.branch || 'Not specified'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {application.studentId.cgpa ? application.studentId.cgpa.toFixed(2) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(application.appliedDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No applications received yet.</p>
          )}
        </div>
      )
    } else {
      // Default Profile view
      return (
        <div className="bg-white w-3/4 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Company Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Name</label>
              <p className="mt-1 text-lg">{company.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-lg">{company.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <p className="mt-1 text-lg">{company.phoneNumber || 'Not provided'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <p className="mt-1 text-lg">{company.location || 'Not provided'}</p>
            </div>
            {/* linkedIn */}
            <div>
              <label className="block text-sm font-medium text-gray-700">LinkedIn </label>
              <a href={company.linkedInUrl} target="_blank" rel="noopener noreferrer" className='text-cyan-700/85 underline' >
                {company.linkedInUrl ? 'LinkedIn Profile' : 'Not provided'}
              </a>
            </div>
            {/* dpiitNumber */}
            <div>
              <label className="block text-sm font-medium text-gray-700">DPIIT Number</label>
              <p className="mt-1 text-lg">{company.dpiitNumber || 'Not provided'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Person</label>
              <p className="mt-1 text-lg">{company.contactPerson || 'Not provided'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Verification Status</label>
              <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                company.verified
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {company.verified ? 'Verified' : 'Unverified'}
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={() => setActiveTab('edit')}
              className="bg-cyan-700/85 text-white px-6 py-2 rounded hover:bg-cyan-900"
            >
              Edit Profile
            </button>
            <button
              onClick={handleDeleteAccount}
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
            >
              Delete Account
            </button>
          </div>
        </div>
      )
    }
  }
  if (!company) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {isAdminView ? (
        <div className="flex-1 p-6">
          <div className="mb-6">
            <button
              onClick={() => navigate('/admin/companies')}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              ← Back to Companies
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Company Profile (Admin View)</h1>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Company Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                <p className="mt-1 text-lg">{company.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-lg">{company.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <p className="mt-1 text-lg">{company.phoneNumber || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <p className="mt-1 text-lg">{company.location || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Person</label>
                <p className="mt-1 text-lg">{company.contactPerson || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Verification Status</label>
                <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                  company.verified
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {company.verified ? 'Verified' : 'Unverified'}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <CompanySidebar />
          <div className="flex-1 p-6 md:ml-0 ml-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Company Dashboard</h1>
            {renderContent()}

            {!company.verified && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
                <h3 className="text-lg font-medium text-yellow-800 mb-2">Verification Required</h3>
                <p className="text-yellow-700">
                  Your company needs to be verified by the admin before you can post job openings.
                  Please contact the placement cell for verification.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default CompanyDashboard
