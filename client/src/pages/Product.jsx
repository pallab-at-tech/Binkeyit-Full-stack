import React,{useState} from 'react'
import SummaryApi from '../common/SummaryApi'
import AxiosTostError from '../utils/AxiosTostError'
import Axios from '../utils/Axios'
import { useEffect } from 'react'

const Product = () => {
    const [productData, setProductData] = useState([])
    const [page, setPage] = useState(1)

    const fetchProductData = async() => {
        try {
            const response = await Axios({
                ...SummaryApi.getProduct,
                data : {
                    page : page
                }
            }) 

            const {data : responseData} = response

            // console.log(responseData)

            if(responseData.success){
                setProductData(responseData.data)
            }
        } catch (error) {
            AxiosTostError(error)
        }
    }

    useEffect(()=>{
        fetchProductData();
    },[])
    return (
        <div>
            product
        </div>
    )
}

export default Product
