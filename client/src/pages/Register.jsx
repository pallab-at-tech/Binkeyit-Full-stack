import React, { useState } from 'react'
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosTostError from '../utils/AxiosTostError';
import { useNavigate } from 'react-router-dom';
import {Link} from "react-router-dom"


const Register = () => {

    const [data, setdata] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const [showPassword, setshowPassword] = useState(false)
    const [showConfirmPassword, setshowConfirmPassword] = useState(false)
    const navigate = useNavigate();

    const handelChange = (e) => {
        const { name, value } = e.target
        setdata((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }

    const handleSubmit = async(e)=>{
        e.preventDefault();

        if(data.password !== data.confirmPassword){
            toast.error(
                "Password and confirm password must be same"
            )
        }

        try {
            const response = await Axios({
                ...SummaryApi.register,
                data : data
            })

            if(response.data.error){
                toast.error(
                    response.data.message
                )
            }

            if(response.data.success){

                toast.success(
                    response.data.message
                )

                setdata({
                    name : "",
                    email : "",
                    password : "",
                    confirmPassword : ""
                })

                navigate("/login")
            }

            // console.log("response ",response)
            
        } catch (error) {
            AxiosTostError(error)
        }

    }

    const validValue = Object.values(data).every(el=>el)


    return (
        <section className='w-full container  mx-auto px-2'>
            <div className='bg-white my-4 max-w-lg mx-auto rounded p-7'>
                <p>Welcome to Binkeyit</p>

                <form className='grid gap-4 mt-6' onSubmit={handleSubmit}>
                    <div className='grid gap-1'>
                        <label htmlFor="name">Name :</label>
                        <input type="text" value={data.name} onChange={handelChange} name='name' id='name' placeholder='Enter your name' autoFocus className='bg-blue-50 p-2 border rounded outline-none focus-within:border-primary-200' />
                    </div>

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
                    </div>

                    <div className='grid gap-1'>
                        <label htmlFor="confirmPassword">Confirm Password :</label>
                        <div className='bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200'>

                            <input type={showConfirmPassword ? "text" : "password"} value={data.confirmPassword} onChange={handelChange} name='confirmPassword' id='confirmPassword' placeholder='Enter your confirm password' autoFocus className='w-full outline-none' />

                            <div onClick={() => setshowConfirmPassword(!showConfirmPassword)} className='cursor-pointer'>
                                {
                                    showConfirmPassword ? (
                                        <FaEyeSlash />
                                    ) : (
                                        <FaEye />
                                    )
                                }

                            </div>

                        </div>
                    </div>

                    <button disabled={!validValue} className={`${validValue ? "bg-green-800 hover:bg-green-700f" : "bg-gray-500"} text-white py-2 rounded font-semibold my-2 tracking-wide`}>Register</button>
                </form>

                <p>
                    Already have account ? <Link to={"/login"} className="font-semibold text-green-700 hover:text-green-800 my-2">Login</Link>
                </p>

            </div>


        </section>
    )
}

export default Register
