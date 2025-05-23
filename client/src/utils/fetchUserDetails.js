import Axios from "./Axios"
import SummaryApi from "../common/SummaryApi"

const fetchUserDetails = async()=>{
    try {
        
        const response = await Axios({
            ...SummaryApi.userDetails
        })
        
        // console.log(response.data);
        return response.data

    } catch (error) {
        console.log(error)
    }
}

export default fetchUserDetails