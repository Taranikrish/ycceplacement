import React from 'react'

function JobDetailModal({ job, isOpen, onClose, onApply, applying, isApplied, applicationStatus, role }) {
  if (!isOpen || !job) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h2>
              <p className="text-xl text-cyan-600 font-medium">{job.companyId.name}</p>
              <p className="text-gray-500">{job.companyId.location}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Job Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Job Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">Salary:</span>
                  <span className="ml-2">{job.salary ? `₹${job.salary}` : 'Not specified'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Branch:</span>
                  <span className="ml-2">{job.branch ? job.branch : 'Not specified'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Deadline:</span>
                  <span className="ml-2">{new Date(job.deadline).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Posted:</span>
                  <span className="ml-2">{new Date(job.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Company Details</h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">Company:</span>
                  <span className="ml-2">{job.companyId.name}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Location:</span>
                  <span className="ml-2">{job.companyId.location}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="ml-2">{job.companyId.emailId}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Job Description</h3>
            <p className="text-gray-700 leading-relaxed">{job.description}</p>
          </div>

          {/* Requirements */}
          {job.requirements && Array.isArray(job.requirements) && job.requirements.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Requirements</h3>
              <div className="flex flex-wrap gap-2">
                {job.requirements.map((req, index) => (
                  <span key={index} className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm">
                    {req}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* JD File */}
          {job.jd_file && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Job Description Document</h3>
              <a
                href={job.jd_file}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View JD Document
              </a>
            </div>
          )}

          {/* Apply Button */}
          {role === 'student' && (
            <div className="flex justify-end border-t pt-6">
              {isApplied ? (
                <span className={`px-4 py-2 rounded text-sm font-medium ${
                  applicationStatus === 'accepted' ? 'bg-green-100 text-green-800' :
                  applicationStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {applicationStatus === 'accepted' ? 'Application Accepted' :
                   applicationStatus === 'rejected' ? 'Application Rejected' :
                   'Already Applied'}
                </span>
              ) : (
                <button
                  onClick={() => onApply(job._id)}
                  disabled={applying === job._id}
                  className="bg-cyan-600 text-white px-6 py-2 rounded hover:bg-cyan-700 disabled:opacity-50 font-medium"
                >
                  {applying === job._id ? 'Applying...' : 'Apply Now'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default JobDetailModal
