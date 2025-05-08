import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import AxiosTostError from '../utils/AxiosTostError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import CardLoading from './CardLoading'
import CardProduct from './CardProduct'
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useSelector } from 'react-redux'
import validURLconvert from '../utils/ValidURLConvert'


const CategoryWiseProductDisplay = ({ id, name }) => {

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const containerRef = useRef();
    const subCategoryData = useSelector(state => state.product.allSubCategory)
    const loadingCardNumber = new Array(6).fill(null)


    const fetchCategoryWiseProduct = async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getProductByCategory,
                data: {
                    id: id
                }
            })

            const { data: responseData } = response

            if (responseData.success) {
                setData(responseData.data)
            }
            // console.log(responseData)

        } catch (error) {
            AxiosTostError(error)
        }
        finally {
            setLoading(false)
        }

    }

    useEffect(() => {
        fetchCategoryWiseProduct()
    }, [])

    const handleScrollRight = () => {
        containerRef.current.scrollLeft += 200
    }

    const handleScrollLeft = () => {
        containerRef.current.scrollLeft -= 200
    }

    
   

    const handleRedirectProductListPage = () => {

        // console.log(id,name);

        const subCategory = subCategoryData.find(sub => {

            const filterData = sub.category.some(c => {
                return c._id == id
            })

            return filterData ? true : null
        })

        const url = `/${validURLconvert(name)}-${id}/${validURLconvert(subCategory?.name)}-${subCategory?._id}`
        return url
    }

    const redirectURL = handleRedirectProductListPage()

    return (
        <div>
            <div className='container mx-auto px-4 flex justify-between items-center gap-4'>
                <h3 className='font-semibold text-lg md:text-xl'>{name}</h3>
                <Link to={redirectURL} className="text-green-600 hover:text-green-400">see All</Link>


            </div>

            <div className='relative flex items-center'>
                <div className=' flex gap-4 md:gap-6 lg:gap-8 container mx-auto px-4 overflow-x-scroll scrollbar-none scroll-smooth' ref={containerRef}>

                    {
                        loading &&
                        loadingCardNumber.map((_, index) => {
                            return (
                                <CardLoading key={"CategoryWiseProductDisplay" + index} />
                            )
                        })
                    }

                    {/* <div className='flex gap-4'> */}
                    {
                        data.map((p, index) => {
                            return (
                                <CardProduct data={p} key={p._id + "CategoryWiseProductDisplay" + index} />
                            )
                        })
                    }

                </div>

                <div className='w-full absolute hidden lg:flex justify-between max-w-full left-0 right-0 container mx-auto px-2'>
                    <button onClick={handleScrollLeft} className='z-10 relative bg-white hover:bg-gray-100 shadow-lg p-2 rounded-full text-lg'>
                        <FaAngleLeft />
                    </button>

                    <button onClick={handleScrollRight} className='z-10 relative bg-white hover:bg-gray-100 shadow-lg p-2 rounded-full text-lg'>
                        <FaAngleRight />
                    </button>
                </div>

            </div>

        </div>
    )
}

export default CategoryWiseProductDisplay
