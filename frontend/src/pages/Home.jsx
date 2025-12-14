import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faGraduationCap ,faBuilding,faShield,faArrowTrendUp,faUsersLine,faChartSimple} from '@fortawesome/free-solid-svg-icons'

function Home() {
  const { user } = useSelector((state) => state.auth)

  return (
    <div className="min-h-screen flex flex-col font-display  text-slate-700">
      <Header />
      <main className="grow">
        <section className="relative">
          <div className="absolute inset-0">
            <img alt="A modern college campus building" className="w-full h-full object-cover opacity-10 " src="/cover.webp" />
            <div className="absolute inset-0 bg-linear-to-t from-background-light via-background-light/80 to-transparent dark:from-background-dark dark:via-background-dark/80"></div>
          </div>
          <div className="relative container mx-auto px-6 py-24 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900  mb-4 leading-tight">Your Future Starts Here</h1>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-8">Connecting talented students with leading companies. Explore opportunities and launch your career with YCCE's Placement Cell.</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              {user ? (
                <>
                  {user.role === 'student' && (
                    <Link to={'/student/dashboard'} className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3   text-white bg-cyan-700/85 font-semibold rounded-md shadow-lg  transition-all transform hover:scale-105">
                        <FontAwesomeIcon icon={faGraduationCap} />
                      Student Dashboard
                    </Link>
                  )}
                  {user.role === 'company' && (
                    <Link to={'/company/dashboard'} className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3   text-white bg-cyan-700/85 font-semibold rounded-md shadow-lg  transition-all transform hover:scale-105">
                        <FontAwesomeIcon icon={faBuilding} />  
                      Company Dashboard
                    </Link>
                  )}
                  {user.role === 'admin' && (
                    <Link to={'/admin'} className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3   text-white bg-cyan-700/85 font-semibold rounded-md shadow-lg  transition-all transform hover:scale-105">
                        <FontAwesomeIcon icon={faShield} />
                      Admin Dashboard
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <Link to={'/Signin/student'} className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3  text-white bg-cyan-700/85 font-semibold rounded-md shadow-lg  transition-all transform hover:scale-105">
                    <FontAwesomeIcon icon={faGraduationCap} />

                    Student Login
                  </Link>
                  <Link to={'/Signin/company'} className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3  text-white bg-cyan-700/85  font-semibold rounded-md shadow-lg transition-all transform hover:scale-105">
                    <FontAwesomeIcon icon={faBuilding} />
                    Company Login
                  </Link>
                  <Link to={'/Signin/admin'} className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3  text-white bg-cyan-700/85  font-semibold rounded-md shadow-lg  transition-all transform hover:scale-105">
                    <FontAwesomeIcon icon={faShield} />
                    Admin Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>
        <section className="py-20 bg-slate-100 " id="overview">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 ">About Our Placement Cell</h2>
              <p className="mt-2 text-slate-600 ">Facilitating the transition from academia to the professional world.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 bg-background-light  rounded-lg shadow-md text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full /10 bg-cyan-100 text-2xl text-cyan-800 mb-4">
                  <FontAwesomeIcon  icon={faArrowTrendUp} />
                </div>
                <h3 className="text-xl font-semibold text-slate-800  mb-2">Proven Track Record</h3>
                <p>We have a consistent history of successful placements across diverse industries, reflecting the quality of our students and the strength of our corporate relationships.</p>
              </div>
              <div className="p-6 bg-background-light dark:bg-background-dark rounded-lg shadow-md text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full /10 bg-cyan-100 text-2xl text-cyan-800  mb-4">
                  <FontAwesomeIcon icon={faUsersLine} />
                </div>
                <h3 className="text-xl font-semibold text-slate-800  mb-2">Extensive Network</h3>
                <p>Our cell maintains strong ties with a wide network of multinational corporations, startups, and public sector organizations, offering a plethora of opportunities.</p>
              </div>
              <div className="p-6 bg-background-light dark:bg-background-dark rounded-lg shadow-md text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full /10 bg-cyan-100 text-2xl text-cyan-800 mb-4">
                    <FontAwesomeIcon icon={faChartSimple} />                </div>
                <h3 className="text-xl font-semibold text-slate-800  mb-2">Career Development</h3>
                <p>We provide comprehensive training, workshops, and counseling to equip students with the necessary skills to excel in interviews and their future careers.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="py-20" id="info">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-900  mb-4">Placement Detail</h2>
                <p className="text-slate-600  mb-6">Our results speak for themselves. We are proud of our students' achievements and continuously strive to bring more opportunities to campus.</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <a href="https://ycce.edu/placement-details/" className='text-cyan-600 underline hover:text-cyan-500' alt="Website">See Details</a>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </section>
        <section className="py-20 bg-slate-100 " id="contact">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-slate-900 ">Get in Touch</h2>
              <p className="mt-2 mb-8 text-slate-600 ">Have questions? We're here to help. Reach out to our placement coordinator.</p>
              <div className="inline-block p-8 bg-background-light  rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-slate-800 ">Dr. A. B. Sharma</h3>
                <p className="text-slate-500 ">Placement Coordinator</p>
                <div className="mt-4 space-y-2 text-left">
                  <a className="flex items-center gap-3 text-primary hover:underline" href="mailto:placement@ycce.edu">
                    <span className="material-icons">email</span>
                    placement@ycce.edu
                  </a>
                  <a className="flex items-center gap-3 text-primary hover:underline" href="tel:+911234567890">
                    
                    +91 123 456 7890
                  </a>
                  <div className="flex items-center gap-3 text-slate-600 ">
                    
                    <span>YCCE Campus, Nagpur, Maharashtra</span>
                  </div>
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
