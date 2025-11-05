import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import StudentJobs from '../pages/StudentJobs'
import StudentSidebar from './StudentSidebar'

function StudentDashboard() {
  const [searchParams] = useSearchParams()
  const studentId = searchParams.get('studentId')
  const [activeTab, setActiveTab] = useState('profile')
  const [studentProfile, setStudentProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    branch: '',
    mobileNumber: '',
    sgpa: ['', '', '', '', '', ''],
    domain: []
  })
  const [customDomain, setCustomDomain] = useState('')
  const [availableDomains, setAvailableDomains] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    fetchStudentProfile()
  }, [])

  // Determine which tabs to show based on user role
  const getAvailableTabs = () => {
    if (user?.role === 'company') {
      return ['profile']
    }
    return ['profile', 'details', 'jobs']
  }

  const availableTabs = getAvailableTabs()

  const fetchStudentProfile = async () => {
    try {
      const url = studentId
        ? `${import.meta.env.VITE_API_BASE_URL}/api/student/profile/${studentId}`
        : `${import.meta.env.VITE_API_BASE_URL}/api/student/profile`

      const response = await fetch(url, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (response.ok) {
        const data = await response.json()
        setStudentProfile(data)
        setFormData({
          branch: data.branch || '',
          mobileNumber: data.mobileNumber || '',
          sgpa: data.sgpa || ['', '', '', '', '', ''],
          domain: data.domain || []
        })
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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSgpaChange = (index, value) => {
    const newSgpa = [...formData.sgpa]
    newSgpa[index] = value
    setFormData(prev => ({
      ...prev,
      sgpa: newSgpa
    }))
  }

  const handleDomainChange = (domain) => {
    setFormData(prev => ({
      ...prev,
      domain: prev.domain.includes(domain)
        ? prev.domain.filter(d => d !== domain)
        : [...prev.domain, domain]
    }))
  }

  const calculateCgpa = () => {
    const validSgpa = formData.sgpa.filter(s => s && !isNaN(s)).map(s => parseFloat(s))
    if (validSgpa.length === 6) {
      return (validSgpa.reduce((sum, val) => sum + val, 0) / 6).toFixed(2)
    }
    return '0.00'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/student/profile`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          branch: formData.branch,
          mobileNumber: formData.mobileNumber,
          sgpa: formData.sgpa.map(s => s ? parseFloat(s) : 0),
          domain: formData.domain
        })
      })

      if (response.ok) {
        const data = await response.json()
        setStudentProfile(data.student)
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

  const branches = [
    'Computer Science & Engineering',
    'Information Technology',
    'Electronics & Telecommunication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering'
  ]

  // Domain mapping based on branch
  const domainMapping = {
    'Computer Science & Engineering': [
      'Web Development',
      'Mobile Development',
      'Data Science',
      'Machine Learning',
      'Cybersecurity',
      'Cloud Computing',
      'DevOps',
      'Blockchain',
      'AI/ML',
      'IoT',
      'Software Engineering',
      'Database Management'
    ],
    'Information Technology': [
      'Web Development',
      'Mobile Development',
      'Data Science',
      'Cybersecurity',
      'Cloud Computing',
      'DevOps',
      'Network Administration',
      'System Administration',
      'Database Management',
      'AI/ML',
      'Blockchain',
      'IoT'
    ],
    'Electronics & Telecommunication': [
      'Embedded Systems',
      'IoT',
      'Signal Processing',
      'Communication Systems',
      'VLSI Design',
      'Robotics',
      'Control Systems',
      'Wireless Communication',
      'Digital Electronics',
      'Analog Electronics',
      'Telecommunication',
      'Network Security'
    ],
    'Mechanical Engineering': [
      'CAD/CAM',
      'Robotics',
      'Automotive Engineering',
      'Manufacturing',
      'Thermal Engineering',
      'Fluid Mechanics',
      'Materials Science',
      'Structural Analysis',
      'Mechatronics',
      'Quality Control',
      'Product Design',
      'HVAC Systems'
    ],
    'Civil Engineering': [
      'Structural Engineering',
      'Geotechnical Engineering',
      'Transportation Engineering',
      'Environmental Engineering',
      'Construction Management',
      'Surveying',
      'Water Resources',
      'Urban Planning',
      'Building Information Modeling',
      'Project Management',
      'Sustainable Design',
      'Infrastructure Development'
    ],
    'Electrical Engineering': [
      'Power Systems',
      'Control Systems',
      'Electrical Machines',
      'Renewable Energy',
      'Electronics',
      'Instrumentation',
      'Automation',
      'Smart Grids',
      'Embedded Systems',
      'Signal Processing',
      'Electrical Design',
      'Maintenance Engineering'
    ]
  }

  // Get available domains based on selected branch
  const getAvailableDomains = (branch) => {
    if (!branch) return []
    return domainMapping[branch] || []
  }

  // Update available domains when branch changes
  useEffect(() => {
    setAvailableDomains(getAvailableDomains(formData.branch))
  }, [formData.branch])

  const addCustomDomain = () => {
    if (customDomain.trim() && !formData.domain.includes(customDomain.trim())) {
      setFormData(prev => ({
        ...prev,
        domain: [...prev.domain, customDomain.trim()]
      }))
      setCustomDomain('')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentSidebar />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-amber-800 mb-8">Student Dashboard</h1>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          {availableTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium ${
                activeTab === tab
                  ? 'border-b-2 border-amber-800 text-amber-800'
                  : 'text-gray-600 hover:text-amber-800'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && studentProfile && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Student Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-lg text-gray-900">{studentProfile.name}</p>
              </div>
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
            </div>

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
                  Please complete your registration by filling out the Details form.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Registration Details</h2>

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

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Branch Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                >
                  <option value="">Select Branch</option>
                  {branches.map((branch, index) => (
                    <option key={index} value={branch}>{branch}</option>
                  ))}
                </select>
              </div>

              {/* Mobile Number Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter your mobile number"
                />
              </div>

              {/* SGPA Inputs */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SGPA (Semester 1-6)</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((sem) => (
                    <div key={sem}>
                      <label className="block text-xs text-gray-600 mb-1">Sem {sem}</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        value={formData.sgpa[sem-1] || ''}
                        onChange={(e) => handleSgpaChange(sem-1, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="0.00"
                      />
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Calculated CGPA: <span className="font-semibold">{calculateCgpa()}</span>
                </p>
              </div>

              {/* Domain Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Domains of Interest</label>
                {formData.branch ? (
                  <>
                    <p className="text-sm text-gray-600 mb-3">Select domains relevant to your branch:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                      {availableDomains.slice(0, 8).map((domain, index) => (
                        <label key={index} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.domain.includes(domain)}
                            onChange={() => handleDomainChange(domain)}
                            className="mr-2 h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">{domain}</span>
                        </label>
                      ))}
                    </div>
                    {availableDomains.length > 8 && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Additional domains for your branch:</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {availableDomains.slice(8).map((domain, index) => (
                            <label key={index} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.domain.includes(domain)}
                                onChange={() => handleDomainChange(domain)}
                                className="mr-2 h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                              />
                              <span className="text-sm text-gray-700">{domain}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-gray-500 mb-3">Please select a branch first to see relevant domains.</p>
                )}

                {/* Custom Domain Input */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Add Custom Domain</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customDomain}
                      onChange={(e) => setCustomDomain(e.target.value)}
                      placeholder="Enter a custom domain"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={addCustomDomain}
                      className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      Add
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Add domains from other branches or custom interests</p>
                </div>

                {/* Selected Domains Display */}
                {formData.domain.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Selected Domains:</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.domain.map((domain, index) => (
                        <span key={index} className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                          {domain}
                          <button
                            type="button"
                            onClick={() => handleDomainChange(domain)}
                            className="ml-1 text-amber-600 hover:text-amber-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-amber-800 text-white px-6 py-2 rounded-md hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Details'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <StudentJobs />
        )}
      </div>
    </div>
  )
}

export default StudentDashboard
