import sendEmail from "../config/sendEmail.js"
import UserModel from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import dontenv from "dotenv"
dontenv.config()
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js"
import generatedAccessToken from "../utils/generatedAccessToken.js"
import generatedRefreshToken from "../utils/generatedRefreshToken.js"
import uploadImageClodinary from "../utils/uploadImageClodinary.js"
import generatedotp from "../utils/generatedOtp.js"
import forgotPasswordTemplate from "../utils/forgotPasswordTemplate.js"
import jwt from "jsonwebtoken"



export async function registerUserController(request, response) {

    try {

        const { name, email, password } = request.body || {}

        if (!name || !email || !password) {
            return response.status(400).json({
                message: "Provide email , name , password",
                error: true,
                success: false
            })
        }

        const user = await UserModel.findOne({ email })

        //if user null then it is a new user.
        if (user) { //if not null then work
            return response.json({
                message: "Already register email",
                error: true,
                success: false
            })
        }

        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt);

        const payload = {
            name,
            email,
            password: hashPassword
        }

        const newUser = new UserModel(payload)
        const save = await newUser.save();

        const verifyEmailUrl = `${process.env.FRONTENT_URL}/verify-email?code=${save?._id}`


        const verifyEmail = await sendEmail({

            sendTO: email,
            subject: "Verify email from binkeyit",
            html: verifyEmailTemplate({
                name,
                url: verifyEmailUrl
            })
        })

        return response.json({
            message: "User register successfully",
            error: false,
            success: true,
            data: save
        })


    } catch (error) {

        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function verifyEmailController(request, response) {

    try {

        const { code } = request.body || {}

        const user = await UserModel.findOne({ _id: code })


        if (!user) {
            return response.status(400).json({
                message: "Invalid code",
                error: true,
                success: false
            })
        }

        const updateUser = await UserModel.updateOne({ _id: code }, {
            verify_email: true
        })

        return response.json({
            message: "verification email done",
            error: false,
            success: true
        })

    } catch (error) {

        return response.status(500).json({
            message: error.message || error,
            error: true,
            status: false
        })
    }
}

export async function loginController(request, response) {

    try {

        const { email, password } = request.body

        if (!email || !password) {
            return response.status(400).json({
                message: "Provide email , password",
                error: true,
                success: false
            })
        }

        const user = await UserModel.findOne({ email })

        if (!user) {
            return response.status(400).json({
                message: "User not register",
                error: true,
                success: false
            })
        }

        if (user.status !== "Active") {
            return response.status(400).response({
                message: "Contact to admin",
                error: true,
                success: false
            })
        }

        const checkPassword = await bcryptjs.compare(password, user.password);

        if (!checkPassword) {
            return response.status(400).json({
                message: "Check your password",
                error: true,
                success: false
            })
        }

        const accesstoken = await generatedAccessToken(user._id)
        const refreshToken = await generatedRefreshToken(user._id);

        const upadteUser = await UserModel.findByIdAndUpdate(user?._id,{
            last_login_date : new Date()
        })

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        response.cookie('accesstoken', accesstoken, cookiesOption);
        response.cookie('refreshToken', refreshToken, cookiesOption);

        return response.json({

            message: "Login succesfully",
            error: false,
            success: true,
            data: {
                accesstoken,
                refreshToken
            }
        })


    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function logoutController(request, response) {

    try {

        const userId = request.userId

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        response.clearCookie("accesstoken", cookiesOption);
        response.clearCookie("refreshToken", cookiesOption);

        const removeRefreshToken = await UserModel.findByIdAndUpdate(userId, {
            refresh_token: ""
        })

        return response.json({
            message: "Logout successfully",
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(400).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function uploadAvatar(request, response) {

    try {

        const userId = request.userId
        const image = request.file
        const upload = await uploadImageClodinary(image)

        const upateUser = await UserModel.findByIdAndUpdate(userId,{
            avatar : upload.url
        })

        return response.json({
            message: "Upload profile",
            success : true,
            error : false,
            data : {
                _id : userId,
                avatar : upload.url
            }
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function updateUserDetails(request , response){

    try {

        const userId = request.userId
        const {name , email , mobile , password} = request.body

        let hashPassword = ""

        if(password){
            const salt = await bcryptjs.genSalt(10)
            hashPassword = await bcryptjs.hash(password,salt);
        }

        const updateUser = await UserModel.updateOne({ _id : userId },{
            ...(name && {name : name}),
            ...(email && {email : email}),
            ...(mobile && {mobile : mobile}),
            ...(password && {password : hashPassword})
        })

        return response.json({
            message : "Update successfully",
            error : false,
            success : true,
            data : updateUser
        })
        
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function forgotPasswordController(request , response){

    try {

        const { email } = request.body || {}

        const user = await UserModel.findOne({ email })

        if(!user){
            return response.json({
                message : "Email not available",
                error : true,
                success : false
            })
        }

        const otp = generatedotp();
        const expireTime = new Date() + 60 * 60 * 1000

        const update = await UserModel.findByIdAndUpdate(user._id,{
            forgot_password_otp:otp,
            forgot_password_expiry: new Date(expireTime).toISOString()
        })

        await sendEmail({
            sendTO : email,
            subject : "Forgot password drom Binkeyit",
            html : forgotPasswordTemplate({
                name : user.name,
                otp : otp
            })
        })

        return response.json({
            message : "check your email",
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

export async function verifyForgotPasswordOtp(request , response){
    try {

        const { email , otp } = request.body || {}

        if(!email || !otp){
            return response.json({
                message : "provide required field (email , otp )",
                error : true,
                success : false
            })
        }
        const user = await UserModel.findOne({ email })

        if(!user){
            return response.status(400).json({
                message : "Email not available",
                error : true,
                success : false
            })
        }

        const currentTime = new Date().toISOString();

        if(user.forgot_password_expiry < currentTime ){
            return response.status(400).json({
                message : "Otp is expired",
                error : true,
                success : false
            })
        }

        if(otp !== user.forgot_password_otp){
            return response.status(400).json({
                message : "Invalid otp",
                error : true,
                success : false
            })
        }

        const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
            forgot_password_otp : "",
            forgot_password_expiry: ""
        })

        return response.json({
            message : "Verify otp successfully",
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

export async function resetPassword(request , response){

    try {
        const { email , newPassword , confirmPassword } = request.body || {}

        if(!email || !newPassword || !confirmPassword){
            return response.status(400).json({
                message: "provide required field (email , new password , confirm password)",
                error: true,
                success: false
            })
        }

        const user = await UserModel.findOne( {email})

        if(!user){
            return response.status(400).json({
                message: "Email is not available",
                error: true,
                success: false
            })
        }

        if(newPassword !== confirmPassword){
            return response.status(400).json({
                message: "New passowrd and confirm password must be same",
                error: true,
                success: false
            })
        }

        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(newPassword, salt);

        const upadte = await UserModel.findOneAndUpdate(user._id,{
            password : hashPassword
        })

        return response.json({
            message: "Password update successfully",
            error: false,
            success: true
        })
        
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function refreshingToken(request , response) {
    try {

        const tokenFromcookie = request?.cookies?.refreshToken
        const tokenFromHeader = request?.headers?.authorization?.split(" ")[1]

        const refreshToken = tokenFromcookie || tokenFromHeader 

        // console.log("shit ",refreshToken)

        if(!refreshToken ){
            return response.status(401).json({
                message: "Invalid token",
                error: true,
                success: false
            })
        }

        const verifyToken = await jwt.verify(refreshToken , process.env.SECRET_KEY_REFRESS_TOKEN)
        console.log("verify token : ",verifyToken)
        

        if(!verifyToken){
            return response.status(401).json({
                message : "token is expired",
                error : true,
                success : false
            })
        }

        // console.log(verifyToken)
        const userId = verifyToken?.id

        const newAccessToken = await generatedAccessToken(userId)

        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }

        response.cookie('accesstoken',newAccessToken,cookiesOption)

        return response.json({
            message : "New Access token generated",
            error : false,
            success : true,
            data : {
                accessToken : newAccessToken
            }
        })

        
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// get login user details
export async function userDetails(request , response){
    try {
        const userId = request.userId
        const user = await UserModel.findById(userId).select("-password -refresh_token")

        return response.json({
            message : 'user details',
            data : user,
            error : false,
            success : true
        })


    } catch (error) {
        return response.status(500).json({
            message : 'something is wrong',
            error : true,
            success : false
        })
    }
}