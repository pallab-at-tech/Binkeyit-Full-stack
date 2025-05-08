import React, { useState } from 'react'
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosTostError from '../utils/AxiosTostError';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom"
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';
import fetchUserDetails from "../utils/fetchUserDetails"


const Login = () => {

  const [data, setdata] = useState({
    email: "",
    password: ""
  })

  const [showPassword, setshowPassword] = useState(false)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handelChange = (e) => {
    const { name, value } = e.target
    setdata((preve) => {
      return {
        ...preve,
        [name]: value
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios({
        ...SummaryApi.login,
        data: data
      })

      if (response.data.error) {
        toast.error(
          response.data.message
        )
      } 

      if (response.data.success) {

        toast.success(
          response.data.message
        )
        localStorage.setItem('accesstoken', response.data.data.accesstoken)
        localStorage.setItem('refreshToken', response.data.data.refreshToken)

        const userDeatails = await fetchUserDetails();
        dispatch(setUserDetails(userDeatails.data)) 

        setdata({
          email: "",
          password: ""
        })

        navigate("/")
      }

      // console.log("response ",response)

    } catch (error) {
      AxiosTostError(error)
    }

  }

  const validValue = Object.values(data).every(el => el)


  return (
    <section className='w-full container  mx-auto px-2'>
      <div className='bg-white my-4 max-w-lg mx-auto rounded p-7'>
        <p>Welcome to Binkeyit</p>

        <form className='grid gap-4 py-4' onSubmit={handleSubmit}>

          <div className='grid gap-1'>
            <label htmlFor="email">Email :</label>
            <input type="email" value={data.email} onChange={handelChange} name='email' id='email' placeholder='Enter your email' autoFocus className='bg-blue-50 p-2 border rounded outline-none focus-within:border-primary-200' />
          </div>

          <div className='grid gap-1'>
            <label htmlFor="password">Password :</label>
            <div className='bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200'>
              <input type={showPassword ? "text" : "password"} value={data.password} onChange={handelChange} name='password' id='password' placeholder='Enter your password' autoFocus className='w-full outline-none' />

              <div onClick={() => setshowPassword(!showPassword)} className='cursor-pointer'>
                {
                  showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )
                }

              </div>
            </div>
            <Link to={"/forgot-password"} className='block ml-auto hover:text-primary-200'>Forgot password ? </Link>
          </div>



          <button disabled={!validValue} className={`${validValue ? "bg-green-800 hover:bg-green-700f" : "bg-gray-500"} text-white py-2 rounded font-semibold my-2 tracking-wide`}>Login</button>
        </form>

        <p>
          Don't have account ? <Link to={"/register"} className="font-semibold text-green-700 hover:text-green-800 my-2">Register</Link>
        </p>

      </div>


    </section>
  )
}

export default Login
