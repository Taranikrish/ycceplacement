import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function Jobs() {
  const location = useLocation()
  const navigate = useNavigate()
  const { job, company } = location.state || {}
  const [loading, setLoading] = useState(false)

  const handlePostJob = async () => {
    setLoading(true)
    try {
      const auth = JSON.parse(localStorage.getItem('auth'))
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/company/jobs`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(job),
      })

      if (response.ok) {
        const createdJob = await response.json()
        navigate('/company/dashboard#jobs')
      } else {
        console.error('Failed to post job')
      }
    } catch (error) {
      console.error('Error posting job:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!job || !company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Job Data</h1>
          <p className="text-gray-600">Please create a job posting first.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Job Posting Created</h1>

        {/* Company Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Posted by: {company.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <p><strong>Email:</strong> {company.email}</p>
            <p><strong>Industry:</strong> {company.industry}</p>
            <p><strong>Location:</strong> {company.location}</p>
            <p><strong>Contact:</strong> {company.contactPerson}</p>
          </div>
        </div>

        {/* Job Details */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6">{job.title}</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Job Description</h3>
              <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Requirements</h3>
              <p className="text-gray-700 whitespace-pre-line">{job.requirements}</p>
            </div>
            {/* Branch Section */}
            {job.branch && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Branch</h3>
                  <p className="text-gray-700">{job.branch}</p>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Salary Range</h3>
                <p className="text-gray-700">{job.salary || 'Not specified'}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Application Deadline</h3>
                <p className="text-gray-700">{job.deadline || 'Not specified'}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t">
            <button
              onClick={handlePostJob}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 mr-4"
            >
              {loading ? 'Posting...' : 'Post Job'}
            </button>
            <button
              onClick={() => window.history.back()}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Jobs
