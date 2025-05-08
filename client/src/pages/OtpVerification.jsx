import React, { useState , useRef , useEffect } from 'react'
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosTostError from '../utils/AxiosTostError';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom"


const OtpVerification = () => {

  const [data, setdata] = useState(["", "", "", "", "", ""])

  const navigate = useNavigate();
  const inputRef = useRef([])
  const location = useLocation();
  
  // console.log(location)

  useEffect(() => {
    if(!location?.state?.email){
      navigate("/forgot-password");
    }
  }, [])
  

  const validValue = data.every(el => el)

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios({
        ...SummaryApi.forgot_password_otp_verification,
        data: {
          otp : data.join(""),
          email : location?.state?.email
        }
      })
      // console.log(response)

      if (response.data.error) {
        toast.error(
          response.data.message
        )
      }

      if (response.data.success) {

        toast.success(
          response.data.message
        )

        setdata(["", "", "", "", "", ""])

        navigate("/reset-password",{
          state : {
            data : response.data,
            email : location?.state?.email
          }
        })
      }

      // console.log("response ",response)

    } catch (error) {
      AxiosTostError(error)
    }

  }




  return (
    <section className='w-full container  mx-auto px-2'>
      <div className='bg-white my-4 max-w-lg mx-auto rounded p-7'>

        <p className='font-semibold text-lg'>Enter OTP</p>

        <form className='grid gap-4 py-4' onSubmit={handleSubmit}>

          <div className='grid gap-1'>
            <label htmlFor="otp">Enter your OTP :</label>
            <div className='flex items-center gap-2 justify-between'>
              {
                data.map((element, index) => {
                  return (
                    <input type="text"
                      key={index}
                      value={data[index]}

                      onChange={(e) => {
                        const value = e.target.value
                        const newData = [...data]
                        newData[index] = value
                        setdata(newData)

                        if(value && index < 5){
                          inputRef.current[index+1].focus()
                        }

                        // console.log("value", value)
                      }}

                      id='otp'

                      ref={(ref)=>{
                        inputRef.current[index] = ref
                      }}

                      maxLength={1}
                      autoFocus className='bg-blue-50 w-full max-w-16 p-2 border rounded outline-none focus-within:border-primary-200 text-center font-semibold' />
                  )
                })
              }
            </div>

          </div>

          <button disabled={!validValue} className={`${validValue ? "bg-green-800 hover:bg-green-700f" : "bg-gray-500"} text-white py-2 rounded font-semibold my-2 tracking-wide`}>Verify Otp</button>
        </form>

        <p>
          Already have account ? <Link to={"/login"} className="font-semibold text-green-700 hover:text-green-800 my-2">Login</Link>
        </p>

      </div>


    </section>
  )
}

export default OtpVerification
