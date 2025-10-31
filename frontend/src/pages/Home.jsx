import React from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header.jsx'
function Home() {


  return (
    <div className='h-screen w-full relative'>
      <div >
        <Header />
      </div>
      <div style={{backgroundImage:'url("/cover.webp")'}} className='bg-contain bg-cover bg-center w-full h-[80%]'></div>
      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 grid grid-cols-1 gap-4'>
            <Link to={'/Signin/student'} className='bg-amber-800/80 px-4 py-2 rounded-2xl text-center  text-white'>
                Student
            </Link>
            <Link to={'/Signin/company'} className='bg-amber-800/80 px-4 py-2 rounded-2xl text-center text-white'>
                Company
            </Link>
            <Link to={'/Signin/admin'} className='bg-amber-800/80 px-4 py-2 rounded-2xl text-center text-white'>
                Admin
            </Link>
      </div>
    
    </div>
      
  )
}

export default Home