import React, { useState, useEffect } from 'react'


function StudentDetail() {
    const [studentProfile, setStudentProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        branch: '',
        mobileNumber: '',
        sgpa: ['', '', '', '', '', ''],
        domain: [],
        address: '',
        city: '',
        state: '',
        pin: ''
    })

    const [customDomain, setCustomDomain] = useState('')
    const [availableDomains, setAvailableDomains] = useState([])
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [profileFile, setProfileFile] = useState(null)
    const [profilePreview, setProfilePreview] = useState(null)
    const [profileUploading, setProfileUploading] = useState(false)
    const [profileMessage, setProfileMessage] = useState('')

    const [resumePdfFile, setResumePdfFile] = useState(null)
    const [resumePdfPreview, setResumePdfPreview] = useState(null)
    const [resumePdfUploading, setResumePdfUploading] = useState(false)
    const [resumePdfMessage, setResumePdfMessage] = useState('')

    const [resumeVideoFile, setResumeVideoFile] = useState(null)
    const [resumeVideoPreview, setResumeVideoPreview] = useState(null)
    const [resumeVideoUploading, setResumeVideoUploading] = useState(false)
    const [resumeVideoMessage, setResumeVideoMessage] = useState('')

    const fetchStudentProfile = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/student/profile`, {
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
                    domain: data.domain || [],
                    address: data.address || '',
                    city: data.city || '',
                    state: data.state || '',
                    pin: data.pin || ''
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

    useEffect(() => {
        fetchStudentProfile()
    }, [])
     
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
          domain: formData.domain,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pin: formData.pin
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

  // ---------------- FILE INPUT HANDLERS ----------------

  // client-side validations (sizes in bytes)
  const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024 // 5 MB
  const MAX_RESUME_PDF_SIZE = 10 * 1024 * 1024 // 10 MB
  const MAX_RESUME_VIDEO_SIZE = 50 * 1024 * 1024 // 50 MB

  // Generic file change
  const handleFileChange = (e, type) => {
    const file = e.target.files[0]
    if (!file) return

    if (type === 'profile') {
      if (!file.type.startsWith('image/')) {
        setProfileMessage('Only image files allowed for profile photo.')
        return
      }
      if (file.size > MAX_PROFILE_IMAGE_SIZE) {
        setProfileMessage('Profile photo is too large (max 5MB).')
        return
      }
      setProfileFile(file)
      setProfilePreview(URL.createObjectURL(file))
      setProfileMessage('')
    } else if (type === 'resumePdf') {
      if (file.type !== 'application/pdf') {
        setResumePdfMessage('Only PDF files allowed for resume.')
        return
      }
      if (file.size > MAX_RESUME_PDF_SIZE) {
        setResumePdfMessage('Resume PDF is too large (max 10MB).')
        return
      }
      setResumePdfFile(file)
      setResumePdfPreview(null) // No preview for PDF
      setResumePdfMessage('')
    } else if (type === 'resumeVideo') {
      if (!file.type.startsWith('video/')) {
        setResumeVideoMessage('Only video files allowed for resume video.')
        return
      }
      if (file.size > MAX_RESUME_VIDEO_SIZE) {
        setResumeVideoMessage('Resume video is too large (max 50MB).')
        return
      }
      setResumeVideoFile(file)
      setResumeVideoPreview(URL.createObjectURL(file))
      setResumeVideoMessage('')
    }
  }

  // Generic uploader using fetch + FormData
  const uploadFile = async (type) => {
    setError('')
    setSuccess('')

    let endpoint = ''
    let fileToUpload = null
    let setUploading, setMessage

    if (type === 'profile') {
      endpoint = '/api/student/profile/photo'
      fileToUpload = profileFile
      setUploading = setProfileUploading
      setMessage = setProfileMessage
    } else if (type === 'resumePdf') {
      endpoint = '/api/student/profile/resume-pdf'
      fileToUpload = resumePdfFile
      setUploading = setResumePdfUploading
      setMessage = setResumePdfMessage
    } else if (type === 'resumeVideo') {
      endpoint = '/api/student/profile/resume-video'
      fileToUpload = resumeVideoFile
      setUploading = setResumeVideoUploading
      setMessage = setResumeVideoMessage
    } else {
      return
    }

    if (!fileToUpload) {
      setMessage('No file selected.')
      return
    }

    try {
      setUploading(true)
      setMessage('Uploading...')

      const form = new FormData()
      // ensure field names match your multer.single('<name>')
      if (type === 'profile') form.append('profilePhoto', fileToUpload)
      if (type === 'resumePdf') form.append('resumePdf', fileToUpload)
      if (type === 'resumeVideo') form.append('resumeVideo', fileToUpload)

      const url = `${import.meta.env.VITE_API_BASE_URL}${endpoint}`

      const resp = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: form,
      })

      // attempt to use returned URLs immediately (backend should return secure urls)
      if (resp.ok) {
        const data = await resp.json().catch(() => ({}))
        setMessage('Upload successful.')

        // If API returned the new URLs, update profile locally; otherwise refetch
        let updated = false
        if (type === 'profile' && data.profilePhoto) {
          setStudentProfile(prev => ({ ...(prev || {}), profilePhoto: data.profilePhoto }))
          updated = true
        }
        if (type === 'resumePdf' && data.resumePdf) {
          setStudentProfile(prev => ({ ...(prev || {}), resumePdf: data.resumePdf }))
          updated = true
        }
        if (type === 'resumeVideo' && data.resumeVideo) {
          setStudentProfile(prev => ({ ...(prev || {}), resumeVideo: data.resumeVideo }))
          updated = true
        }

        if (!updated) {
          // fallback: refetch full profile
          await fetchStudentProfile()
        }

        // clear local preview and file to reduce memory usage
        if (type === 'profile') {
          setProfileFile(null)
          setProfilePreview(null)
        } else if (type === 'resumePdf') {
          setResumePdfFile(null)
          setResumePdfPreview(null)
        } else if (type === 'resumeVideo') {
          setResumeVideoFile(null)
          setResumeVideoPreview(null)
        }
      } else {
        const errorData = await resp.json().catch(() => ({}))
        const msg = errorData.message || 'Upload failed'
        setMessage(msg)
      }
    } catch (err) {
      console.error('Upload error:', err)
      setMessage('Upload failed: server error.')
    } finally {
      if (setUploading) setUploading(false)
    }
  }

  // Optionally: delete file (calls backend delete endpoints)
  const deleteFile = async (type) => {
    setError('')
    setSuccess('')

    let endpoint = ''
    if (type === 'profile') endpoint = '/api/student/profile/photo'
    if (type === 'resumePdf') endpoint = '/api/student/profile/resume-pdf'
    if (type === 'resumeVideo') endpoint = '/api/student/profile/resume-video'

    try {
      const resp = await fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (resp.ok) {
        await fetchStudentProfile()
        if (type === 'profile') setProfileMessage('Deleted successfully.')
        if (type === 'resumePdf') setResumePdfMessage('Deleted successfully.')
        if (type === 'resumeVideo') setResumeVideoMessage('Deleted successfully.')
      } else {
        const errorData = await resp.json().catch(() => ({}))
        const msg = errorData.message || 'Delete failed'
        setError(msg)
      }
    } catch (err) {
      console.error('Delete error:', err)
      setError('Delete failed: server error.')
    }
  }
   if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-700/85 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='flex min-h-screen bg-slate-100'>
        
       <div className='max-w-6xl mx-auto '>
            <div className="bg-white rounded-lg shadow-md p-6 flex-1">
            <h2 className="text-2xl font-semibold mb-6 text-gray-700/85">Registration Details</h2>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700/85">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700/85">{success}</p>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Enter your mobile number"
                />
              </div>

              {/* Address Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Enter your address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Enter your city"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Enter your state"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">PIN Code</label>
                  <input
                    type="text"
                    name="pin"
                    value={formData.pin}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Enter PIN code"
                  />
                </div>
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="0.00"
                      />
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Calculated CGPA: <span className="font-semibold">{calculateCgpa()}</span>
                </p>
              </div>

              {/* Domain selection + custom domain */}
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
                            className="mr-2 h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">{domain}</span>
                        </label>
                      ))}
                    </div>
                    {availableDomains.length > 8 && (
                      <div className="mb-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {availableDomains.slice(8).map((domain, index) => (
                            <label key={index} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.domain.includes(domain)}
                                onChange={() => handleDomainChange(domain)}
                                className="mr-2 h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
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
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <button
                      type="button"
                      onClick={addCustomDomain}
                      className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
                        <span key={index} className="bg-cyan-100 text-cyan-700/85 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                          {domain}
                          <button
                            type="button"
                            onClick={() => handleDomainChange(domain)}
                            className="ml-1 text-cyan-600 hover:text-cyan-700/85"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              
            
             {/* MEDIA UPLOAD (existing cards kept) */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Photo Card */}
              <div className="border rounded-md p-4">
                <h3 className="font-semibold mb-3">Profile Photo</h3>
                <div className="mb-3">
                  {profilePreview ? (
                    <img src={profilePreview} alt="preview" className="w-40 h-40 object-cover rounded-full" />
                  ) : studentProfile.profilePhoto ? (
                    <img src={studentProfile.profilePhoto} alt="profile" className="w-40 h-40 object-cover rounded-full" />
                  ) : (
                    <div className="w-40 h-40 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">No Photo</div>
                  )}
                </div>
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'profile')} />
                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => uploadFile('profile')}
                    disabled={profileUploading}
                    className="px-3 py-2 bg-cyan-700/85 text-white rounded-md disabled:opacity-50"
                  >
                    {profileUploading ? 'Uploading...' : 'Upload'}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteFile('profile')}
                    className="px-3 py-2 bg-red-50 text-red-700 rounded-md border border-red-100"
                  >
                    Delete
                  </button>
                </div>
                {profileMessage && <p className="mt-2 text-sm text-gray-700">{profileMessage}</p>}
              </div>

              {/* Resume PDF Card */}
              <div className="border rounded-md p-4">
                <h3 className="font-semibold mb-3">Resume PDF</h3>
                <div className="mb-3">
                  {studentProfile.resumePdf ? (
                    <div className="w-full h-40 bg-gray-100 rounded-md flex items-center justify-center text-gray-600">
                      <div className="text-center">
                        <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm">Resume PDF Uploaded</p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-40 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">No Resume PDF</div>
                  )}
                </div>
                <input type="file" accept="application/pdf" onChange={(e) => handleFileChange(e, 'resumePdf')} />
                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => uploadFile('resumePdf')}
                    disabled={resumePdfUploading}
                    className="px-3 py-2 bg-cyan-700/85 text-white rounded-md disabled:opacity-50"
                  >
                    {resumePdfUploading ? 'Uploading...' : 'Upload'}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteFile('resumePdf')}
                    className="px-3 py-2 bg-red-50 text-red-700 rounded-md border border-red-100"
                  >
                    Delete
                  </button>
                </div>
                {resumePdfMessage && <p className="mt-2 text-sm text-gray-700">{resumePdfMessage}</p>}
              </div>

              {/* Resume Video Card */}
              <div className="border rounded-md p-4">
                <h3 className="font-semibold mb-3">Resume Video</h3>
                <div className="mb-3">
                  {resumeVideoPreview ? (
                    <video src={resumeVideoPreview} controls className="w-full h-40 object-cover rounded-md" />
                  ) : studentProfile.resumeVideo ? (
                    <video src={studentProfile.resumeVideo} controls className="w-full h-40 object-cover rounded-md" />
                  ) : (
                    <div className="w-full h-40 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">No Resume Video</div>
                  )}
                </div>
                <input type="file" accept="video/*" onChange={(e) => handleFileChange(e, 'resumeVideo')} />
                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => uploadFile('resumeVideo')}
                    disabled={resumeVideoUploading}
                    className="px-3 py-2 bg-cyan-700/85 text-white rounded-md disabled:opacity-50"
                  >
                    {resumeVideoUploading ? 'Uploading...' : 'Upload'}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteFile('resumeVideo')}
                    className="px-3 py-2 bg-red-50 text-red-700 rounded-md border border-red-100"
                  >
                    Delete
                  </button>
                </div>
                {resumeVideoMessage && <p className="mt-2 text-sm text-gray-700">{resumeVideoMessage}</p>}
              </div>
            </div>
            {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-cyan-700/85 text-white px-6 py-2 rounded-md hover:bg-cyan-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Details'}
                </button>
              </div>
            </form>
        </div>
       </div>
    </div>
  )
}
export default StudentDetail;