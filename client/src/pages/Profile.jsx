import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaRegCircleUser } from "react-icons/fa6";
import UserProfileAvatarEdit from '../component/UserProfileAvatarEdit';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosTostError from '../utils/AxiosTostError';
import toast from 'react-hot-toast';
import { setUserDetails } from '../store/userSlice';
import fetchUserDetails from '../utils/fetchUserDetails';

const Profile = () => {
    const user = useSelector(state => state.user)
    // console.log(user)
    const [openProfileAvatarEdit, setopenProfileAvatarEdit] = useState(false)
    const [userData, setuserData] = useState({
        name: user.name,
        email: user.email,
        mobile: user.mobile
    })

    const [Loading, setLoading] = useState(false)
    const dispatch = useDispatch();

    const handleOnChange = (e) => {
        const { name, value } = e.target
        setuserData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    useEffect(() => {
        setuserData({
            name: user.name,
            email: user.email,
            mobile: user.mobile
        })
    }, [user])

    const handleSubmit = async(e) => {
        e.preventDefault();

        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.upadteUserDetails,
                data : userData
            })
            const { data : responseData} = response

            if(responseData.success){
                toast.success(responseData.message)
                 const userData = await fetchUserDetails()
                //  console.log("User details : ",userData)
                dispatch(setUserDetails(userData?.data))
            }

        } catch (error) {
            AxiosTostError(error)
        }finally{
            setLoading(false)
        }
    }


    // console.log(user)

    return (
        <div className='p-4'>

            {/* profile upload and display image */}

            <div className='w-20 h-20 bg-red-500 flex items-center justify-center rounded-full overflow-hidden drop-shadow-sm'>
                {
                    user.avatar ? (
                        <img src={user.avatar} alt={user.name} className='w-full h-full' />
                    ) : (

                        <FaRegCircleUser size={65} />
                    )
                }
            </div>

            <button onClick={() => setopenProfileAvatarEdit(true)} className='text-sm min-w-20 border border-primary-100 hover:border-primary-200 hover:bg-primary-200 px-3 py-1 rounded-full mt-3'>Edit</button>

            {
                openProfileAvatarEdit && (

                    <UserProfileAvatarEdit close={() => setopenProfileAvatarEdit(false)} />
                )
            }

            {/* user details : name mobile change-password */}

            <form className='my-4 grid gap-4' onSubmit={handleSubmit}>
                <div className='grid'>
                    <label htmlFor="">Name</label>
                    <input
                        type="text"
                        placeholder='Enter your name'
                        className='p-2 bg-blue-50 outline-none border focus-within:border-primary-200'
                        value={userData.name}
                        name='name'
                        onChange={handleOnChange}
                        required
                    />
                </div>

                <div className='grid'>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id='email'
                        placeholder='Enter your Email'
                        className='p-2 bg-blue-50 outline-none border focus-within:border-primary-200'
                        value={userData.email}
                        name='email'
                        onChange={handleOnChange}
                        required
                    />
                </div>

                <div className='grid'>
                    <label htmlFor="mobile">Mobile</label>
                    <input
                        type="text"
                        placeholder='Enter your Mobile'
                        className='p-2 bg-blue-50 outline-none border focus-within:border-primary-200'
                        value={userData.mobile}
                        name='mobile'
                        onChange={handleOnChange}
                        required
                    />
                </div>

                <button
                    className='border px-4 py-2 font-semibold hover:bg-primary-100 border-primary-100 text-primary-100 hover:text-neutral-800 rounded'>
                    {
                        Loading ? "Loading..." : "Submit"
                    }
                </button>
            </form>

        </div>
    )
}

export default Profile
