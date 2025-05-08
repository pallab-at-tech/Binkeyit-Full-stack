import AddressModel from "../models/adress.model.js";
import UserModel from "../models/user.model.js";

export const addAdressController = async (request, response) => {

    try {

        const userId = request.userId
        const { adress_line, city, state, pincode, country, mobile } = request.body || {}

        const createAdress = new AddressModel({
            adress_line,
            city,
            state,
            pincode,
            country,
            mobile,
            userId : userId
        })

        const saveAdress = await createAdress.save()

        const assUserAdressId = await UserModel.findByIdAndUpdate(userId,{
            $push :{
                adress_deatails : saveAdress._id
            }
        })

        return response.json({
            message : 'Address created successfully',
            error : false,
            success : true,
            data :saveAdress
        })


    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const getAdressController = async (request, response) =>{
    try {

        const userId = request.userId
        const data = await AddressModel.find({userId : userId}).sort({createdAt : -1})

        return response.json({
            data : data,
            message : "List of adress",
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const updateAdressController = async (request, response) =>{
    try {

        const userId = request.userId

        const {_id , adress_line , city , state , country , pincode , mobile} = request.body || {}

        const updateAddress = await AddressModel.updateOne({_id : _id , userId : userId},{
            adress_line : adress_line, 
            city , 
            state ,
            country , 
            pincode , 
            mobile
        })

        // console.log("updateAddress",updateAddress)

        return response.json({
            message :'Address updated',
            error : false,
            success : true,
            data : updateAddress
        })
        
    } catch (error) {
        // console.log("error",error)
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const deleteAdressController = async(request , response)=>{
    try {
        const userId = request.userId
        const {_id} = request.body || {}

        const disableAddress = await AddressModel.updateOne({_id : _id , userId},{
            status : false
        })

        return response.json({
            message : 'Address remove',
            error : false,
            success : true,
            data : disableAddress
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}


