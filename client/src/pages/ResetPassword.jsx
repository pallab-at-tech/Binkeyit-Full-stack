import React, { useEffect, useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import SummaryApi from '../common/SummaryApi';
import AxiosTostError from '../utils/AxiosTostError';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [data, setdata] = useState({
        email: "",
        newPassword: "",
        confirmPassword: ""
    })

    const [showPassword, setshowPassword] = useState(false)
    const [showConfirmPassword, setshowConfirmPassword] = useState(false)

    const validValue = Object.values(data).every(el => el)

    useEffect(() => {
        if (!(location?.state?.data?.success)) {
            navigate("/")
        }

        if (location?.state?.email) {

            // console.log("i got email" , location?.state?.email)
            setdata((prev) => {
                return {
                    ...prev,
                    email: location?.state?.email
                }
            })

            // console.log("initialize with reset password ", data)
        }
        
    }, [])

    

    const handelChange = (e) => {
        const { name, value } = e.target
        setdata((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })

        // console.log("reset password ", data)
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        if(data.newPassword !== data.confirmPassword){
            toast.error(
                "New password and confirm password must be same"
            )
            return
        }

        try {
            const response = await Axios({
                ...SummaryApi.resetPassword,
                data: data
            })
            // console.log(response)

            if (response.data.error) {
                toast.error(
                    response.data.message
                )
                // console.log(response)
            }

            if (response.data.success) {

                navigate("/login")

                toast.success(
                    response.data.message
                )

                setdata({
                    email: "",
                    newPassword: "",
                    confirmPassword: ""
                })


            }

            // console.log("response ",response)

        } catch (error) {
            AxiosTostError(error)
            // console.log("error occur")
        }

    }

    return (
        <section className='w-full container  mx-auto px-2'>
            <div className='bg-white my-4 max-w-lg mx-auto rounded p-7'>

                <p className='font-semibold text-lg'>Enter your Password</p>

                <form className='grid gap-4 py-4' onSubmit={handleSubmit}>

                    <div className='grid gap-1'>
                        <label htmlFor="newPassword">New Password :</label>

                        <div className='bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200'>
                            <input type={showPassword ? "text" : "password"} value={data.newPassword} onChange={handelChange} name='newPassword' id='newPassword' placeholder='Enter your new password' autoFocus className='w-full outline-none' />

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
                        <label htmlFor="confirmPassword">confirm Password :</label>

                        <div className='bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200'>
                            <input type={showConfirmPassword ? "text" : "password"} value={data.confirmPassword} onChange={handelChange} name='confirmPassword' id='confirmPassword' placeholder='Enter confirm password' autoFocus className='w-full outline-none' />

                            <div onClick={() => setshowConfirmPassword(!showConfirmPassword)} className='cursor-pointer'>
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

                    <button disabled={!validValue} className={`${validValue ? "bg-green-800 hover:bg-green-700f" : "bg-gray-500"} text-white py-2 rounded font-semibold my-2 tracking-wide`}>Change Password</button>
                </form>

                <p>
                    Already have account ? <Link to={"/login"} className="font-semibold text-green-700 hover:text-green-800 my-2">Login</Link>
                </p>

            </div>


        </section>
    )
}

export default ResetPassword
