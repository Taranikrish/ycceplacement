import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import CompanySidebar from './CompanySidebar.jsx'

function CompanyDashboard() {
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
    deadline: ''
  })
  const [activeTab, setActiveTab] = useState('profile')
  const [editForm, setEditForm] = useState({
    phoneNumber: '',
    location: '',
    contactPerson: ''
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const auth = JSON.parse(localStorage.getItem('auth'))
        // Fetch company profile
        const profileResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/company/profile`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        if (profileResponse.ok) {
          const profileData = await profileResponse.json()
          setCompany(profileData)
          setEditForm({
            phoneNumber: profileData.phoneNumber || '',
            location: profileData.location || '',
            contactPerson: profileData.contactPerson || ''
          })
        }

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
      } catch (error) {
        console.error('Error fetching company data:', error)
      }
    }

    fetchCompanyData()
  }, [])

  const handleJobSubmit = (e) => {
    e.preventDefault()
    // Navigate to jobs page with job data
    navigate('/company/jobs', { state: { job: jobData, company: company } })
  }

  const handleJobClick = (job) => {
    setSelectedJob(job)
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
        setCompany(data.company)
        setSuccess('Profile updated successfully!')
        setActiveTab('profile')
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setError('Error updating profile')
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
        const errorData = await response.json()
        setError(errorData.message || 'Failed to delete account')
      }
    } catch (error) {
      console.error('Error deleting account:', error)
      setError('Error deleting account')
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
        setJobs(jobs.filter(job => job._id !== jobId))
        // Clear selected job if it was the deleted one
        if (selectedJob && selectedJob._id === jobId) {
          setSelectedJob(null)
        }
        setSuccess('Job deleted successfully!')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to delete job')
        setTimeout(() => setError(''), 3000)
      }
    } catch (error) {
      console.error('Error deleting job:', error)
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={editForm.location}
                onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Enter location"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
              <input
                type="text"
                value={editForm.contactPerson}
                onChange={(e) => setEditForm({...editForm, contactPerson: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Enter contact person name"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-amber-800 text-white px-6 py-2 rounded hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
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
          <h2 className="text-2xl font-semibold mb-4">Jobs Created</h2>
          {jobs.length > 0 ? (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job._id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 cursor-pointer" onClick={() => handleJobClick(job)}>
                      <h3 className="text-lg font-medium">{job.title}</h3>
                      <p className="text-gray-600">{job.description}</p>
                      <p className="text-sm text-gray-500">Created: {new Date(job.createdAt).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-500">Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'No deadline'}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteJob(job._id)}
                      className="ml-4 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No jobs created yet.</p>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700">Deadline</label>
                  <p className="mt-1 text-lg">{selectedJob.deadline}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Created Date</label>
                  <p className="mt-1 text-lg">{selectedJob.createdDate}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1">{selectedJob.description}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Requirements</label>
                  <p className="mt-1">{selectedJob.requirements}</p>
                </div>
              </div>
            </div>
          )}

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
              <form onSubmit={handleJobSubmit} className="space-y-4">
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
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                  >
                    Post Job
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
                    <tr key={index} className="hover:bg-gray-50 cursor-pointer" onClick={() => window.location.href = `/student/dashboard?studentId=${application.studentId._id}`}>
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
                        {application.studentId.cgpa ? application.studentId.cgpa.toFixed(2) : 'Not calculated'}
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

          <div className="mt-6 flex gap-4">
            <button
              onClick={() => setActiveTab('edit')}
              className="bg-amber-800 text-white px-6 py-2 rounded hover:bg-amber-900"
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
    </div>
  )
}

export default CompanyDashboard
