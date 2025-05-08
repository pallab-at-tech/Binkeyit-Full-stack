import React from 'react'
import { useForm } from "react-hook-form"
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosTostError from '../utils/AxiosTostError'
import { IoClose } from 'react-icons/io5'
import { useGlobalContext } from '../provider/GlobalProvider'

const AddAdresses = ({ close }) => {

    const { register, handleSubmit, reset } = useForm()
    const {fetchAdress} = useGlobalContext()

    const onSubmit = async (data) => {

        try {
            const response = await Axios({
                ...SummaryApi.createAddress,
                data: {
                    adress_line: data.addressline,
                    city: data.city,
                    state: data.state,
                    pincode: data.pincode,
                    country: data.country,
                    mobile: data.mobile
                }
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                if (close) {
                    close()
                    reset()
                    fetchAdress()
                }
            }
        } catch (error) {
            AxiosTostError(error)
        }
    }

    return (
        <section className='bg-black/70 fixed top-0 left-0 right-0 bottom-0 z-50 h-screen overflow-auto'>
            <div className='bg-white p-4 w-full max-w-lg mt-8 mx-auto rounded'>
                <div className='flex justify-between items-center gap-4'>
                    <h2 className='font-semibold'>Add Address</h2>
                    <button onClick={close} className='hover:text-red-500'>
                        <IoClose size={25}/>
                    </button>
                </div>
                <form action="" className='mt-4 grid gap-4' onSubmit={handleSubmit(onSubmit)}>
                    <div className='grid gap-1'>
                        <label htmlFor="addressline">Adress Line :</label>
                        <input type="text"
                            id='addressline'
                            className='border bg-blue-50 p-2 rounded'
                            {...register("addressline", { required: true })}
                        />
                    </div>
                    <div className='grid gap-1'>
                        <label htmlFor="city">City :</label>
                        <input type="text"
                            id='city'
                            className='border bg-blue-50 p-2 rounded'
                            {...register("city", { required: true })}
                        />
                    </div>

                    <div className='grid gap-1'>
                        <label htmlFor="state">State :</label>
                        <input type="text"
                            id='state'
                            className='border bg-blue-50 p-2 rounded'
                            {...register("state", { required: true })}
                        />
                    </div>

                    <div className='grid gap-1'>
                        <label htmlFor="pincode">Pincode :</label>
                        <input type="text"
                            id='pincode'
                            className='border bg-blue-50 p-2 rounded'
                            {...register("pincode", { required: true })}
                        />
                    </div>

                    <div className='grid gap-1'>
                        <label htmlFor="country">Country :</label>
                        <input type="text"
                            id='country'
                            className='border bg-blue-50 p-2 rounded'
                            {...register("country", { required: true })}
                        />
                    </div>

                    <div className='grid gap-1'>
                        <label htmlFor="mobile">Mobile No. :</label>
                        <input type="text"
                            id='mobile'
                            className='border bg-blue-50 p-2 rounded'
                            {...register("mobile", { required: true })}
                        />
                    </div>

                    <button type='submit' className='bg-primary-200 w-full py-2 mt-4 font-semibold hover:bg-primary-100'>Submit</button>
                </form>
            </div>
        </section>
    )
}

export default AddAdresses
