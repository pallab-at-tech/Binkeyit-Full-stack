import React from 'react'
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className='border-t'>

      <div className='container mx-auto p-4 text-center flex flex-col lg:flex-row lg:justify-between gap-2'>
        <p>&copy; All Rights Reserved 2025</p>
        <div className='flex items-center gap-4 justify-center  text-2xl'> 
          <a className='hover:text-primary-100' href="">
            <FaFacebook />
          </a>
          <a className='hover:text-primary-100' href="">
            <FaInstagram />
          </a>
          <a className='hover:text-primary-100' href="">
            <FaLinkedin />
          </a>

        </div>



      </div>

    </footer>
  )
}

export default Footer
