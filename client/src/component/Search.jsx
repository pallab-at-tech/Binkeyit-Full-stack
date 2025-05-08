import React, { useEffect, useState } from 'react'
import { IoSearch } from "react-icons/io5";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { FaArrowLeft } from "react-icons/fa6";
import useMobile from '../hooks/UseMobile';



const Search = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const [isSearchPage, setisSearchPage] = useState(false);
    const [isMobile] = useMobile();
    const params = useLocation()
    const searchText = params.search.slice(3)

    useEffect(() => {
        const isSearch = location.pathname === "/search"
        setisSearchPage(isSearch);
    }, [location])


    const redirectToSearchPage = () => {
        navigate("/search")
    }

    const handleOnChange = (e) =>{
        const value = e.target.value
        const url = `/search?q=${value}`
        navigate(url)
    }



    return (
        <div className='w-full  min-w-[300px] lg:min-w-[420px] h-11 lg:h-12 rounded-lg border overflow-hidden flex items-center text-neutral-500 bg-slate-50 group focus-within:border-primary-200'>


            {
                (isMobile && isSearchPage) ? (

                    <Link to={""} className='flex justify-center items-center h-full p-2.5 m-1 group-focus-within:text-primary-200 bg-white rounded-full shadow-md'>
                        <FaArrowLeft size={20} />
                    </Link>
                ) : (
                    <button className='flex justify-center items-center h-full p-3 group-focus-within:text-primary-200'>
                        <IoSearch size={22} />
                    </button>
                )
            }


            <div className='w-full h-full'>
                {
                    !isSearchPage ? (
                        <div onClick={redirectToSearchPage} className='w-full h-full flex items-center'>
                            <TypeAnimation
                                sequence={[
                                    // Same substring at the start will only be typed out once, initially
                                    'search "milk"',
                                    1000, // wait 1s before replacing "Mice" with "Hamsters"
                                    'search "bread"',
                                    1000,
                                    'search "suger"',
                                    1000,
                                    'search "panner"',
                                    1000,
                                    'search "chocolate"',
                                    1000,
                                    'search "curd"',
                                    1000,
                                    'search "rice"',
                                    1000,
                                    'search "egg"',
                                    1000,
                                    'search "chips"',
                                    1000
                                ]}
                                wrapper="span"
                                speed={50}
                                repeat={Infinity}
                            />
                        </div>
                    ) : (

                        <div className='w-full h-full'>
                            <input type="text" defaultValue={searchText} onChange={handleOnChange} autoFocus={true} placeholder='Search for atta dal and more..' className='h-full w-full outline-none bg-transparent' />
                        </div>
                    )
                }
            </div>




        </div>
    )
}

export default Search
