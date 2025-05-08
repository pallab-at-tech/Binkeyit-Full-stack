import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";
import uploadImage from '../utils/UploadImage';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from "react-hot-toast"
import AxiosToastError from "../utils/AxiosTostError"


const UploadCategoryModel = ({ close , fetchdata }) => {
    const [data, setdata] = useState({
        name: "",
        image: ""
    })
    const [loading, setloading] = useState(false)

    const handleOnChange = (e) => {
        const { name, value } = e.target
        setdata((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const handleSubmit = async(e) => {
        e.preventDefault();

        try {

            setloading(true)
            const response = await Axios({
                ...SummaryApi.addCategory,
                data : data
            })

            const {data : responseData} = response

            if(responseData.success){
                toast.success(response.data.message)
                close()
                fetchdata()
            }
            
        } catch (error) {
            AxiosToastError(error)
        }
        finally{
            setloading(false)
        }
    }

    const handleUploadCategoryImage = async (e) => {
        const file = e.target.files[0]

        if (!file) {
            return
        }

        const response = await uploadImage(file)
        const { data: ImageResponse } = response

        setdata((prev) => {
            return {
                ...prev,
                image: ImageResponse.data.url
            }
        })

    }


    return (
        <section className='fixed top-0 left-0 bottom-0 right-0 bg-neutral-800/60 flex items-center justify-center'>
            <div className='bg-white  max-w-4xl w-full p-4 rounded'>

                <div className='flex items-center justify-between'>
                    <h1 className='font-semibold'>Category</h1>
                    <button onClick={close} className='w-fit block ml-auto'>
                        <IoClose size={25} />
                    </button>
                </div>

                <form className='my-3 grid gap-2' onSubmit={handleSubmit}>
                    <div className='grid gap-1'>
                        <label id='categoryName'>Name</label>
                        <input type="text" id='categoryName' placeholder='Enter category name' value={data.name} name='name' onChange={handleOnChange} className='bg-blue-50 p-2 border border-blue-100 outline-none focus-within:border-primary-200 rounded' />
                    </div>

                    <div className='grid gap-1'>
                        <p>Images</p>
                        <div className='flex gap-4 flex-col lg:flex-row items-center'>
                            <div className='border bg-blue-50 h-36 w-full lg:w-36 flex items-center justify-center rounded'>

                                {
                                    data.image ? (
                                        <img src={data.image} alt="category" className='w-full h-full object-scale-down' />
                                    ) : (
                                        <p className='text-sm text-neutral-500'>No Image</p>
                                    )
                                }
                            </div>

                            <label htmlFor='uploadcategoryImage'>
                                <div className={`${!data.name ? "bg-gray-300" : "border-primary-200 hover:bg-primary-100"} px-4 py-1 rounded cursor-pointer border font-medium `}>Upload Image</div>
                                <input disabled={!data.name} onChange={handleUploadCategoryImage} type="file" id='uploadcategoryImage' accept='image/*' className='hidden' />
                            </label>

                        </div>
                    </div>

                    <button
                        className={`${data.name && data.image ? 'bg-primary-200 hover:bg-primary-100' : 'bg-slate-300'} py-2 font-semibold `}>
                        Add Category
                    </button>
                </form>

            </div>
        </section>
    )
}

export default UploadCategoryModel
