import React, { useState, useEffect } from 'react'
import UploadCategoryModel from '../component/UploadCategoryModel'
import Loading from '../component/Loading'
import NoData from '../component/NoData'
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi'
import EditCategory from '../component/EditCategory';
import ConfirmBox from '../component/ConfirmBox';
import toast from 'react-hot-toast';
import AxiosTostError from '../utils/AxiosTostError';
import { useSelector } from 'react-redux';

const CategoryPage = () => {

  const [openUploadCategory, setopenUploadCategory] = useState(false)
  const [loading, setLoading] = useState(false)
  const [categoryData, setcategoryData] = useState([])
  const [openEdit, setopenEdit] = useState(false)
  const [editData, seteditData] = useState({
    name: "",
    image: ""
  })


  const [openConfirmBoxDelete, setOpenConfirmBoxDelete] = useState(false)
  const [deleteCategory, setDeleteCategory] = useState({
    _id: ""
  })

  // const allCategory = useSelector(state => state.product.allCategory)

  // useEffect(() => {
  //   setcategoryData(allCategory);
  // }, [allCategory])


  // console.log("allCategory from redux",allCategory)


  const fetchCategory = async () => {
    try {
      setLoading(true)

      const response = await Axios({
        ...SummaryApi.getCategory
      })

      const { data: responseData } = response

      if (responseData.success) {
        setcategoryData(responseData.data)
      }

      // console.log(responseData)


    } catch (error) {
      console.log(error)
    }
    finally {
      setLoading(false)
    }

  }

  useEffect(() => {
    fetchCategory()
  }, [])

  const handleDelete = async () => {

    try {
      const response = await Axios({
        ...SummaryApi.deleteCategory,
        data: deleteCategory
      })

      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData.message)
        fetchCategory()
        setOpenConfirmBoxDelete(false)
      }
    } catch (error) {
      AxiosTostError(error)
    }
  }

  // console.log("categoryData",categoryData)

  return (
    <section>
      <div className='p-2 bg-white shadow-md flex justify-between'>
        <h2 className='font-semibold'>Category</h2>
        <button onClick={() => setopenUploadCategory(true)} className='text-sm border border-primary-200 hover:bg-primary-200 px-3
             py-1 rounded'>Add Category</button>
      </div>

      {!categoryData[0] && !loading && (
        <NoData />
      )}

      <div className='p-4 grid grid-cols-2 md:grid-cols-4  lg:grid-cols-6 gap-2'>
        {
          categoryData.map((category, index) => {
            return (
              <div key={category._id} className='w-32 h-56  rounded shadow-md'>
                <img src={category.image} alt={category.name} className='w-32 object-scale-down' />

                <div className='items-center h-9 flex gap-2'>

                  <button onClick={() => { setopenEdit(true); seteditData(category) }} className='flex-1 bg-green-100 hover:bg-green-200 text-green-600 py-1 rounded '>Edit</button>

                  <button onClick={
                    () => {
                      setOpenConfirmBoxDelete(true)
                      setDeleteCategory(category)
                    }
                  }
                    className='flex-1  bg-red-100 hover:bg-red-200 text-red-600 py-1 rounded '>
                    Delete
                  </button>

                </div>
              </div>
            )
          })
        }
      </div>

      {
        loading && (
          <Loading />
        )
      }

      {
        openUploadCategory && (
          <UploadCategoryModel fetchdata={fetchCategory} close={() => setopenUploadCategory(false)} />
        )
      }


      {
        openEdit && (
          <EditCategory data={editData} fetchdata={fetchCategory} close={() => setopenEdit(false)} />
        )
      }

      {
        openConfirmBoxDelete && (
          <ConfirmBox close={() => { setOpenConfirmBoxDelete(false) }} cancel={() => { setOpenConfirmBoxDelete(false) }} confirm={handleDelete} />
        )
      }

    </section>
  )
}

export default CategoryPage
