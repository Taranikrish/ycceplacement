import React, { useState, useEffect } from 'react'
import AdminSidebar from '../components/AdminSidebar.jsx'

function CompanySearch() {
  const [companies, setCompanies] = useState([])
  const [filteredCompanies, setFilteredCompanies] = useState([])
  const [loading, setLoading] = useState(false)
  const [filterBy, setFilterBy] = useState('all') // 'all', 'verified', 'unverified'
  const [verifying, setVerifying] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const fetchAllCompanies = async () => {
    setLoading(true)
    try {
      const auth = JSON.parse(localStorage.getItem('auth'))
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/companies`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        const data = await response.json()
        setCompanies(data)
        filterCompanies(data)
      } else {
        console.error('Failed to fetch companies')
        setCompanies([])
        setFilteredCompanies([])
      }
    } catch (error) {
      console.error('Error fetching companies:', error)
      setCompanies([])
      setFilteredCompanies([])
    } finally {
      setLoading(false)
    }
  }

  const filterCompanies = (companiesList = companies) => {
    if (filterBy === 'all') {
      setFilteredCompanies(companiesList)
    } else if (filterBy === 'verified') {
      setFilteredCompanies(companiesList.filter(company => company.isVerified))
    } else if (filterBy === 'unverified') {
      setFilteredCompanies(companiesList.filter(company => !company.isVerified))
    }
  }

  const handleVerifyCompany = async (companyId, currentStatus) => {
    const newStatus = currentStatus ? 'unverified' : 'verified'
    if (!window.confirm(`Are you sure you want to mark this company as ${newStatus}? ${!currentStatus ? 'This will allow them to post jobs.' : 'This will remove all their jobs and applications.'}`)) {
      return
    }

    setVerifying(companyId)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/companies/${companyId}/verify`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        const result = await response.json()
        // Update the company in the list
        setCompanies(prev => prev.map(company =>
          company._id === companyId
            ? { ...company, isVerified: !currentStatus }
            : company
        ))
        filterCompanies()
        alert(result.message)
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to update company status')
      }
    } catch (error) {
      console.error('Error updating company status:', error)
      alert('Error updating company status')
    } finally {
      setVerifying(null)
    }
  }

  const handleDeleteCompany = async (companyId, companyName) => {
    if (!window.confirm(`Are you sure you want to delete ${companyName}? This will permanently remove the company and all associated jobs and applications.`)) {
      return
    }

    setDeleting(companyId)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/companies/${companyId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const result = await response.json()
        // Remove the company from the list
        setCompanies(prev => prev.filter(company => company._id !== companyId))
        filterCompanies()
        alert(result.message)
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to delete company')
      }
    } catch (error) {
      console.error('Error deleting company:', error)
      alert('Error deleting company')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 p-6 md:ml-0 ml-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Company Search</h1>

        {/* Filter Controls */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
          <div className="flex gap-4 items-center">
            <button
              onClick={fetchAllCompanies}
              className="bg-cyan-700/85 text-white px-4 py-2 rounded hover:bg-cyan-700"
            >
              Get All Companies
            </button>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Filter by:</label>
              <select
                value={filterBy}
                onChange={(e) => {
                  setFilterBy(e.target.value)
                  if (companies.length > 0) {
                    filterCompanies()
                  }
                }}
                className="border px-3 py-1 rounded"
              >
                <option value="all">All Companies</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
              </select>
            </div>
          </div>
        </div>

        {/* Companies List */}
        {loading ? (
          <div className="text-center">Loading companies...</div>
        ) : (
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">
                Companies ({filteredCompanies.length})
              </h2>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {filteredCompanies.length > 0 ? (
                <div className="divide-y">
                  {filteredCompanies.map((company, index) => (
                    <div key={index} className="p-4 hover:bg-gray-50 cursor-pointer" onClick={() => window.location.href = `/company/dashboard?companyId=${company._id}`}>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Company Name</label>
                          <p className="mt-1">{company.name}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Email</label>
                          <p className="mt-1">{company.emailId}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Status</label>
                          <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                            company.isVerified
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {company.isVerified ? 'Verified' : 'Unverified'}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Location</label>
                          <p className="mt-1 text-sm text-gray-600">{company.location}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Contact Person</label>
                          <p className="mt-1 text-sm text-gray-600">{company.contactPerson}</p>
                        </div>
                        <div className="mt-4 flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVerifyCompany(company._id, company.isVerified);
                          }}
                          disabled={verifying === company._id}
                          className={`px-3 py-1 text-xs font-medium rounded ${
                            company.isVerified
                              ? 'bg-red-100 text-red-800 hover:bg-red-200'
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          } disabled:opacity-50`}
                        >
                          {verifying === company._id ? 'Processing...' : (company.isVerified ? 'Unverify' : 'Verify')}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCompany(company._id, company.name);
                          }}
                          disabled={deleting === company._id}
                          className="px-3 py-1 text-xs font-medium rounded bg-red-100 text-red-800 hover:bg-red-200 disabled:opacity-50"
                        >
                          {deleting === company._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                      </div>
                      
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No companies found for the selected filter.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CompanySearch