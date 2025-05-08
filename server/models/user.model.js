import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    name : {
        type : String,
        required : [true,"provided name"]
    },
    email : {
        type : String,
        required : [true,"provided email"],
        unique : true
    },
    password : {
        type : String,
        required : [true,"provided password"]
    },
    avatar : {
        type : String,
        default : ""
    },
    mobile : {
        type : String,
        default:null
    },
    refresh_token : {
        type :String,
        default:""
    },
    verify_email : {
        type : Boolean,
        default:false
    },
    last_login_date : {
        type : Date,
        default:""
    },
    status : {
        type : String,
        enum : ["Active","Inactive","Suspended"],
        default:"Active"
    },
    adress_deatails : [
        {
            type : mongoose.Schema.ObjectId,
            ref : 'adress'
        }
    ],
    shopping_cart : [
        {
            type : mongoose.Schema.ObjectId,
            ref : 'cartProduct'
        }
    ],
    orderHistory : [
        {
            type : mongoose.Schema.ObjectId,
            ref : 'order'
        }
    ],
    forgot_password_otp : {
        type : String,
        default:null
    },
    forgot_password_expiry : {
        type : Date,
        default : ""
    },
    role : {
        type : String,
        enum : ["ADMIN","USER"],
        default : "USER"
    }

},{
    timestamps : true
})

const UserModel = mongoose.model("User",userSchema);
export default UserModel