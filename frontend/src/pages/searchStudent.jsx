import React, { useState, useEffect, useRef } from 'react';
import AdminSidebar from '../components/AdminSidebar.jsx';

/* ===================== CONSTANT DATA ===================== */
const branches = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Telecommunication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering'
];

const domainMapping = {
  'Computer Science & Engineering': [
    'Web Development','Mobile Development','Data Science','Machine Learning',
    'Cybersecurity','Cloud Computing','DevOps','Blockchain','AI/ML','IoT',
    'Software Engineering','Database Management'
  ],
  'Information Technology': [
    'Web Development','Mobile Development','Data Science','Cybersecurity',
    'Cloud Computing','DevOps','Network Administration','System Administration',
    'Database Management','AI/ML','Blockchain','IoT'
  ],
  'Electronics & Telecommunication': [
    'Embedded Systems','IoT','Signal Processing','Communication Systems',
    'VLSI Design','Robotics','Control Systems','Wireless Communication',
    'Digital Electronics','Analog Electronics','Telecommunication','Network Security'
  ],
  'Mechanical Engineering': [
    'CAD/CAM','Robotics','Automotive Engineering','Manufacturing',
    'Thermal Engineering','Fluid Mechanics','Materials Science','Structural Analysis',
    'Mechatronics','Quality Control','Product Design','HVAC Systems'
  ],
  'Civil Engineering': [
    'Structural Engineering','Geotechnical Engineering','Transportation Engineering',
    'Environmental Engineering','Construction Management','Surveying','Water Resources',
    'Urban Planning','Building Information Modeling','Project Management',
    'Sustainable Design','Infrastructure Development'
  ],
  'Electrical Engineering': [
    'Power Systems','Control Systems','Electrical Machines','Renewable Energy',
    'Electronics','Instrumentation','Automation','Smart Grids','Embedded Systems',
    'Signal Processing','Electrical Design','Maintenance Engineering'
  ]
};

/* ===================== COMPONENT ===================== */
function SearchStudent() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchType, setSearchType] = useState('name');
  const [searchCriteria, setSearchCriteria] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const debounceRef = useRef(null);

  /* ===================== FETCH ALL ===================== */
  const fetchAllStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/students`,
        { credentials: 'include' }
      );
      const data = await res.json();
      setStudents(data || []);
    } catch (err) {
      console.error(err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllStudents();
  }, []);

  /* ===================== SEARCH FUNCTION ===================== */
  const searchStudents = async () => {
    setLoading(true);

    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', 10);

    if (searchType === 'name') params.append('name', searchCriteria);
    if (searchType === 'rollNumber') params.append('rollNumber', searchCriteria);
    if (searchType === 'branch') params.append('branch', searchCriteria);
    if (searchType === 'domain') {
      params.append('domain', searchCriteria);
      if (selectedBranch) params.append('branch', selectedBranch);
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/students/search?${params.toString()}`,
        { credentials: 'include' }
      );
      const data = await res.json();
      setStudents(data.students || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error(err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  /* ===================== RESET PAGE ON FILTER CHANGE ===================== */
  useEffect(() => {
    setPage(1);
  }, [searchCriteria, searchType, selectedBranch]);

  /* ===================== DEBOUNCE SEARCH ===================== */
  useEffect(() => {
    if (!searchCriteria && searchType !== 'branch') return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      searchStudents();
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchCriteria, searchType, selectedBranch, page]);

  /* ===================== HANDLERS ===================== */
  const handleSearchTypeChange = e => {
    setSearchType(e.target.value);
    setSearchCriteria('');
    setSelectedBranch('');
    setStudents([]);
  };

  const renderSearchInput = () => {
    if (searchType === 'branch') {
      return (
        <select
          value={searchCriteria}
          onChange={e => setSearchCriteria(e.target.value)}
          className="border px-3 py-1 rounded"
        >
          <option value="" disabled>Select Branch</option>
          {branches.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      );
    }

    if (searchType === 'domain') {
      const domains = selectedBranch ? domainMapping[selectedBranch] || [] : [];

      return (
        <>
          <select
            value={selectedBranch}
            onChange={e => {
              setSelectedBranch(e.target.value);
              setSearchCriteria('');
            }}
            className="border px-3 py-1 rounded"
          >
            <option value="" disabled>Select Branch</option>
            {branches.map(b => <option key={b} value={b}>{b}</option>)}
          </select>

          <select
            value={searchCriteria}
            onChange={e => setSearchCriteria(e.target.value)}
            disabled={!selectedBranch}
            className="border px-3 py-1 rounded"
          >
            <option value="" disabled>
              {selectedBranch ? 'Select Domain' : 'Select Branch First'}
            </option>
            {domains.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </>
      );
    }

    return (
      <input
        type="text"
        placeholder={`Search by ${searchType === 'name' ? 'name' : 'registration number'}...`}
        value={searchCriteria}
        onChange={e => setSearchCriteria(e.target.value)}
        className="border px-3 py-1 rounded w-full md:max-w-md"
      />
    );
  };

  /* ===================== PAGINATION UI ===================== */
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pages = [];
    for (let i = 1; i <= totalPages; i++) pages.push(i);

    return (
      <div className="flex gap-2 mt-4 justify-center">
        {pages.map(p => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`px-3 py-1 rounded ${p === page ? 'bg-cyan-700 text-white' : 'bg-gray-200'}`}
          >
            {p}
          </button>
        ))}
      </div>
    );
  };

  /* ===================== UI ===================== */
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-8">Search Students</h1>

        <div className="mb-6 bg-white p-4 rounded shadow">
          <div className="flex flex-wrap gap-4 items-center">
            <button
              onClick={fetchAllStudents}
              className="bg-cyan-700 text-white px-4 py-2 rounded"
            >
              Get All Students
            </button>

            <select
              value={searchType}
              onChange={handleSearchTypeChange}
              className="border px-3 py-1 rounded"
            >
              <option value="name">Name</option>
              <option value="rollNumber">Registration Number</option>
              <option value="branch">Branch</option>
              <option value="domain">Domain</option>
            </select>

            {renderSearchInput()}
          </div>
        </div>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="bg-white rounded shadow">
            <div className="p-4 border-b font-semibold">
              Students ({students.length})
            </div>

            {students.length ? (
              students.map(s => (
                <div
                  key={s._id}
                  className="p-4 border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => window.location.href = `/admin/student/${s._id}`}
                >
                  <div className="grid md:grid-cols-4 gap-4">
                    <p>{s.name}</p>
                    <p>{s.rollNumber}</p>
                    <p>{s.branch}</p>
                    <p>{s.mobileNumber}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="p-6 text-center text-gray-500">No students found</p>
            )}

            {renderPagination()}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchStudent;
