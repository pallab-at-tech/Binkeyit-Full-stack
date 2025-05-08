import React, { useEffect, useState } from 'react'
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from '../utils/UploadImage';
import Loading from '../component/Loading';
import ViewImage from "../component/ViewImage"
import { MdDelete } from "react-icons/md";
import { useSelector } from 'react-redux';
import { IoClose } from 'react-icons/io5';
import AddFieldComponent from '../component/AddFieldComponent';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosTostError from "../utils/AxiosTostError"
import successAlert from '../utils/SuccessAlert';

const UploadProduct = () => {

  const [data, setData] = useState({
    name: "",
    image: [],
    category: [],
    subCategory: [],
    unit: "",
    stock: "",
    price: "",
    discount: "",
    description: "",
    more_details: {}
  })

  const [imageLoading, setImageLoading] = useState(false)
  const [viewImageURL, setViewImageURL] = useState("")
  const allCategory = useSelector(state => state.product.allCategory)
  const [selectCategory, setSelectCategory] = useState("")
  const [selectSubCategory, setSelectSubCategory] = useState("")
  const allSubCategory = useSelector(state => state.product.allSubCategory)

  const [openAddField, setOpenAddField] = useState(false)
  const [fieldName, setfieldName] = useState("")



  const handleChange = (e) => {

    const { name, value } = e.target

    setData((prev) => {
      return {
        ...prev,
        [name]: value
      }
    })

  }

  const handleUploadImage = async (e) => {

    const file = e.target.files[0]

    if (!file) {
      return
    }

    setImageLoading(true)

    const response = await uploadImage(file);
    const { data: ImageResponse } = response
    const imageUrl = ImageResponse.data.url

    setData((prev) => {
      return {
        ...prev,
        image: [...prev.image, imageUrl]
      }
    })

    setImageLoading(false)

    // console.log(file)
  }

  const handleDeleteImage = async (index) => {

    data.image.splice(index, 1);
    setData((prev) => {
      return {
        ...prev
      }
    })
  }

  const handleRemoveCategory = async (index) => {
    data.category.splice(index, 1);
    setData((preve) => {
      return {
        ...preve
      }
    })

  }

  const handleRemoveSubCategory = async (index) => {
    data.subCategory.splice(index, 1);
    setData((preve) => {
      return {
        ...preve
      }
    })
  }

  const handleAddField = () => {
    setData((prev) => {
      return {
        ...prev,
        more_details: {
          ...prev.more_details,
          [fieldName]: ""
        }
      }
    })
    setfieldName("")
    setOpenAddField(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("data", data)

    try {

      const response = await Axios({
        ...SummaryApi.createProduct,
        data: data
      })

      const { data: responseData } = response

      if (responseData.success) {
        successAlert(responseData.message)
        setData({
          name : "",
          image : [],
          category : [],
          subCategory : [],
          unit : "",
          stock : "",
          price : "",
          discount : "",
          description : "",
          more_details : {},
        })
      }
    } catch (error) {
      AxiosTostError(error);
    }
  }



  return (
    <section>
      <div className='p-2 bg-white shadow-md flex justify-between'>
        <h2 className='font-semibold'>Upload product</h2>
      </div>

      <div className='grid p-3'>
        <form action="" className='grid gap-4' onSubmit={handleSubmit}>
          <div className='grid gap-1'>
            <label htmlFor="name" className='font-medium'>Name</label>
            <input type="text" id='name' placeholder='Enter product name' name='name' value={data.name} onChange={handleChange} required className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded' />
          </div>

          {/* <textarea name="" id=""></textarea> */}

          <div className='grid gap-1'>
            <label className='font-medium' htmlFor="description">Description</label>
            <textarea type="text" id='description' placeholder='Enter product description' name='description' value={data.description} rows={3} onChange={handleChange} required className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded resize-none' />
          </div>

          <div>
            <p className='font-medium'>Image</p>
            <div>
              <label htmlFor='productImage' className='bg-blue-50 h-24 border rounded flex justify-center items-center cursor-pointer'>
                <div className='text-center flex justify-center items-center'>
                  {
                    imageLoading ? <Loading /> : (
                      <>
                        <FaCloudUploadAlt size={35} />
                        <p>Upload Image</p>
                      </>
                    )
                  }
                </div>

                <input type="file" id='productImage' className='hidden' accept='image/*' onChange={handleUploadImage} />
              </label>
              {/* display uploaded images */}

              <div className='flex flex-wrap gap-4'>
                {
                  data.image.map((img, index) => {
                    return (
                      <div key={img + index} className='h-20 w-20 min-w-20 bg-blue-50 relative group my-4'>
                        <img src={img} alt={img} className='w-full mt-1 h-full object-scale-down cursor-pointer  border border-amber-300' onClick={() => setViewImageURL(img)} />

                        <div onClick={() => handleDeleteImage(index)} className='absolute bottom-0 right-0 p-1 bg-red-600 rounded text-white hidden group-hover:block cursor-pointer'>
                          <MdDelete />
                        </div>
                      </div>
                    )
                  })
                }
              </div>

            </div>
          </div>


          <div className='grid gap-1'>
            <label className='font-medium'>Category</label>
            <div>
              <select
                className='bg-blue-50 border w-full p-2 rounded'
                value={selectCategory}
                onChange={(e) => {
                  const value = e.target.value
                  const category = allCategory.find(el => el._id === value)

                  setData((preve) => {
                    return {
                      ...preve,
                      category: [...preve.category, category],
                    }
                  })
                  setSelectCategory("")
                }}
              >
                <option value={""}>Select Category</option>
                {
                  allCategory.map((c, index) => {
                    return (
                      <option value={c?._id}>{c.name}</option>
                    )
                  })
                }
              </select>
              <div className='flex flex-wrap gap-3'>
                {
                  data.category.map((c, index) => {
                    return (
                      <div key={c._id + index + "productsection"} className='text-sm flex items-center gap-1 bg-blue-50 mt-2'>
                        <p>{c.name}</p>
                        <div className='hover:text-red-500 cursor-pointer' onClick={() => handleRemoveCategory(index)}>
                          <IoClose size={20} />
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>


          <div className='grid gap-1'>
            <label className='font-medium'>Sub Category</label>
            <div>
              <select
                className='bg-blue-50 border w-full p-2 rounded'
                value={selectSubCategory}
                onChange={(e) => {
                  const value = e.target.value
                  const subCategory = allSubCategory.find(el => el._id === value)

                  setData((preve) => {
                    return {
                      ...preve,
                      subCategory: [...preve.subCategory, subCategory]
                    }
                  })
                  setSelectSubCategory("")
                }}
              >
                <option value={""} className='text-neutral-600'>Select Sub Category</option>
                {
                  allSubCategory.map((c, index) => {
                    return (
                      <option value={c?._id}>{c.name}</option>
                    )
                  })
                }
              </select>
              <div className='flex flex-wrap gap-3'>
                {
                  data.subCategory.map((c, index) => {
                    return (
                      <div key={c._id + index + "productsection"} className='text-sm flex items-center gap-1 bg-blue-50 mt-2'>
                        <p>{c.name}</p>
                        <div className='hover:text-red-500 cursor-pointer' onClick={() => handleRemoveSubCategory(index)}>
                          <IoClose size={20} />
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>

          <div className='grid gap-1'>
            <label className='font-medium' htmlFor="unit">Unit</label>
            <input type="text" id='unit' placeholder='Enter product unit' name='unit' value={data.unit} onChange={handleChange} required className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded' />
          </div>

          <div className='grid gap-1'>
            <label className='font-medium' htmlFor="stock">Number of Stock</label>
            <input type="number" id='stock' placeholder='Enter product stock' name='stock' value={data.stock} onChange={handleChange} required className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded' />
          </div>

          <div className='grid gap-1'>
            <label className='font-medium' htmlFor="price">Price</label>
            <input type="number" id='price' placeholder='Enter product price' name='price' value={data.price} onChange={handleChange} required className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded' />
          </div>

          <div className='grid gap-1'>
            <label htmlFor="discount">Discount</label>
            <input type="number" id='discount' placeholder='Enter product discount' name='discount' value={data.discount} onChange={handleChange} required className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded' />
          </div>

          {/** add more fields **/}
          {
            Object.keys(data?.more_details)?.map((k, index) => {
              return (
                <div className='grid gap-1'>
                  <label className='font-medium' htmlFor={k}>{k}</label>
                  <input type="text" id={k} value={data?.more_details[k]}
                    onChange={(e) => {
                      const value = e.target.value
                      setData((prev) => {
                        return {
                          ...prev,
                          more_details: {
                            ...prev.more_details,
                            [k]: value
                          }
                        }
                      })
                    }} required className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded' />
                </div>
              )
            })
          }

          <div onClick={() => setOpenAddField(true)} className='inline-block hover:bg-primary-200 bg-white py-1 px-3 w-32 text-center font-semibold border border-primary-200 hover:text-neutral-900 cursor-pointer rounded'>
            Add Fields
          </div>

          <button className='bg-primary-100 hover:bg-primary-200 py-2 rounded font-semibold '>
            Submit
          </button>

        </form>
      </div>

      {
        viewImageURL && (
          <ViewImage url={viewImageURL} close={() => setViewImageURL("")} />
        )
      }

      {
        openAddField && (
          <AddFieldComponent
            close={() => setOpenAddField(false)}
            value={fieldName}
            onChange={(e) => setfieldName(e.target.value)}
            submit={handleAddField}

          />
        )
      }

    </section>
  )
}

export default UploadProduct
