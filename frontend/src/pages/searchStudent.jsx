import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar.jsx';
import { 
  Search, 
  Users, 
  GraduationCap, 
  Filter, 
  ArrowRight, 
  RefreshCw, 
  IdCard, 
  ChevronLeft, 
  ChevronRight,
  BookOpen,
  MapPin
} from 'lucide-react';

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
  'Computer Science & Engineering': ['Web Development','Mobile Development','Data Science',' Machine Learning','Cybersecurity','Cloud Computing','DevOps','Blockchain','AI/ML','IoT','Software Engineering','Database Management'],
  'Information Technology': ['Web Development','Mobile Development','Data Science','Cybersecurity','Cloud Computing','DevOps','Network Administration','System Administration','Database Management','AI/ML','Blockchain','IoT'],
  'Electronics & Telecommunication': ['Embedded Systems','IoT','Signal Processing','Communication Systems','VLSI Design','Robotics','Control Systems','Wireless Communication','Digital Electronics','Analog Electronics','Telecommunication','Network Security'],
  'Mechanical Engineering': ['CAD/CAM','Robotics','Automotive Engineering','Manufacturing','Thermal Engineering','Fluid Mechanics','Materials Science','Structural Analysis','Mechatronics','Quality Control','Product Design','HVAC Systems'],
  'Civil Engineering': ['Structural Engineering','Geotechnical Engineering','Transportation Engineering','Environmental Engineering','Construction Management','Surveying','Water Resources','Urban Planning','Building Information Modeling','Project Management','Sustainable Design','Infrastructure Development'],
  'Electrical Engineering': ['Power Systems','Control Systems','Electrical Machines','Renewable Energy','Electronics','Instrumentation','Automation','Smart Grids','Embedded Systems','Signal Processing','Electrical Design','Maintenance Engineering']
};

function SearchStudent() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState('name');
  const [searchCriteria, setSearchCriteria] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const debounceRef = useRef(null);

  const fetchAllStudents = async () => {
    setLoading(true);
    try {
      const auth = JSON.parse(localStorage.getItem('auth'));
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/students`, { 
        headers: { Authorization: `Bearer ${auth?.token}` }
      });
      const data = await res.json();
      setStudents(data || []);
    } catch (err) {
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAllStudents(); }, []);

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
      const auth = JSON.parse(localStorage.getItem('auth'));
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/students/search?${params.toString()}`, {
        headers: { Authorization: `Bearer ${auth?.token}` }
      });
      const data = await res.json();
      setStudents(data.students || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { setPage(1); }, [searchCriteria, searchType, selectedBranch]);

  useEffect(() => {
    if (!searchCriteria && searchType !== 'branch') return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { searchStudents(); }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchCriteria, searchType, selectedBranch, page]);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <AdminSidebar />

      <main className="flex-1 flex flex-col min-w-0">
        {/* --- HEADER --- */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 md:px-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Database Explorer</p>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Student Directory</h1>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
            <Users size={18} className="text-cyan-600" />
            <span className="text-xs font-black text-slate-600 uppercase tracking-widest">{students.length} Records</span>
          </div>
        </header>

        <div className="p-6 md:p-10 max-w-7xl w-full mx-auto space-y-8">
          
          {/* --- FILTER CONTROL PANEL --- */}
          <section className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="flex flex-col lg:flex-row gap-4 items-end lg:items-center">
              
              <button
                onClick={fetchAllStudents}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.15em] hover:bg-slate-800 transition-all shadow-lg active:scale-95"
              >
                <RefreshCw size={16} /> Reset Explorer
              </button>

              <div className="h-10 w-[1px] bg-slate-100 hidden lg:block mx-2"></div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
                {/* Search Type Dropdown */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Search By</label>
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <select
                      value={searchType}
                      onChange={e => { setSearchType(e.target.value); setSearchCriteria(''); setSelectedBranch(''); }}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-cyan-500 transition-all appearance-none"
                    >
                      <option value="name">Name</option>
                      <option value="rollNumber">Registration</option>
                      <option value="branch">Branch</option>
                      <option value="domain">Domain</option>
                    </select>
                  </div>
                </div>

                {/* Dynamic Inputs */}
                <div className="md:col-span-2 lg:col-span-3 space-y-1">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Enter Filter Criteria</label>
                   <div className="flex flex-wrap md:flex-nowrap gap-3">
                      {searchType === 'branch' ? (
                        <select
                          value={searchCriteria}
                          onChange={e => setSearchCriteria(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:border-cyan-500 outline-none transition-all"
                        >
                          <option value="" disabled>Select Branch</option>
                          {branches.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                      ) : searchType === 'domain' ? (
                        <>
                          <select
                            value={selectedBranch}
                            onChange={e => { setSelectedBranch(e.target.value); setSearchCriteria(''); }}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:border-cyan-500 outline-none transition-all"
                          >
                            <option value="" disabled>Select Branch</option>
                            {branches.map(b => <option key={b} value={b}>{b}</option>)}
                          </select>
                          <select
                            value={searchCriteria}
                            onChange={e => setSearchCriteria(e.target.value)}
                            disabled={!selectedBranch}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:border-cyan-500 outline-none transition-all disabled:opacity-50"
                          >
                            <option value="" disabled>{selectedBranch ? 'Select Domain' : 'First Pick Branch'}</option>
                            {(selectedBranch ? domainMapping[selectedBranch] || [] : []).map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </>
                      ) : (
                        <div className="relative w-full">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input
                            type="text"
                            placeholder={`Type student ${searchType === 'name' ? 'full name' : 'registration number'}...`}
                            value={searchCriteria}
                            onChange={e => setSearchCriteria(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:border-cyan-500 outline-none transition-all"
                          />
                        </div>
                      )}
                   </div>
                </div>
              </div>
            </div>
          </section>

          {/* --- RESULTS TABLE --- */}
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">Student Identity</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">Academic Info</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">Contact Details</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="py-20 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">Querying Database...</p>
                      </td>
                    </tr>
                  ) : students.length > 0 ? (
                    students.map(s => (
                      <tr key={s._id} className="hover:bg-cyan-50/30 transition-colors group">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-cyan-100">
                              {s.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-800">{s.name}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-1">
                                <IdCard size={10}/> {s.rollNumber}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-1">
                             <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                                <GraduationCap size={14} className="text-cyan-500"/> {s.branch}
                             </span>
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Year of Study</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-xs font-bold text-slate-600 tracking-tight">{s.mobileNumber}</p>
                          <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Active Status</p>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button
                            onClick={() => navigate(`/admin/student/${s._id}`)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-cyan-600 rounded-xl font-black text-[10px] uppercase tracking-widest border border-cyan-100 hover:bg-cyan-600 hover:text-white transition-all shadow-sm group-hover:scale-105"
                          >
                            View Profile <ArrowRight size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-20 text-center">
                        <Users size={40} className="mx-auto text-slate-200 mb-4" />
                        <p className="text-slate-400 font-bold">No student records match your criteria</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* --- PAGINATION --- */}
            {totalPages > 1 && (
              <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Showing Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-cyan-600 disabled:opacity-30 transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setPage(i + 1)}
                      className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${
                        page === i + 1 
                          ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-200' 
                          : 'bg-white border border-slate-200 text-slate-400 hover:border-cyan-300 hover:text-cyan-600'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-cyan-600 disabled:opacity-30 transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default SearchStudent;