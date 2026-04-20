import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function EditProfile() {
  const navigate = useNavigate()
  const [editForm, setEditForm] = useState({
    phoneNumber: '',
    location: '',
    contactPerson: '',
    linkedInUrl: '',
    dpiitNumber: ''
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        const auth = JSON.parse(localStorage.getItem('auth'))
      
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/company/profile`, {
          
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth?.token}`,
          },
        })
        if (response.ok) {
          const profile = await response.json()
          setEditForm({
            phoneNumber: profile.phoneNumber || '',
            location: profile.location || '',
            contactPerson: profile.contactPerson || '',
            linkedInUrl: profile.linkedInUrl || '',
            dpiitNumber: profile.dpiitNumber || ''
          })
        }
      } catch (err) {
        console.error('Error fetching profile:', err)
      }
    }
    fetchCompanyProfile()
  }, [])

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const auth = JSON.parse(localStorage.getItem('auth'))
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/company/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth?.token}`,
        },
        body: JSON.stringify(editForm)
      })

      if (response.ok) {
        const data = await response.json()
        setSuccess('Profile updated successfully!')
        setTimeout(() => navigate('/'), 3000)
      } else {
        const errorData = await response.json().catch(() => ({}))
        setError(errorData.message || 'Failed to update profile')
      }
    } catch (err) {
      console.error('Error updating profile:', err)
      setError('Error updating profile')
    } finally {
      setSaving(false)
    }
  }
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
            onClick={() => navigate('/company/dashboard')}
            className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditProfile
