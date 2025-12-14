import React from 'react'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import StudentSidebar from './StudentSidebar.jsx'

function StudentProfile() {
    const [searchParams] = useSearchParams()
    const studentId = searchParams.get('studentId')
    const [studentProfile, setStudentProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const fetchStudentProfile = async () => {
        try {
        setLoading(true)
        // Always fetch current user's profile, ignore studentId parameter
        const url = `${import.meta.env.VITE_API_BASE_URL}/api/student/profile`

        const response = await fetch(url, {
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

    useEffect(() => {
        fetchStudentProfile()
    }, [])

  return (
    <div className='flex min-h-screen bg-slate-100'>
        <div className='max-w-6xl mx-auto p-10'>
                  {loading ? (
                <div className="text-center">Loading...</div>
              ) : error ? (
                <div className="text-center text-red-600">{error}</div>
              ) : studentProfile ? (
                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center space-y-6">

                  {/* PROFILE PHOTO (Top) */}
                  <div className="flex items-center flex-col md:mr-10  gap-4 mb-6">
                    <div>
                      {studentProfile.profilePhoto ? (
                        <img src={studentProfile.profilePhoto} alt="profile" className="w-28 h-28 object-cover rounded-full" />
                      ) : (
                        <div className="w-28 h-28 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">No Photo</div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{studentProfile.name}</h3>
                      <p className="text-sm text-gray-600">{studentProfile.email}</p>
                    </div>
                  </div>

                  {/* Main info grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-3/4 md:ml-12 ">
                    {/* ... your existing info fields ... */}
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
                      <p className="mt-1 text-lg text-gray-900">{studentProfile.cgpa ? Number(studentProfile.cgpa).toFixed(2) : 'Not calculated'}</p>
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
                    <div >
                    <h4 className="font-medium text-gray-700 mb-2">Resume</h4>
                    <div className="flex items-center gap-4">
                      {studentProfile.resumePdf ? (
                        <a
                          href={studentProfile.resumePdf}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyan-700 underline"
                        >
                          Open Resume PDF
                        </a>
                      ) : (
                        <span className="text-sm text-gray-500">No resume PDF</span>
                      )}

                  

                      {studentProfile.resumeVideo ? (
                        <>
                          <a
                            href={studentProfile.resumeVideo}
                            target="_blank"
                            rel="noreferrer"
                            className="text-cyan-700 underline"
                          >
                            Open Resume Video
                          </a>
                          {/* small inline preview player if you want */}

                        </>
                      ) : (
                        <span className="text-sm text-gray-500">No resume video</span>
                      )}
                    </div>
                  </div>
                  </div>

                  {/* Resume links */}
                  

                

                  {!studentProfile.isregistered && (
                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-yellow-700/85">
                        Please complete your registration by filling out the Details form.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center">No profile data available</div>
              )}
        </div>
    </div>
  )
}

export default StudentProfile
