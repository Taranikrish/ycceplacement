
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import Home from './pages/Home.jsx'
import Singin from './pages/Singin.jsx'

function App() {
  

  return (
    <>
      <div className='h-screen w-screen'>
       
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/Signin/:role' element={<Singin />} />
      </Routes>
      </div>
    </>
  )
}

export default App
