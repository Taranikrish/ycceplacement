import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import AdminSidebar from './AdminSidebar.jsx'
import CompanySidebar from './CompanySidebar.jsx'

function AdminStudentView({role}) {
  const { studentId } = useParams()
  const [studentProfile, setStudentProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchStudentProfile()
  }, [studentId])

  const fetchStudentProfile = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/student/profile/${studentId}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (response.ok) {
        const data = await response.json()
        setStudentProfile(data)
      } else {
        setError('Failed to fetch student profile')
      }
    } catch (error) {
      console.error('Error fetching student profile:', error)
      setError('Error fetching student profile')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen">
       {role === 'admin'?<AdminSidebar />:<CompanySidebar />}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-700/85 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading student profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen">
       {role === 'admin'?<AdminSidebar />:<CompanySidebar />}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {role === 'admin'?<AdminSidebar />:<CompanySidebar />}
      <div className="flex-1 p-6 md:ml-0 ml-0">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Student Profile</h1>

          {studentProfile && (
            <div className="bg-white rounded-lg  shadow-md p-6">
              {studentProfile.profilePhoto && (
                <div className="flex flex-col gap-2 justify-center items-center mb-6">
                  <img
                    src={studentProfile.profilePhoto}
                    alt="Profile Photo"
                    className="w-32 h-32 object-cover rounded-full"
                  />
                     <p className="mt-1 text-lg text-gray-900">{studentProfile.name}</p>

                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-lg text-gray-900">{studentProfile.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Roll Number</label>
                  <p className="mt-1 text-lg text-gray-900">{studentProfile.rollNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Branch</label>
                  <p className="mt-1 text-lg text-gray-900">{studentProfile.branch || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">CGPA</label>
                  <p className="mt-1 text-lg text-gray-900">{studentProfile.cgpa ? studentProfile.cgpa.toFixed(2) : 'Not calculated'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                  <p className="mt-1 text-lg text-gray-900">{studentProfile.mobileNumber || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Registration Status</label>
                  <p className={`mt-1 text-lg ${studentProfile.isregistered ? 'text-green-600' : 'text-red-600'}`}>
                    {studentProfile.isregistered ? 'Registered' : 'Not Registered'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Resume Detail</label>
                  <a href={studentProfile.resumePdf} target="_blank" rel="noopener noreferrer" className='text-cyan-300 underline' >Resume Pdf</a>
                  <a href={studentProfile.resumeVideo} target='_blank' rel='noopener noreferrer' className='text-cyan-300 underline mx-8'>Resume Video</a>
                </div>
              </div>

              {studentProfile.sgpa && studentProfile.sgpa.length > 0 && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">SGPA Details</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {studentProfile.sgpa.map((sgpa, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded">
                        <p className="text-sm text-gray-600">Semester {index + 1}</p>
                        <p className="text-lg font-semibold">{sgpa || 'N/A'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {studentProfile.domain && studentProfile.domain.length > 0 && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Domains of Interest</label>
                  <div className="flex flex-wrap gap-2">
                    {studentProfile.domain.map((domain, index) => (
                      <span key={index} className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
                        {domain}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              

              {!studentProfile.isregistered && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800">
                    This student has not completed their registration yet.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminStudentView
