import { createContext, useContext, useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { useDispatch, useSelector } from "react-redux";
import { handleAddItemCart } from "../store/cartProduct";
import AxiosTostError from "../utils/AxiosTostError";
import toast from "react-hot-toast";
import { priceWithDiscount } from "../utils/priceWithDiscount";
import { handleAddAdress } from "../store/addressSlice";
import { setOrder } from "../store/orderSlice"

export const GlobalContext = createContext(null)
export const useGlobalContext = () => useContext(GlobalContext)



const GlobalProvider = ({ children }) => {

    const [totalPrice, setTotalPrice] = useState(0)
    const [totalQty, setTotalQty] = useState(0)
    const cartItem = useSelector(state => state.cartItem.cart)
    const [notDiscountTotalPrice, setNotDiscountTotalPrice] = useState(0)
    const user = useSelector(state => state?.user)

    const dispatch = useDispatch();

    const fetchCartItem = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.getCartItem
            })

            const { data: responseData } = response

            if (responseData.success) {
                dispatch(handleAddItemCart(responseData.data))
            }
        } catch (error) {
            console.log(error)
        }
    }

    const upadateCartItem = async (id, qty) => {

        console.log(id, "  ", qty)
        try {

            const response = await Axios({
                ...SummaryApi.updateCartItemQty,
                data: {
                    _id: id,
                    qty: qty
                }
            })

            const { data: responseData } = response


            if (responseData.success) {
                // toast.success(responseData.message)
                fetchCartItem()
                return responseData
            }
        } catch (error) {
            console.log(error)
            return error
        }
    }

    const deleteCartItem = async (cardId) => {
        try {

            const response = await Axios({
                ...SummaryApi.deleteCartItem,
                data: {
                    _id: cardId
                }
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                fetchCartItem()
            }

        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        const qty = cartItem.reduce((prev, curr) => {
            return prev + curr.quantity
        }, 0)

        setTotalQty(qty)

        const tprice = cartItem.reduce((prev, curr) => {

            const priceAfterDiscount = priceWithDiscount(curr?.productId?.price, curr?.productId?.discount)
            return prev + (priceAfterDiscount * curr.quantity)
        }, 0)

        setTotalPrice(tprice)

        const notDiscountPrice = cartItem.reduce((prev, curr) => {
            return prev + (curr?.productId?.price * curr.quantity)
        }, 0)

        setNotDiscountTotalPrice(notDiscountPrice)

    }, [cartItem])

    const handleLogOut = ()=>{
        localStorage.clear();
        dispatch(handleAddItemCart([]))
    }

    const fetchAdress = async()=>{
        try {
            const response = await Axios({
                ...SummaryApi.getAdress
            })

            const {data : responseData}= response

            if(responseData.success){
                dispatch(handleAddAdress(responseData.data))
            }
        } catch (error) {
            AxiosTostError(error)
        }
    }

    const fetchOrder =async()=>{
        try {
            const response = await Axios({
                ...SummaryApi.getOrderItems,
            })

            const {data : responseData} = response

            if(responseData.success){
                dispatch(setOrder(responseData.data))
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        fetchCartItem()
        handleLogOut()
        fetchAdress()
        fetchOrder()
    },[user])

    

    return (
        <GlobalContext.Provider value={{ fetchCartItem, upadateCartItem, deleteCartItem, fetchAdress ,fetchOrder, totalPrice, totalQty , notDiscountTotalPrice }}>
            {
                children
            }
        </GlobalContext.Provider>
    )
}

export default GlobalProvider
