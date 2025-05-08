import React, { useState } from 'react'
import DisplayPriceInRupees from '../utils/DisplayPriceinRupee'
import { useGlobalContext } from '../provider/GlobalProvider'
import AddAdresses from '../component/AddAdresses'
import { useSelector } from 'react-redux'
import AxiosTostError from '../utils/AxiosTostError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import {loadStripe} from '@stripe/stripe-js'

const CheckoutPage = () => {

    const { totalPrice, notDiscountTotalPrice, totalQty, fetchCartItem , fetchOrder } = useGlobalContext()
    const [openAddress, setOpenAddress] = useState(false)
    const adressList = useSelector(state => state.addresses.adressList)
    const [selectedAdress, setSelectedAdress] = useState(0)
    const cartItemList = useSelector(state => state.cartItem.cart)
    const navigate = useNavigate()


    const handleCashOnDelivary = async () => {
        try {

            const response = await Axios({
                ...SummaryApi.cashOnDelivaryOrder,
                data: {
                    list_items: cartItemList,
                    addressId: adressList[selectedAdress]?._id,
                    totalAmt: totalPrice,
                    subTotalAmt: totalPrice
                }
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                if (fetchCartItem) {
                    fetchCartItem()
                }

                if(fetchOrder){
                    fetchOrder()
                }

                navigate("/success", {
                    state: {
                        text: "Order"
                    }
                })
            }

        } catch (error) {
            AxiosTostError(error)
        }
    }

    const handleOnlinePayment = async () => {
        try {
            toast.loading("Loading..")
            const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
            const stripePromise = await loadStripe(stripePublicKey)

            // console.log("stripePromise",stripePromise)


            const response = await Axios({
                ...SummaryApi.payment_url,
                data: {
                    list_items: cartItemList,
                    addressId: adressList[selectedAdress]?._id,
                    totalAmt: totalPrice,
                    subTotalAmt: totalPrice
                }
            })

            const {data : responseData} = response
            stripePromise.redirectToCheckout({sessionId : responseData.id})

            if(fetchCartItem){
                fetchCartItem()
            }

            if(fetchOrder){
                fetchOrder()
            }

        } catch (error) {
            AxiosTostError(error)
        }
    }



    // console.log("adressList",adressList[selectedAdress] )

    return (
        <section className='bg-blue-50'>
            <div className='container mx-auto p-4 flex flex-col lg:flex-row w-full gap-5 justify-between'>

                <div className='w-full'>
                    {/* adress */}
                    <h3 className='text-lg font-semibold'>choose your adress</h3>

                    <div className='bg-white p-2 grid gap-2'>
                        {
                            adressList.map((adress, index) => {
                                return (
                                    <label htmlFor={"address" + index} className={!adress.status ? "hidden" : ""}>
                                        <div className='border rounded p-3 flex gap-3 hover:bg-blue-50'>
                                            <div>
                                                <input id={"address" + index} type="radio" value={index} onChange={(e) => setSelectedAdress(e.target.value)} name='address' />
                                            </div>
                                            <div>
                                                <p>{adress.adress_line}</p>
                                                <p>{adress.city}</p>
                                                <p>{adress.state}</p>
                                                <p>{adress.country} - {adress.pincode}</p>
                                                <p>{adress.mobile}</p>
                                            </div>

                                        </div>
                                    </label>
                                )
                            })
                        }

                        <div onClick={() => setOpenAddress(true)} className='h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer'>
                            Add adress
                        </div>
                    </div>

                </div>

                <div className='w-full max-w-md bg-white py-4 px-2'>
                    {/* summary */}
                    <h3 className='text-lg font-semibold'>Summary</h3>
                    <div className='bg-white p-4'>
                        <h3 className='font-semibold'>Bill details</h3>

                        <div className='flex justify-between gap-4 ml-1'>
                            <p>Item total</p>
                            <p className='flex items-center gap-2'>
                                <span className='line-through text-neutral-400'>{DisplayPriceInRupees(notDiscountTotalPrice)}</span>
                                <span className=''>{DisplayPriceInRupees(totalPrice)}</span>
                            </p>
                        </div>

                        <div className='flex justify-between gap-4 ml-1'>
                            <p>Total Quantity</p>
                            <p className='flex items-center gap-2'>{totalQty} items</p>
                        </div>

                        <div className='flex justify-between gap-4 ml-1'>
                            <p>Delivary Charge</p>
                            <p className='flex items-center gap-2'>Free</p>
                        </div>

                        <div className='font-semibold flex items-center justify-between gap-4'>
                            <p>Grand total</p>
                            <p>{DisplayPriceInRupees(totalPrice)}</p>
                        </div>

                    </div>

                    <div className='w-full flex flex-col gap-4'>
                        <button onClick={handleOnlinePayment} className='py-2 px-4 bg-green-600 text-white font-semibold hover:bg-green-700 rounded '>Online Payment</button>
                        <button onClick={handleCashOnDelivary} className='py-2 px-4 border-2 border-green-600  font-semibold text-green-600 hover:bg-green-600 hover:text-white rounded '>Cash on Delivary</button>
                    </div>

                </div>

            </div>

            {
                openAddress && (
                    <AddAdresses close={() => setOpenAddress(false)} />
                )
            }
        </section>
    )
}

export default CheckoutPage
