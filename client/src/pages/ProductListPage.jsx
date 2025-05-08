import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosTostError from '../utils/AxiosTostError';
import Loading from "../component/Loading"
import CardProduct from "../component/CardProduct"
import { useSelector } from 'react-redux'
import validURLconvert from '../utils/ValidURLConvert';


const ProductListPage = () => {

  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [totalPage, setTotalPage] = useState(1)
  const AllSubcategory = useSelector(state => state.product.allSubCategory)
  const [DisplaySubCategory, setDisplaySubCategory] = useState([])

  // console.log("AllSubcategory",AllSubcategory)

  const params = useParams();
  const subCategory = params.subCategory.split("-")
  const subCategoryName = subCategory?.splice(0, subCategory?.length - 1)?.join(" ")


  const categoryId = params.category.split("-").slice(-1)[0]
  const subCategoryId = params.subCategory.split("-").slice(-1)[0]


  const fetchProductdata = async () => {

    try {
      setLoading(true);

      const response = await Axios({
        ...SummaryApi.getProductByCategoryAndSubCategory,
        data: {
          categoryId: categoryId,
          subCategoryId: subCategoryId,
          page: page,
          limit: 8
        }
      })

      const { data: responseData } = response

      if (responseData.success) {

        if (responseData.page == 1) {
          setData(responseData.data)
        } else {
          setData([...data, ...responseData.data])
        }
        setTotalPage(responseData.totalCount)
      }
    } catch (error) {
      AxiosTostError(error)
      console.log("hiiiiiiii")
    } finally {
      setLoading(false)
    }

  }

  useEffect(() => {
    fetchProductdata();
  }, [params])

  useEffect(() => {
    const sub = AllSubcategory.filter(s => {
      const filterData = s.category.some(el => {
        return el._id === categoryId
      })

      return filterData ? filterData : null
    })

    setDisplaySubCategory(sub)

    // console.log("sub",sub)
  }, [params, AllSubcategory])

  // console.log(params) 

  return (
    <section className='sticky top-24 lg:top-20'>
      <div className='container sticky top-24 mx-auto grid grid-cols-[90px_1fr] md:grid-cols-[200px_1fr] lg:grid-cols-[280px_1fr]'>
        {/* sub category */}
        <div className='min-h-[88vh] max-h-[88vh] overflow-y-scroll lg:p-4 grid gap-1 shadow-md scrollbarCustom bg-white py-2'>
          {
            DisplaySubCategory.map((s, index) => {

              const url = `/${validURLconvert(s?.category[0]?.name)}-${s?.category[0]?._id}/${validURLconvert(s.name)}-${s._id}`
              return (
                <Link to={url} className={`w-full p-2 bg-white lg:flex items-center lg:h-16 box-border lg:gap-4 border-b hover:bg-green-100 cursor-pointer ${subCategoryId === s._id ? "bg-green-100" : ""}`}>

                  <div className='w-fit mx-auto lg:mx-0 max-w-28 bg-white rounded box-border'>
                    <img src={s.image} alt="subcategory" className='w-14 lg:h-14 lg:w-12 h-full object-scale-down lg:object-cover' />
                  </div>

                  <p className='-mt-6 lg:mt-0 text-xs text-center lg:text-base lg:text-left'>{s.name}</p>
                </Link>
              )
            })
          }
        </div>


        {/* product */}
        <div className='sticky top-20'>
          <div className='bg-white shadow-md p-4 z-10'>
            <h3 className='font-semibold'>{subCategoryName}</h3>
          </div>

          <div className='min-h-[80vh] max-h-[80vh] overflow-y-auto relative'>
            <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 p-4 gap-4 '>

              {
                data.map((p, index) => {
                  return (
                    <CardProduct data={p} key={p._id + "productSubCategory" + index} />
                  )
                })
              }

            </div>

          </div>

          <div>
            {
              loading && (

                <Loading />
              )
            }
          </div>
        </div>

      </div>
    </section>
  )
}

export default ProductListPage
