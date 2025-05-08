import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosTostError from '../utils/AxiosTostError';
import Loading from "../component/Loading"
import { useSelector } from 'react-redux';
import { FaPlus, FaMinus } from "react-icons/fa6";

const AddToCartButton = ({ data }) => {

    const { fetchCartItem, upadateCartItem, deleteCartItem } = useGlobalContext()
    const [loading, setLoading] = useState(false)
    const cartItem = useSelector(state => state.cartItem.cart)
    const [isAvaiableCart, setIsAvaiableCart] = useState(false)
    const [qty, setQty] = useState(0)
    const [cartItemDetails, setCartItemDetails] = useState(0)

    // console.log("add to ", cartItem)

    const handleAddtocart = async (e) => {
        e.preventDefault();
        e.stopPropagation()

        try {

            setLoading(true)

            const response = await Axios({
                ...SummaryApi.addTocart,
                data: {
                    productId: data?._id
                }
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                if (fetchCartItem) {
                    fetchCartItem()
                }
            }

        } catch (error) {
            AxiosTostError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const checkingItem = cartItem.some(item => item.productId._id === data._id)
        setIsAvaiableCart(checkingItem)

        const product = cartItem.find(item => item.productId._id === data._id)
        setQty(product?.quantity)
        setCartItemDetails(product)

        // console.log("cartItemDetails",cartItemDetails?._id)

        // console.log("product",product)

    }, [data, cartItem])

    const increaseQty = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        const response = await upadateCartItem(cartItemDetails?._id, qty + 1)

        if (response.success) {
            toast.success("Item added")
        }


    }

    const decreaseQty = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (qty === 1) {
            deleteCartItem(cartItemDetails?._id)
        }
        else {
            const response = upadateCartItem(cartItemDetails?._id, qty - 1)

            if (response.success) {
                toast.success("Item removed")
            }
        }
    }

    return (
        <div className='w-full max-w-[150px]'>

            {
                isAvaiableCart ? (
                    <div className='flex w-full h-full'>
                        <button onClick={decreaseQty} className='bg-green-600 hover:bg-green-700 text-white flex-1 w-full p-1 rounded flex items-center justify-center'><FaMinus /></button>
                        <p className='flex-1 w-full font-semibold px-1 flex items-center justify-center'>{qty}</p>
                        <button onClick={increaseQty} className='bg-green-600 hover:bg-green-700 text-white flex-1 w-full p-1 rounded flex items-center justify-center'><FaPlus /></button>
                    </div>
                ) : (
                    <button onClick={handleAddtocart} className='bg-green-600 hover:bg-green-700 text-white lg:px-4 px-2 py-1 rounded '>
                        {loading ? <Loading /> : "Add"}
                    </button>
                )
            }

        </div>
    )
}

export default AddToCartButton
