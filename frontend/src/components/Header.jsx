import React from 'react'
// import { link } from 'react-router-dom'

function Header() {
  return (
    <header className="bg-amber-800/70 text-white shadow-md">
      <div className="container mx-auto px-2 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img src="/YCC Logo.png" alt="YCC Logo" className="h-8 w-8 sm:h-10 sm:w-10 2xl:h-12 2xl:w-12 mr-2 sm:mr-3 2xl:mr-4" />
          <h1 className="text-xs sm:text-xl 2xl:text-2xl font-bold">Placement Cell, YCCE Nagpur</h1>
        </div>

        {/* Navigation */}
        <nav className="flex space-x-4 sm:space-x-6 2xl:space-x-8">
          <div  className="hover:bg-amber-900 cursor-pointer hover:text-white bg-white text-amber-800 p-1 px-2 rounded-4xl transition-colors text-sm sm:text-base 2xl:text-lg">
            Jobs
          </div>
          <div  className="hover:bg-amber-900 cursor-pointer hover:text-white bg-white text-amber-800 p-1 px-2 rounded-4xl transition-colors text-sm sm:text-base 2xl:text-lg">
            Dashboard
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header
