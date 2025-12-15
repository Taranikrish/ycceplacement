import React, { useState, useEffect, useMemo } from 'react'; // Import useMemo
import AdminSidebar from '../components/AdminSidebar.jsx';

function SearchStudent() {
  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('name'); 

  const fetchAllStudents = async () => {
    setLoading(true);
    try {
      const auth = JSON.parse(localStorage.getItem('auth'));
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/students`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      } else {
        console.error('Failed to fetch students');
        setStudents([]);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  
  const filteredStudents = useMemo(() => {
    
    if (!searchTerm) {
      return students;
    }

  
    return students.filter(student => {
      const term = searchTerm.toLowerCase();
      if (searchBy === 'name') {
        return student.name.toLowerCase().startsWith(term);
      } else if (searchBy === 'rollNumber') {
        return student.rollNumber.toLowerCase().startsWith(term);
      }
      return false;
    });
  }, [students, searchTerm, searchBy]); 

  useEffect(() => {
    fetchAllStudents();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 p-6 md:ml-0 ml-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Search Students</h1>

        {/* Search Controls */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <button
              onClick={fetchAllStudents}
              className="bg-cyan-700/85 text-white px-4 py-2 rounded hover:bg-cyan-700 w-full md:w-auto"
            >
              Get All Students
            </button>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full md:w-auto">
              <label className="text-sm font-medium">Search by:</label>
              <select
                value={searchBy}
                // --- Simplified: Just set the state ---
                onChange={e => setSearchBy(e.target.value)}
                className="border px-3 py-1 rounded w-full sm:w-auto"
              >
                <option value="name">Name</option>
                <option value="rollNumber">Registration Number</option>
                <option value="name">CSE</option>
                <option value="name">ME</option>
               <option value="name">MBA </option>           
                <option value="name">ETC</option>
                <option value="name">CIVIL</option>
              </select>
            </div>

            <input
              type="text"
              placeholder={`Search by ${
                searchBy === 'name' ? 'name' : 'roll number'
              }...`}
              value={searchTerm}
              // --- Simplified: Just set the state ---
              onChange={e => setSearchTerm(e.target.value)}
              className="border px-3 py-1 rounded flex-1 w-full md:max-w-md"
            />
          </div>
        </div>

        {/* Students List (No changes needed here) */}
        {loading ? (
          <div className="text-center">Loading students...</div>
        ) : (
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">
                Students ({filteredStudents.length})
              </h2>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {filteredStudents.length > 0 ? (
                <div className="divide-y">
                  {filteredStudents.map((student, index) => (
                    <div key={index} className="p-4 hover:bg-gray-50 cursor-pointer" onClick={() => window.location.href = `/admin/student/${student._id}`}>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Name</label>
                          <p className="mt-1">{student.name}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Roll Number</label>
                          <p className="mt-1">{student.rollNumber}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Branch</label>
                          <p className="mt-1">{student.branch || 'Not specified'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                          <p className="mt-1">{student.mobileNumber }</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  {students.length > 0 && searchTerm
                    ? 'No students found matching your search.'
                    : students.length === 0 && !loading
                    ? 'There are no students.'
                    : 'Click "Get All Students" to load data.'}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchStudent;

