import React, { useState } from 'react'
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosTostError from '../utils/AxiosTostError';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom"


const ForgotPassword = () => {

    const [data, setdata] = useState({
        email: ""
    })

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await Axios({
                ...SummaryApi.forgot_password,
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

                navigate("/verification-otp",{
                    state : data
                })

                toast.success(
                    response.data.message
                )

                setdata({
                    email: ""
                })

                
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

                <p className='font-semibold text-lg'>Forgot Password</p>

                <form className='grid gap-4 py-4' onSubmit={handleSubmit}>

                    <div className='grid gap-1'>
                        <label htmlFor="email">Email :</label>
                        <input type="email" value={data.email} onChange={handelChange} name='email' id='email' placeholder='Enter your email' autoFocus className='bg-blue-50 p-2 border rounded outline-none focus-within:border-primary-200' />
                    </div>

                    <button disabled={!validValue} className={`${validValue ? "bg-green-800 hover:bg-green-700f" : "bg-gray-500"} text-white py-2 rounded font-semibold my-2 tracking-wide`}>send Otp</button>
                </form>

                <p>
                    Already have account ? <Link to={"/login"} className="font-semibold text-green-700 hover:text-green-800 my-2">Register</Link>
                </p>

            </div>


        </section>
    )
}

export default ForgotPassword
