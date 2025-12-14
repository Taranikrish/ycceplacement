import React, { useState, useEffect, useMemo } from 'react'; // Import useMemo
import AdminSidebar from '../components/AdminSidebar.jsx';

function SearchStudent() {
  const [students, setStudents] = useState([]);
  // --- Removed filteredStudents from useState ---
  // const [filteredStudents, setFilteredStudents] = useState([])
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('name'); // 'name' or 'rollNumber'

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

  // --- Removed the imperative filterStudents function ---

  // +++ Added: Calculate filteredStudents using useMemo +++
  // This code now runs automatically whenever students, searchTerm, or searchBy changes.
  const filteredStudents = useMemo(() => {
    // If there's no search term, return the whole list
    if (!searchTerm) {
      return students;
    }

    // Otherwise, run the filter
    return students.filter(student => {
      const term = searchTerm.toLowerCase();
      if (searchBy === 'name') {
        return student.name.toLowerCase().startsWith(term);
      } else if (searchBy === 'rollNumber') {
        return student.rollNumber.toLowerCase().startsWith(term);
      }
      return false;
    });
  }, [students, searchTerm, searchBy]); // Dependencies

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


// import React, { useState, useEffect } from 'react';
// import AdminSidebar from '../components/AdminSidebar.jsx';
// // No dummy data needed, as we're fetching from the backend
// // import { dummyStudents } from '../dummyData.js'

// function SearchStudent() {
//   const [students, setStudents] = useState([]); // Will hold results from backend
//   // No 'filteredStudents' state needed
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchBy, setSearchBy] = useState('name'); // 'name' or 'rollNumber'

//   // This is for the "Get All Students" button
//   const fetchAllStudents = async () => {
//     setLoading(true);
//     setSearchTerm(''); // Clear any active search
//     try {
//       // Using your original backend logic
//       const response = await fetch('http://localhost:5000/api/admin/students', {
//         method: 'GET',
//         headers: {
//           Authorization: `Bearer ${
//             JSON.parse(localStorage.getItem('auth')).token
//           }`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setStudents(data);
//       } else {
//         console.error('Failed to fetch students');
//         setStudents([]); // Clear on error
//       }
//     } catch (error) {
//       console.error('Error fetching students:', error);
//       setStudents([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // This useEffect handles the debounced search-as-you-type
//   useEffect(() => {
//     // If search term is cleared, clear the results
//     if (searchTerm === '') {
//       setStudents([]);
//       return;
//     }

//     // Set loading true when we start typing
//     setLoading(true);

//     // This is the debounce timer
//     const delayDebounceFn = setTimeout(() => {
//       // This is the async function that will run after the delay
//       const searchStudents = async () => {
//         try {
//           // IMPORTANT: You must create this endpoint on your backend
//           // e.g., /api/admin/students/search?name=... or /api/admin/students/search?rollNumber=...
//           const response = await fetch(
//             `http://localhost:5000/api/admin/students/search?${searchBy}=${searchTerm}`,
//             {
//               method: 'GET',
//               headers: {
//                 Authorization: `Bearer ${
//                   JSON.parse(localStorage.getItem('auth')).token
//                 }`,
//                 'Content-Type': 'application/json',
//               },
//             }
//           );

//           if (response.ok) {
//             const data = await response.json();
//             setStudents(data); // Set the results directly from the backend
//           } else {
//             console.error('Failed to search students');
//             setStudents([]);
//           }
//         } catch (error) {
//           console.error('Error searching students:', error);
//           setStudents([]);
//         } finally {
//           setLoading(false); // Set loading false after fetch completes
//         }
//       };

//       searchStudents();
//     }, 500); // 500ms delay

//     // Cleanup function: This runs if the user types again before 500ms
//     return () => clearTimeout(delayDebounceFn);
//   }, [searchTerm, searchBy]); // Re-run this effect if searchTerm or searchBy changes

//   return (
//     <div className="flex h-screen">
//       <AdminSidebar />
//       <div className="flex-1 p-6">
//         <h1 className="text-2xl font-bold mb-6">Search Students</h1>

//         {/* Search Controls */}
//         <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
//           <div className="flex gap-4 items-center">
//             <button
//               onClick={fetchAllStudents}
//               className="bg-amber-800 text-white px-4 py-2 rounded hover:bg-amber-700"
//             >
//               Get All Students
//             </button>

//             <div className="flex items-center gap-2">
//               <label className="text-sm font-medium">Search by:</label>
//               <select
//                 value={searchBy}
//                 onChange={(e) => {
//                   setSearchBy(e.target.value);
//                   // No imperative filtering, useEffect will handle it
//                 }}
//                 className="border px-3 py-1 rounded"
//               >
//                 <option value="name">Name</option>
//                 <option value="rollNumber">Roll Number</option>
//               </select>
//             </div>

//             <input
//               type="text"
//               placeholder={`Search by ${
//                 searchBy === 'name' ? 'name' : 'roll number'
//               }...`}
//               value={searchTerm}
//               onChange={(e) => {
//                 setSearchTerm(e.target.value);
//                 // No imperative filtering, useEffect will handle it
//               }}
//               className="border px-3 py-1 rounded flex-1 max-w-md"
//             />
//           </div>
//         </div>

//         {/* Students List */}
//         {loading ? (
//           <div className="text-center">Loading...</div>
//         ) : (
//           <div className="bg-white rounded-lg shadow-md">
//             <div className="p-4 border-b">
//               <h2 className="text-lg font-semibold">
//                 Students ({students.length})
//               </h2>
//             </div>
//             <div className="max-h-96 overflow-y-auto">
//               {students.length > 0 ? (
//                 <div className="divide-y">
//                   {students.map((student, index) => (
//                     <div key={index} className="p-4 hover:bg-gray-50">
//                       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700">Name</label>
//                           <p className="mt-1">{student.name}</p>
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700">Roll Number</label>
//                           <p className="mt-1">{student.rollNumber}</p>
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700">Branch</label>
//                           <p className="mt-1">{student.branch}</p>
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700">CGPA</label>
//                           <p className="mt-1">{student.cgpa}</p>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="p-8 text-center text-gray-500">
//                   {searchTerm
//                     ? 'No students found matching your search.'
//                     : 'Type to search or click "Get All Students".'}
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default SearchStudent;