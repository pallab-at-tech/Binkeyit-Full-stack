import React, { useEffect, useState } from 'react'
import UploadSubCategoryModel from '../component/UploadSubCategoryModel'
import AxiosTostError from '../utils/AxiosTostError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import DisplayTable from '../component/DisplayTable'
import { createColumnHelper } from '@tanstack/react-table'
import ViewImage from '../component/ViewImage'
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import EditSubCategory from '../component/EditSubCategory'
import ConfirmBox from '../component/ConfirmBox'
import toast from 'react-hot-toast'

const SubCategoryPage = () => {

  const [openAddSubCategory, setOpenAddSubCategory] = useState(false)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const columnHelper = createColumnHelper()
  const [imageURL, setImageURL] = useState("")
  const [openEdit, setOpenEdit] = useState(false)
  const [editData, setEditData] = useState({
    _id: ""
  })

  const [deleteSubCategory, setDeleteSubCategory] = useState({
    _id: ""
  })

  const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false)

  const fetchSubCategory = async () => {
    try {
      setLoading(true)
      const respose = await Axios({
        ...SummaryApi.getSubCategory
      })

      const { data: responseData } = respose

      if (responseData.success) {
        setData(responseData.data)
      }


    } catch (error) {
      AxiosTostError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubCategory()
  }, [])

  const column = [
    columnHelper.accessor('name', {
      header: 'Name'
    }),
    columnHelper.accessor('image', {
      header: 'Image',
      cell: ({ row }) => {
        return <div className='flex justify-center items-center cursor-pointer'>
          <img src={row.original.image} alt={row.original.name} className='w-8 h-8' onClick={() => { setImageURL(row.original.image) }} />
        </div>
      }
    }),
    columnHelper.accessor('category', {
      header: "Category",
      cell: ({ row }) => {
        return (
          <>
            {
              row.original.category.map((c, index) => {
                return (
                  <p key={c._id + "table"} className='shadow-md px-1 inline'>{c.name}</p>
                )
              })
            }
          </>
        )
      }
    }),
    columnHelper.accessor("_id", {
      header: "Action",
      cell: ({ row }) => {
        return (
          <div className='flex items-center justify-center gap-3'>
            <button onClick={() => {
              setOpenEdit(true)
              setEditData(row.original)
            }}
              className='p-2 bg-green-100 rounded-full  hover:text-green-600 '><FaPencilAlt size={20} />
            </button>

            <button onClick={() => {
              setOpenDeleteConfirmBox(true)
              setDeleteSubCategory(row.original)
            }} className='p-2 bg-red-100 rounded-full text-red-500 hover:text-red-600'><MdDelete size={20} />
            </button>

          </div>
        )
      }
    })
  ]

  const handleSubCategory = async()=>{
    try {
      
      const response = await Axios({
        ...SummaryApi.deleteSubCategory,
        data:deleteSubCategory
      })

      const {data : responseData} = response

      if(responseData.success){
        toast.success(responseData.message)
        fetchSubCategory()
        setOpenDeleteConfirmBox(false)
        setDeleteSubCategory({_id : ""})
      }

    } catch (error) {
      AxiosTostError(error)
    }
  }

  // console.log("categoryData", data)


  return (
    <section>
      <div className='p-2 bg-white shadow-md flex justify-between'>
        <h2 className='font-semibold'>Sub Category</h2>
        <button onClick={() => setOpenAddSubCategory(true)} className='text-sm border border-primary-200 hover:bg-primary-200 px-3
             py-1 rounded'>Add Sub Category</button>
      </div>

      <div className='overflow-auto w-full max-w-[95vw]'>
        <DisplayTable data={data} column={column} />
      </div>

      {
        openAddSubCategory && (
          <UploadSubCategoryModel close={() => setOpenAddSubCategory(false)} fetchData={fetchSubCategory}/>
        )
      }

      {
        imageURL && <ViewImage url={imageURL} close={() => setImageURL("")} />
      }

      {
        openEdit && <EditSubCategory data={editData} close={() => setOpenEdit(false)} fetchData={fetchSubCategory} />
      }

      {
        openDeleteConfirmBox && <ConfirmBox cancel={() => setOpenDeleteConfirmBox(false)} close={() => setOpenDeleteConfirmBox(false)} confirm={handleSubCategory} />
      }

    </section>
  )
}

export default SubCategoryPage
