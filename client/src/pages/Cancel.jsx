import React from 'react'
import { Link } from 'react-router-dom'

const Cancel = () => {
  return (
    <div className='m-2 w-full max-w-md bg-red-200 p-4 rounded mx-auto flex flex-col justify-center items-center gap-5'>
      <p className='text-red-800 font-bold text-lg text-center py-5'>Order Cancel</p>
      <Link to="/" className='border border-red-900 px-4 text-red-900 hover:bg-red-900 hover:text-white py-1 transition-all'>Go to Home</Link>
    </div>
  )
}

export default Cancel
