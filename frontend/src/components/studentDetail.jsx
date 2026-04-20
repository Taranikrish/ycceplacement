import React, { useState, useEffect } from 'react'
import { 
  User, MapPin, Phone, GraduationCap, Briefcase, 
  Camera, FileText, Video, Save, Trash2, Plus, 
  CheckCircle, AlertCircle, Info, Hash
} from 'lucide-react'
import { FileVideoCamera } from 'lucide-react';

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
    
    // Media States
    const [profileFile, setProfileFile] = useState(null)
    const [profilePreview, setProfilePreview] = useState(null)
    const [profileUploading, setProfileUploading] = useState(false)
    const [profileMessage, setProfileMessage] = useState('')
    const [resumePdfPreview, setResumePdfPreview] = useState(null)
    const [resumePdfFile, setResumePdfFile] = useState(null)
    const [resumePdfUploading, setResumePdfUploading] = useState(false)
    const [resumePdfMessage, setResumePdfMessage] = useState('')

    const [resumeVideoFile, setResumeVideoFile] = useState(null)
    const [resumeVideoPreview, setResumeVideoPreview] = useState(null)
    const [resumeVideoUploading, setResumeVideoUploading] = useState(false)
    const [resumeVideoMessage, setResumeVideoMessage] = useState('')

    const fetchStudentProfile = async () => {
        try {
            setLoading(true)
            const auth = JSON.parse(localStorage.getItem('auth'))
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/student/profile`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth?.token}`,
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
            }
        } catch (error) {
            setError('Error fetching student profile')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchStudentProfile() }, [])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSgpaChange = (index, value) => {
        const newSgpa = [...formData.sgpa]
        newSgpa[index] = value
        setFormData(prev => ({ ...prev, sgpa: newSgpa }))
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
        setSaving(true); setError(''); setSuccess('');
        try {
            const auth = JSON.parse(localStorage.getItem('auth'))
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/student/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth?.token}` },
                body: JSON.stringify({
                    ...formData,
                    sgpa: formData.sgpa.map(s => s ? parseFloat(s) : 0)
                })
            })
            if (response.ok) {
                setSuccess('Full profile details updated successfully!')
                window.scrollTo({ top: 0, behavior: 'smooth' })
            } else {
                setError('Failed to save details. Please check all fields.')
            }
        } catch (error) { setError('Server error. Try again later.') }
        finally { setSaving(false) }
    }

    const branches = [
        'Computer Science & Engineering', 'Information Technology', 'Electronics & Telecommunication',
        'Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering'
    ]

    const domainMapping = {
        'Computer Science & Engineering': ['Web Development', 'Mobile Development', 'Data Science', 'Machine Learning', 'Cybersecurity', 'Cloud Computing', 'DevOps', 'Blockchain', 'AI/ML', 'IoT', 'Software Engineering', 'Database Management'],
        'Information Technology': ['Web Development', 'Mobile Development', 'Data Science', 'Cybersecurity', 'Cloud Computing', 'DevOps', 'Network Administration', 'System Administration', 'Database Management', 'AI/ML', 'Blockchain', 'IoT'],
        'Electronics & Telecommunication': ['Embedded Systems', 'IoT', 'Signal Processing', 'Communication Systems', 'VLSI Design', 'Robotics', 'Control Systems', 'Wireless Communication', 'Digital Electronics', 'Analog Electronics', 'Telecommunication', 'Network Security'],
        'Mechanical Engineering': ['CAD/CAM', 'Robotics', 'Automotive Engineering', 'Manufacturing', 'Thermal Engineering', 'Fluid Mechanics', 'Materials Science', 'Structural Analysis', 'Mechatronics', 'Quality Control', 'Product Design', 'HVAC Systems'],
        'Civil Engineering': ['Structural Engineering', 'Geotechnical Engineering', 'Transportation Engineering', 'Environmental Engineering', 'Construction Management', 'Surveying', 'Water Resources', 'Urban Planning', 'Building Information Modeling', 'Project Management', 'Sustainable Design', 'Infrastructure Development'],
        'Electrical Engineering': ['Power Systems', 'Control Systems', 'Electrical Machines', 'Renewable Energy', 'Electronics', 'Instrumentation', 'Automation', 'Smart Grids', 'Embedded Systems', 'Signal Processing', 'Electrical Design', 'Maintenance Engineering']
    }

    useEffect(() => {
        setAvailableDomains(formData.branch ? domainMapping[formData.branch] || [] : [])
    }, [formData.branch])

    const handleFileChange = (e, type) => {
        const file = e.target.files[0]
        if (!file) return
        if (type === 'profile') {
            setProfileFile(file); setProfilePreview(URL.createObjectURL(file))
        } else if (type === 'resumePdf') {
            setResumePdfFile(file)
            setResumePdfPreview(URL.createObjectURL(file))
        } else if (type === 'resumeVideo') {
            setResumeVideoFile(file); setResumeVideoPreview(URL.createObjectURL(file))
        }
    }

    const uploadFile = async (type) => {
        let endpoint = '', fileToUpload = null, setUploading, setMessage;
        if (type === 'profile') { endpoint = '/api/student/profile/photo'; fileToUpload = profileFile; setUploading = setProfileUploading; setMessage = setProfileMessage; }
        else if (type === 'resumePdf') { endpoint = '/api/student/profile/resume-pdf'; fileToUpload = resumePdfFile; setUploading = setResumePdfUploading; setMessage = setResumePdfMessage; }
        else if (type === 'resumeVideo') { endpoint = '/api/student/profile/resume-video'; fileToUpload = resumeVideoFile; setUploading = setResumeVideoUploading; setMessage = setResumeVideoMessage; }
        
        if (!fileToUpload) return;
        try {
            setUploading(true); setMessage('Uploading...');
            const form = new FormData()
            form.append(type === 'profile' ? 'profilePhoto' : type, fileToUpload)
            const auth = JSON.parse(localStorage.getItem('auth'))
            const resp = await fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${auth?.token}` },
                body: form,
            })
            if (resp.ok) {
                setMessage('Successfully uploaded!');
                fetchStudentProfile();
            } else setMessage('Upload failed.')
        } catch (err) { setMessage('Error uploading.') }
        finally { setUploading(false) }
    }

    const deleteFile = async (type) => {
        let endpoint = '';
        if (type === 'profile') endpoint = '/api/student/profile/photo';
        if (type === 'resumePdf') endpoint = '/api/student/profile/resume-pdf';
        if (type === 'resumeVideo') endpoint = '/api/student/profile/resume-video';
        try {
            const auth = JSON.parse(localStorage.getItem('auth'))
            await fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${auth?.token}` },
            })
            fetchStudentProfile()
        } catch (err) { console.error(err) }
    }

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
        </div>
    )

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4">
            <div className="max-w-4xl mx-auto">
                
                {/* --- HEADER --- */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Academic Profile</h1>
                        <p className="text-slate-500 font-medium">Complete your registration for campus placements.</p>
                    </div>
                    <div className="hidden md:block">
                        <div className="bg-white px-4 py-2 rounded-2xl border border-cyan-100 shadow-sm">
                            <p className="text-[10px] font-black text-cyan-600 uppercase tracking-widest">Calculated CGPA</p>
                            <p className="text-2xl font-black text-slate-900">{calculateCgpa()}</p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-center gap-3">
                        <AlertCircle className="text-red-500" size={20} />
                        <p className="text-red-700 font-bold text-sm">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-xl flex items-center gap-3 animate-pulse">
                        <CheckCircle className="text-green-500" size={20} />
                        <p className="text-green-700 font-bold text-sm">{success}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    
                    {/* SECTION 1: Academic & Basic Info */}
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
                            <GraduationCap className="text-cyan-600" />
                            <h2 className="text-xl font-black text-slate-900">Academic & Contact</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Engineering Branch</label>
                                <select 
                                    name="branch" value={formData.branch} onChange={handleInputChange} required
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all font-bold text-slate-700"
                                >
                                    <option value="">Select Branch</option>
                                    {branches.map((b, i) => <option key={i} value={b}>{b}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Mobile Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-3.5 text-slate-400" size={18} />
                                    <input 
                                        type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all font-bold text-slate-700"
                                        placeholder="Enter mobile number"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Semester Performance (SGPA)</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                                {[1, 2, 3, 4, 5, 6].map((sem) => (
                                    <div key={sem} className="relative group">
                                        <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-black text-cyan-600 uppercase tracking-tighter z-10">Sem {sem}</span>
                                        <input 
                                            type="number" step="0.01" value={formData.sgpa[sem-1]} onChange={(e) => handleSgpaChange(sem-1, e.target.value)}
                                            className="w-full pt-4 pb-2 px-3 rounded-xl border border-slate-200 text-center font-black text-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                                            placeholder="0.00"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: Professional Interests */}
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
                            <Briefcase className="text-cyan-600" />
                            <h2 className="text-xl font-black text-slate-900">Career Domains</h2>
                        </div>
                        
                        <p className="text-sm font-medium text-slate-500 mb-6 flex items-center gap-2">
                            <Info size={14} className="text-cyan-600" />
                            Select your specialized fields of interest.
                        </p>

                        <div className="flex flex-wrap gap-2 mb-8 min-h-[50px] p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            {formData.domain.length > 0 ? formData.domain.map((d, i) => (
                                <span key={i} className="flex items-center gap-2 px-3 py-1.5 bg-cyan-600 text-white rounded-lg text-xs font-bold shadow-lg shadow-cyan-900/20">
                                    {d} <button type="button" onClick={() => handleDomainChange(d)} className="hover:text-red-200 transition-colors"><Trash2 size={12} /></button>
                                </span>
                            )) : <p className="text-xs text-slate-400 italic">No domains selected yet...</p>}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8">
                            {availableDomains.map((d, i) => (
                                <button 
                                    key={i} type="button" onClick={() => handleDomainChange(d)}
                                    className={`text-left px-3 py-2 rounded-xl text-xs font-bold transition-all border ${formData.domain.includes(d) ? 'bg-cyan-50 border-cyan-400 text-cyan-700' : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'}`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <input 
                                type="text" value={customDomain} onChange={(e) => setCustomDomain(e.target.value)}
                                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white transition-all text-sm font-bold"
                                placeholder="Add custom skill (e.g. Flutter, AWS)"
                            />
                            <button 
                                type="button" onClick={() => { if(customDomain) { handleDomainChange(customDomain); setCustomDomain('') } }}
                                className="bg-slate-900 text-white p-2 rounded-xl hover:bg-cyan-600 transition-colors"
                            >
                                <Plus />
                            </button>
                        </div>
                    </div>

                    {/* SECTION 3: Documents & Media */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <UploadCard
                            title="Photo"
                            icon={<Camera className="w-6 h-6 text-gray-600" />}
                            type="profile"
                            preview={profilePreview || studentProfile?.profilePhoto}
                            onFileChange={handleFileChange}
                            onUpload={uploadFile}
                            onDelete={deleteFile}
                            uploading={profileUploading}
                            message={profileMessage}
                        />

                        <UploadCard
                            title="Resume PDF"
                            icon={<FileText className="w-6 h-6 text-gray-600" />}
                            type="resumePdf"
                            isPdf
                            preview={resumePdfPreview || studentProfile?.resumePdf}
                            onFileChange={handleFileChange}
                            onUpload={uploadFile}
                            onDelete={deleteFile}
                            uploading={resumePdfUploading}
                            message={resumePdfMessage}
                        />
                        <UploadCard
                            title="Video Pitch"
                            icon={<Video className="w-6 h-6 text-gray-600" />}
                            type="resumeVideo"
                            preview={resumeVideoPreview || studentProfile?.resumeVideo}
                            isVideo
                            onFileChange={handleFileChange}
                            onUpload={uploadFile}
                            onDelete={deleteFile}
                            uploading={resumeVideoUploading}
                            message={resumeVideoMessage}
                        />
                    </div>


                    {/* SECTION 4: Address */}
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4 text-slate-900">
                            <MapPin className="text-cyan-600" />
                            <h2 className="text-xl font-black">Residence Information</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Street Address</label>
                                <input 
                                    type="text" name="address" value={formData.address} onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white transition-all font-bold text-slate-700"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <AddressInput label="City" name="city" val={formData.city} handler={handleInputChange} />
                                <AddressInput label="State" name="state" val={formData.state} handler={handleInputChange} />
                                <AddressInput label="PIN" name="pin" val={formData.pin} handler={handleInputChange} />
                            </div>
                        </div>
                    </div>

                    {/* SUBMIT */}
                    <div className="sticky bottom-8 z-10 flex justify-end">
                        <button 
                            type="submit" disabled={saving}
                            className="group flex items-center gap-3 px-10 py-4 bg-cyan-600 text-white font-black rounded-2xl shadow-2xl shadow-cyan-900/40 hover:bg-cyan-500 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : <>Update Complete Profile <Save size={20} /></>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

/* --- REUSABLE COMPONENTS --- */

const AddressInput = ({ label, name, val, handler }) => (
    <div>
        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{label}</label>
        <input 
            type="text" name={name} value={val} onChange={handler}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white transition-all font-bold text-slate-700"
        />
    </div>
)

const UploadCard = ({ title, icon, type, preview, isPdf, isVideo, onFileChange, onUpload, onDelete, uploading, message }) => (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center">
        <div className="flex items-center gap-2 mb-4 w-full justify-center">
            {React.cloneElement(icon, { size: 16, className: "text-cyan-600" })}
            <h3 className="font-black text-slate-900 text-sm uppercase tracking-tighter">{title}</h3>
        </div>
        
        <div className="w-full aspect-square rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 mb-4 overflow-hidden flex items-center justify-center relative group">
        {isPdf && preview ? (
            <iframe
                src={preview}
                title="PDF Preview"
                className="w-full h-full rounded-xl"
            />
        ) : isPdf ? (
            <div className="text-center">
                <FileText className="mx-auto text-cyan-600 mb-2" size={48} />
                <p className="text-[10px] font-black text-cyan-700 uppercase">
                    PDF Uploaded
                </p>
            </div>
        ) : isVideo && preview ? (
            <video src={preview} className="w-full h-full object-cover" />
        ) : preview ? (
            <img
                src={preview}
                alt="preview"
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
            />
        ) : (
            <div className="text-slate-300 flex flex-col items-center gap-2">
                {React.cloneElement(icon, { size: 32 })}
                <p className="text-[10px] font-bold">NO FILE</p>
            </div>
        )}
            
            <label className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <input type="file" className="hidden" onChange={(e) => onFileChange(e, type)} />
                <span className="text-white text-xs font-black uppercase tracking-widest bg-cyan-600 px-4 py-2 rounded-lg">Browse</span>
            </label>
        </div>

        <div className="flex w-full gap-2 mt-auto">
            <button 
                type="button" onClick={() => onUpload(type)} disabled={uploading}
                className="flex-1 py-2 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-cyan-600 transition-colors disabled:opacity-50"
            >
                {uploading ? '...' : 'UPLOAD'}
            </button>
            <button 
                type="button" onClick={() => onDelete(type)}
                className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors border border-slate-100"
            >
                <Trash2 size={16} />
            </button>
        </div>
        {message && <p className="text-[10px] font-bold mt-2 text-cyan-600 text-center leading-tight uppercase">{message}</p>}
    </div>
)

export default StudentDetail