import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import JobDetailModal from '../components/JobDetailModal'

function StudentJobs({ role }) {

  // List of branches for the dropdown
  const branches = [
    'Computer Science & Engineering',
    'Information Technology',
    'Electronics & Telecommunication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering'
  ];
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [activeTab, setActiveTab] = useState('jobs')
  const [selectedJob, setSelectedJob] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [branchSearch, setBranchSearch] = useState('') // search input

  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    fetchJobs()
    fetchApplications()
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/student/jobs`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      if (response.ok) {
        const data = await response.json()
        setJobs(data)
      } else {
        setError('Failed to fetch jobs')
      }
    } catch (err) {
      console.error('Error fetching jobs:', err)
      setError('Error fetching jobs')
    } finally {
      setLoading(false)
    }
  }

  const fetchApplications = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/student/applications`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      if (response.ok) {
        const data = await response.json()
        setApplications(data)
      }
    } catch (err) {
      console.error('Error fetching applications:', err)
    }
  }

  const applyForJob = async (jobId) => {
    setApplying(jobId)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/student/jobs/apply`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId })
      })

      if (response.ok) {
        setSuccess('Application submitted successfully!')
        fetchApplications()
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to apply for job')
      }
    } catch (err) {
      console.error('Error applying for job:', err)
      setError('Error applying for job')
    } finally {
      setApplying(null)
    }
  }

  const isApplied = (jobId) => applications.some(app => app.jobId._id === jobId)
  const getApplicationStatus = (jobId) => {
    const application = applications.find(app => app.jobId._id === jobId)
    return application ? application.status : null
  }

  // Filter jobs by branch search
  const filteredJobs = jobs.filter(job => {
    if (!branchSearch) return true
    if (!job.branch) return false
    return job.branch.toLowerCase().includes(branchSearch.toLowerCase())
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-700/85 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading jobs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-cyan-700/85 mb-8">Job Portal</h1>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'jobs' ? 'border-b-2 border-cyan-700/85 text-cyan-700/85' : 'text-gray-600 hover:text-cyan-700/85'
            }`}
          >
            Available Jobs
          </button>
          {role === 'student' && (
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'applications' ? 'border-b-2 border-cyan-700/85 text-cyan-700/85' : 'text-gray-600 hover:text-cyan-700/85'
              }`}
            >
              My Applications
            </button>
          )}
        </div>

        {/* Error / Success Messages */}
        {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>}
        {success && <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">{success}</div>}

        {/* Search Bar */}
        {/* // Replace search input with dropdown */}
        {activeTab === 'jobs' && (
          <div className="mb-6">
            <select
              value={branchSearch}
              onChange={(e) => setBranchSearch(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">All Branches</option>
              {branches.map((branch, index) => (
                <option key={index} value={branch}>{branch}</option>
              ))}
            </select>
          </div>
        )}
        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => { setSelectedJob(job); setIsModalOpen(true) }}
              >
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">{job.title}</h3>
                  <p className="text-cyan-600 font-medium">{job.companyId.name}</p>
                  <p className="text-gray-500 text-sm">{job.companyId.location}</p>
                  {job.branch && <p className="text-gray-500 text-sm">Branch: {job.branch}</p>}
                </div>
                <div className="mb-4">
                  <p className="text-gray-600 text-sm mb-2 line-clamp-3">{job.description}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {job.requirements && Array.isArray(job.requirements) && job.requirements.slice(0, 3).map((req, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">{req}</span>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Salary: {job.salary ? `₹${job.salary}` : 'Not specified'}</span>
                    <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  {isApplied(job._id) ? (
                    <span className={`px-3 py-1 rounded text-sm font-medium ${
                      getApplicationStatus(job._id) === 'accepted' ? 'bg-green-100 text-green-700' :
                      getApplicationStatus(job._id) === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {getApplicationStatus(job._id) === 'accepted' ? 'Accepted' :
                       getApplicationStatus(job._id) === 'rejected' ? 'Rejected' :
                       'Applied'}
                    </span>
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); applyForJob(job._id) }}
                      disabled={applying === job._id}
                      className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 disabled:opacity-50 text-sm font-medium"
                    >
                      {applying === job._id ? 'Applying...' : 'Apply Now'}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {filteredJobs.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No jobs available for this branch.</p>
              </div>
            )}
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && role === 'student' && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">My Applications</h2>
              {applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.map((application) => (
                    <div key={application._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-700">{application.jobId.title}</h3>
                          <p className="text-cyan-600">{application.companyId.name}</p>
                          <p className="text-gray-500 text-sm">{application.companyId.location}</p>
                          <p className="text-gray-600 text-sm mt-1">{application.jobId.description}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded text-sm font-medium ${
                            application.status === 'accepted' ? 'bg-green-100 text-green-700' :
                            application.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </span>
                          <p className="text-gray-500 text-xs mt-1">
                            Applied: {new Date(application.appliedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">You haven't applied for any jobs yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Job Detail Modal */}
        <JobDetailModal
          job={selectedJob}
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setSelectedJob(null) }}
          onApply={applyForJob}
          applying={applying}
          isApplied={selectedJob ? isApplied(selectedJob._id) : false}
          applicationStatus={selectedJob ? getApplicationStatus(selectedJob._id) : null}
          role={role}
        />
      </div>
    </div>
  )
}

export default StudentJobs
