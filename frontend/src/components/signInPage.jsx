import React,{useState} from 'react'
import {useParams} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {loginUser} from '../slices/authSlice.js'
function signIn() {

    const {role} = useParams()
    const dispatch = useDispatch()
    const {loading, error} = useSelector((state) => state.auth)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(loginUser({email, password, userType: role}))
    }

  return (
    <div>
          <h1 className='text-amber-800'>Sign-in to YCCE Placement Portal </h1>
          <div>
              <button className=''>

              </button>
          </div>
    </div>
  )
}

export default signIn