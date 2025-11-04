
import './App.css'
import { Routes, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Header from './components/Header.jsx'
import Home from './pages/Home.jsx'
import Singin from './pages/Singin.jsx'
import AdminDashboard from './components/AdminDashboard.jsx'
import SearchStudent from './pages/SearchStudent.jsx'
import AdminStudentView from './components/AdminStudentView.jsx'
import CompanySearch from './pages/CompanySearch.jsx'
import CompanyDashboard from './components/CompanyDashboard.jsx'
import StudentDashboard from './components/StudentDashboard.jsx'
import StudentJobs from './pages/StudentJobs.jsx'
import Jobs from './pages/Jobs.jsx'

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useSelector((state) => state.auth)

  if (!user) {
    return <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h2 className="text-xl font-bold text-red-600 mb-4">Access Denied</h2>
        <p className="text-gray-600">Please login to access this page.</p>
      </div>
    </div>
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h2 className="text-xl font-bold text-red-600 mb-4">Access Denied</h2>
        <p className="text-gray-600">You don't have permission to access this page.</p>
      </div>
    </div>
  }

  return children
}

function App() {
  const { user } = useSelector((state) => state.auth)

  return (
    <>
      <div className='h-screen w-screen'>
        {user && <Header />}
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/Signin/:role' element={<Singin />} />
          <Route path='/admin' element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path='/admin/students' element={
            <ProtectedRoute allowedRoles={['admin']}>
              <SearchStudent />
            </ProtectedRoute>
          } />
          <Route path='/admin/student/:studentId' element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminStudentView />
            </ProtectedRoute>
          } />
          <Route path='/admin/companies' element={
            <ProtectedRoute allowedRoles={['admin']}>
              <CompanySearch />
            </ProtectedRoute>
          } />
          <Route path='/company/dashboard' element={
            <ProtectedRoute allowedRoles={['company', 'admin']}>
              <CompanyDashboard />
            </ProtectedRoute>
          } />
          <Route path='/company/jobs' element={
            <ProtectedRoute allowedRoles={['company']}>
              <Jobs />
            </ProtectedRoute>
          } />
          <Route path='/jobs' element={
            <ProtectedRoute allowedRoles={['student']}>
              <Jobs />
            </ProtectedRoute>
          } />
          <Route path='/student/dashboard' element={
            <ProtectedRoute allowedRoles={['student', 'admin', 'company']}>
              <StudentDashboard />
            </ProtectedRoute>
          } />
          <Route path='/student/jobs' element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentJobs />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </>
  )
}

export default App
