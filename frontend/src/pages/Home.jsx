import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGraduationCap,
  faBuilding,
  faShield,
  faArrowTrendUp,
  faUsersLine,
  faChartSimple,
  faEnvelope,
  faPhone,
  faLocationDot,
  faArrowRight,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons'

function Home() {
  const { user } = useSelector((state) => state.auth)

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800 bg-white">
      <Header />
      
      <main className="grow">
        {/* --- HERO SECTION: CLEAN & VIBRANT --- */}
        <section className="relative overflow-hidden bg-white py-16 border-b border-cyan-100">
          <div className="absolute inset-0 z-0">
            <img 
              alt="Campus" 
              className="w-full h-full object-cover opacity-10" 
              src="/cover.webp" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-cyan-50/30"></div>
          </div>

          <div className="relative z-10 container mx-auto px-6">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-bold tracking-widest text-cyan-600 uppercase bg-cyan-50 border border-cyan-100 rounded-lg">
                Official Placement Portal
              </span>
              <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-4 leading-tight">
                Empowering Dreams, <br />
                <span className="text-cyan-600">Launching Careers.</span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-2xl">
                Connecting YCCE's brightest minds with global industry leaders. 
                Your professional journey starts within our proven placement ecosystem.
              </p>
              
              <div className="flex flex-wrap gap-4">
                {user ? (
                  <Link 
                    to={`/${user.role}/dashboard`} 
                    className="flex items-center gap-2 px-8 py-3 text-white bg-cyan-600 hover:bg-cyan-700 font-bold rounded-xl shadow-lg shadow-cyan-200 transition-all hover:-translate-y-0.5"
                  >
                    Go to Dashboard
                    <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                  </Link>
                ) : (
                  <>
                    <Link to="/Signin/student" className="group flex items-center gap-3 px-8 py-3 border-2 border-cyan-600 text-cyan-600 font-bold rounded-xl hover:bg-cyan-600 hover:text-white transition-all">
                      <FontAwesomeIcon icon={faGraduationCap} />
                      Student Login
                    </Link>
                    <Link to="/Signin/company" className="group flex items-center gap-3 px-8 py-3 bg-cyan-50 text-cyan-700 font-bold rounded-xl hover:bg-cyan-100 transition-all border border-cyan-200">
                      <FontAwesomeIcon icon={faBuilding} />
                      Employer Portal
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* --- STATS RIBBON (CYAN THEMED) --- */}
        <section className="relative z-20 -mt-8">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-0 bg-cyan-600 rounded-2xl shadow-xl overflow-hidden border-4 border-white">
              {[
                { label: 'Recruiters', val: '500+' },
                { label: 'Placement %', val: '92%' },
                { label: 'Avg Package', val: '12 LPA' },
                { label: 'Highest Package', val: '32 LPA' },
              ].map((stat, i) => (
                <div key={i} className="py-6 text-center border-r border-cyan-500 last:border-0">
                  <p className="text-3xl font-black text-white">{stat.val}</p>
                  <p className="text-[10px] text-cyan-100 font-bold uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- FEATURES SECTION --- */}
        <section className="py-12 bg-cyan-50/30" id="overview">
          <div className="container mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-slate-900 mb-2">Why Choose YCCE?</h2>
              <div className="h-1 w-12 bg-cyan-600 mx-auto rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: faArrowTrendUp, title: "Training", desc: "Aligning student skills with evolving market demands through workshops." },
                { icon: faUsersLine, title: "Industry Ties", desc: "Active MOUs with top-tier tech giants and engineering firms." },
                { icon: faChartSimple, title: "Assessment", desc: "Continuous mock tests, soft-skill workshops, and coding challenges." }
              ].map((item, idx) => (
                <div key={idx} className="group p-8 bg-white rounded-2xl border border-cyan-100 shadow-sm hover:shadow-md transition-all">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-cyan-50 text-cyan-600 text-lg mb-4 group-hover:bg-cyan-600 group-hover:text-white transition-all">
                    <FontAwesomeIcon icon={item.icon} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- CTA SECTION (CYAN ACCENT) --- */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-6">
            <div className="bg-white border-2 border-cyan-600 rounded-[2rem] overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-1/4 h-full bg-cyan-50 skew-x-12 translate-x-12"></div>
              <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="max-w-xl">
                  <h2 className="text-3xl font-black text-slate-900 mb-3">Placement Statistics</h2>
                  <p className="text-slate-600 mb-6 font-medium">Download our year-wise comprehensive placement reports and statistics.</p>
                  <a 
                    href="https://ycce.edu/placement-details/" 
                    target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 text-white font-bold rounded-xl hover:bg-cyan-700 transition-all"
                  >
                    View Official Reports
                    <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                  </a>
                </div>
                <div className="text-cyan-100 hidden md:block">
                   <FontAwesomeIcon icon={faShield} className="text-[120px] opacity-20" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- CONTACT SECTION (CLEAN CARDS) --- */}
        <section className="py-12 bg-cyan-50/20" id="contact">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-6 items-stretch">
              {/* Contact Card */}
              <div className="p-8 bg-white rounded-3xl border border-cyan-100 shadow-sm">
                <h2 className="text-2xl font-black text-slate-900 mb-6">Connect With Us</h2>
                <div className="grid gap-3">
                  {[
                    { icon: faEnvelope, label: "Email", val: "rdwajgi@ycce.edu", href: "mailto:rdwajgi@ycce.edu" },
                    { icon: faPhone, label: "Phone", val: "+91 9970238062", href: "tel:+919970238062" },
                    { icon: faLocationDot, label: "Campus", val: "YCCE Campus, Nagpur, MH", href: "#" },
                  ].map((c, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-cyan-50 hover:bg-cyan-50/50 transition-colors">
                      <div className="h-10 w-10 rounded-lg bg-cyan-100 flex items-center justify-center text-cyan-600">
                        <FontAwesomeIcon icon={c.icon} />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{c.label}</p>
                        <a href={c.href} className="text-sm font-bold text-slate-800 hover:text-cyan-600">{c.val}</a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coordinator Card */}
              <div className="p-8 bg-cyan-600 rounded-3xl text-white shadow-lg relative overflow-hidden flex flex-col justify-center">
                <FontAwesomeIcon icon={faGraduationCap} className="absolute top-[-20px] right-[-20px] text-9xl text-white/10" />
                <div className="relative z-10">
                  <h3 className="text-cyan-100 font-bold text-xs uppercase tracking-widest mb-2">Dean - T & P</h3>
                  <h2 className="text-4xl font-black mb-1">Dr. Rakhi Wajgi</h2>
                  <p className="text-white/80 font-medium mb-6 italic">Empowering students for industry excellence.</p>
                  
                  <div className="space-y-2 mb-8">
                     <div className="flex items-center gap-3 text-sm font-semibold">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-cyan-200" /> Skill Integration
                     </div>
                     <div className="flex items-center gap-3 text-sm font-semibold">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-cyan-200" /> Global Opportunities
                     </div>
                  </div>

                  <Link to="/contact" className="inline-block px-8 py-3 bg-white text-cyan-700 font-black rounded-xl hover:bg-cyan-50 transition-all">
                    Schedule Meeting
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Home