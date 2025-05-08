import { Outlet, useLocation } from 'react-router-dom'
import './App.css'
import Header from './component/Header'
import Footer from './component/Footer'
import toast, { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import fetchUserDetails from './utils/fetchUserDetails.js';
import { setUserDetails } from "./store/userSlice"
import { setAllCategory, setAllSubCategory, setLoadingCategory } from './store/productSlice.js';
import { useDispatch } from 'react-redux';
import SummaryApi from './common/SummaryApi.jsx';
import Axios from './utils/Axios.jsx';
import { handleAddItemCart } from "./store/cartProduct.js"
import GlobalProvider from './provider/GlobalProvider';
import { FaCartShopping } from "react-icons/fa6";
import CartMobileLink from './component/CartMobile.jsx';

function App() {

  const dispatch = useDispatch();
  const loaction = useLocation()


  const fetchUser = async () => {
    const userData = await fetchUserDetails()
    dispatch(setUserDetails(userData?.data))

  }


  const fetchCategory = async () => {
    try {
      dispatch(setLoadingCategory(true))
      const response = await Axios({
        ...SummaryApi.getCategory
      })

      const { data: responseData } = response

      if (responseData.success) {
        dispatch(setAllCategory(responseData.data.sort((a, b) => a.name.localeCompare(b.name))))
      }

      // console.log(responseData)


    } catch (error) {
      console.log(error)
    }
    finally {
      dispatch(setLoadingCategory(false))
    }

  }

  const fetchSubCategory = async () => {
    try {

      const response = await Axios({
        ...SummaryApi.getSubCategory
      })

      const { data: responseData } = response

      if (responseData.success) {
        dispatch(setAllSubCategory(responseData.data))
        // setcategoryData(responseData.data)
      }

      // console.log(responseData)


    } catch (error) {
      console.log(error)
    }
    finally {

    }

  }



  useEffect(() => {
    fetchUser()
    fetchCategory()
    fetchSubCategory()
    // fetchCartItem()
  }, [])



  return (

    <GlobalProvider>

      <Header />
      <main className='min-h-[78vh]'>
        <Outlet />
      </main>
      <Footer />
      <Toaster />

      {
        loaction.pathname !== '/checkout' && (
          <CartMobileLink />
        )
      }
      

    </GlobalProvider>

  )
}

export default App
