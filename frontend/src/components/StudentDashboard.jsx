import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useSearchParams, Outlet } from 'react-router-dom'
import StudentJobs from '../pages/StudentJobs'
import StudentSidebar from './StudentSidebar'

function StudentDashboard() {
  const { user } = useSelector((state) => state.auth)
  const studentId = user?._id || user?.id


  return (
    <div className="min-h-screen bg-gray-50 flex">
      <StudentSidebar detail={{user,studentId}} />
      <div className="flex-1">
        <Outlet />
      </div>
      </div>
  )
}

export default StudentDashboard
