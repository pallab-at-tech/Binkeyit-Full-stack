import React, { useEffect, useState } from 'react'
import CardLoading from "../component/CardLoading"
import SummaryApi from "../common/SummaryApi"
import Axios from "../utils/Axios"
import AxiosTostError from "../utils/AxiosTostError"
import CardProduct from "../component/CardProduct"
import InfiniteScroll from 'react-infinite-scroll-component'
import { useLocation } from 'react-router-dom'
import noDataImage from "../assets/nothing here yet.webp"

const SearchPage = () => {

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const loadingArrayCard = new Array(10).fill(null)
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const params = useLocation()
  const searchText = params?.search?.slice(3)


  const fetchData = async () => {
    try {
      setLoading(true)

      const response = await Axios({
        ...SummaryApi.searchProduct,
        data: {
          search: searchText,
          page: page
        }
      })

      const { data: responseData } = response

      if (responseData.success) {

        if (responseData.page == 1) {
          setData(responseData.data)
        }
        else {
          setData((preve) => {
            return [
              ...preve,
              ...responseData.data
            ]
          })
        }

        setTotalPage(responseData.totalPage)
        console.log(responseData)
      }

    } catch (error) {
      AxiosTostError(error);
    } finally {
      setLoading(false)
    }
  }


  const handleFetchMore = () => {

    if (totalPage > page) {
      setPage(preve => preve + 1)
    }
  }

  useEffect(() => {
    fetchData()
  }, [page, searchText])

  return (
    <section className='bg-white'>
      <div className='container mx-auto p-4'>

        <p className='font-semibold'>Search result: {data.length}</p>

        <InfiniteScroll dataLength={data.length} hasMore={true} next={handleFetchMore}>

          <div className='grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-5 py-4 gap-4'>

            {
              data.map((p, index) => {

                return (
                  <CardProduct data={p} key={p._id + "searchproduct" + index} />
                )
              })
            }



            {/* loading data */}

            {
              loading && (
                loadingArrayCard.map((_, index) => {
                  return (
                    <CardLoading key={"loadingsearchPage" + index} />
                  )
                })
              )
            }
          </div>

        </InfiniteScroll>

        {
          // no data
          !data[0] && !loading && (
            <div className='flex flex-col justify-center items-center w-full mx-auto'>
              <img src={noDataImage} alt="" className='w-full h-full max-h-xs max-w-xs block' />
              <p className='font-semibold my-2'>No data found</p>
            </div>
          )
        }
      </div>
    </section >
  )
}

export default SearchPage
