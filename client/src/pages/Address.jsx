import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import AddAdresses from '../component/AddAdresses'
import { MdDelete } from 'react-icons/md'
import { MdEdit } from 'react-icons/md'
import EditAddressDetail from '../component/EditAddressDetail'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosTostError from '../utils/AxiosTostError'
import { useGlobalContext } from '../provider/GlobalProvider'

const Address = () => {

  const adressList = useSelector(state => state.addresses.adressList)
  const [openAddress, setOpenAddress] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [editData, setEditData] = useState({})
  const {fetchAdress} = useGlobalContext();

  const handleDisableAddress = async(id) => {
    try {

      const response = await Axios({
        ...SummaryApi.disableAddress,
        data : {
          _id : id
        }
      })

      if(response.data.success){
        toast.success("Address Removed")

        if(fetchAdress){
          fetchAdress()
        }
      }

    } catch (error) {
      AxiosTostError(error)
    }
  }

  return (
    <div className=''>

      <div className='bg-white shadow-lg px-2 py-2 flex justify-between gap-4 items-center'>
        <h2 className='font-semibold text-ellipsis line-clamp-1'>Address</h2>

        <button onClick={() => setOpenAddress(true)} className='border border-primary-200 text-primary-200 px-3 py-1 rounded-full hover:bg-primary-200 hover:text-black'>
          Add address
        </button>
      </div>

      <div className='bg-blue-50 p-2 grid gap-2'>
        {
          adressList.map((adress, index) => {
            return (

              <div className={`border rounded p-3 flex gap-3 bg-white ${!adress.status && "hidden"}`}>

                <div className=' w-full '>
                  <p>{adress.adress_line}</p>
                  <p>{adress.city}</p>
                  <p>{adress.state}</p>
                  <p>{adress.country} - {adress.pincode}</p>
                  <p>{adress.mobile}</p>
                </div>

                <div className='grid gap-10'>
                  <button onClick={() => {
                    setOpenEdit(true)
                    setEditData(adress)
                  }} className='bg-green-200 p-1 rounded hover:text-white hover:bg-green-600'>
                    <MdEdit size={20} />
                  </button>

                  <button onClick={()=>{
                    handleDisableAddress(adress._id)
                  }} className='bg-red-200 p-1 rounded hover:text-white hover:bg-red-600'>
                    <MdDelete size={20} />
                  </button>
                </div>

              </div>

            )
          })
        }

        <div onClick={() => setOpenAddress(true)} className='h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer'>
          Add adress
        </div>
      </div>

      {
        openAddress && (
          <AddAdresses close={() => setOpenAddress(false)} />
        )
      }

      {
        openEdit && (
          <EditAddressDetail data={editData} close={() => setOpenEdit(false)} />
        )
      }

    </div>
  )
}

export default Address
