import React, { useState, useEffect } from 'react'
import SummaryApi from '../common/SummaryApi'
import AxiosTostError from '../utils/AxiosTostError'
import Axios from '../utils/Axios'
import Loading from '../component/Loading'
import ProductCardAdmin from '../component/ProductCardAdmin'
import { IoSearchOutline } from 'react-icons/io5'
import EditProductAdmin from '../component/EditProductAdmin'

const ProductAdmin = () => {

  const [productData, setProductData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [totalPageCount, setTotalPageCount] = useState(1)
  const [search, setSearch] = useState("")

  const fetchProductData = async () => {
    try {

      setLoading(true)

      const response = await Axios({
        ...SummaryApi.getProduct,
        data: {
          page: page,
          limit: 12,
          search : search
        }
      })

      const { data: responseData } = response

      // console.log("product details :", responseData)

      if (responseData.success) {

        if (responseData.totalNopage) {
          setTotalPageCount(responseData.totalNopage)
        }
        setProductData(responseData.data)
      }
    } catch (error) {
      AxiosTostError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductData();
  }, [page])

  const handleNext = () => {
    if (page !== totalPageCount) {
      setPage(preve => preve + 1)
    }
  }

  const handlePrevious = () => {
    if (page > 1) {
      setPage(preve => preve - 1)
    }
  }

  const handleOnChange = (e)=>{
    const {value} = e.target
    setSearch(value)
    setPage(1)
  }

  useEffect(()=>{

    let flag = true

    const interval = setTimeout(()=>{
      if(flag){
        fetchProductData();
        flag = false
      }
    },300)

    return(()=>{
      clearTimeout(interval)
    })
  },[search])

  return (
    <section>
      <div className='p-2 bg-white shadow-md flex justify-between gap-4'>

        <h2 className='font-semibold'>product</h2>
        <div className='h-full w-full ml-auto max-w-56 min-w-24 bg-blue-50 px-4 flex items-center gap-3 py-2 border rounded focus-within:border-primary-200'>
          <IoSearchOutline size={25}/>
          <input onChange={handleOnChange} value={search} type="text" placeholder='search product here...' className='h-full w-full bg-transparent outline-none'/>
        </div>
      </div>


      {
        loading && (
          <Loading />
        )
      }

      <div className='p-4 bg-blue-50'>

        <div className=' min-h-[55vh]'>
          <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'>
            {
              productData.map((p, index) => {
                return (
                  <ProductCardAdmin data={p} fetchProductData={fetchProductData} key={index+"productDataSection"} />
                )
              })
            }
          </div>
        </div>



        <div className='flex justify-between my-4'>
          <button onClick={handlePrevious} className='border border-primary-200 px-4 py-1 hover:bg-primary-200'>Previous</button>
          <button className='w-full bg-slate-100'>{page}/{totalPageCount}</button>
          <button onClick={handleNext} className='border border-primary-200 px-4 py-1 hover:bg-primary-200'>Next</button>
        </div>

      </div>


    </section>
  )
}

export default ProductAdmin
