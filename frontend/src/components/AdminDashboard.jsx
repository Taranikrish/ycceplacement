import React, { useState, useEffect } from 'react'
import AdminSidebar from './AdminSidebar.jsx'

function AdminDashboard() {
  const [adminProfile, setAdminProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/profile`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        if (response.ok) {
          const data = await response.json()
          setAdminProfile(data)
        } else {
          console.error('Failed to fetch admin profile')
        }
      } catch (error) {
        console.error('Error fetching admin profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAdminProfile()
  }, [])

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Profile</h1>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : adminProfile ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-lg">{adminProfile.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-lg">{adminProfile.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <p className="mt-1 text-lg capitalize">{adminProfile.role}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <p className="mt-1 text-lg">{adminProfile.department}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-red-500">Failed to load admin profile</div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
