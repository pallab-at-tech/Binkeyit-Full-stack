import React from 'react'
import {Link, useLocation} from "react-router-dom"

const Success = () => {
    const location = useLocation()
  return (
    <div className='m-2 w-full max-w-md bg-green-200 p-4 rounded mx-auto flex flex-col justify-center items-center gap-5'>
      <p className='text-green-800 font-bold text-lg text-center py-5'>{Boolean(location?.state?.text) ? location?.state?.text : "Payment "}Sucessfully</p>
      <Link to="/" className='border border-green-900 px-4 text-green-900 hover:bg-green-900 hover:text-white py-1 transition-all'>Go to Home</Link>
    </div>
  )
}

export default Success
