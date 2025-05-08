import jwt from "jsonwebtoken"
import UserModel from "../models/user.model.js";
import dotenv from "dotenv"
dotenv.config();

const generatedRefreshToken = async (userId) => {

    const token = await jwt.sign({ id: userId }, process.env.SECRET_KEY_REFRESS_TOKEN, { expiresIn: '7d' })


    const updateRefreshTokenUser = await UserModel.updateOne(

        {_id : userId},
        {refresh_token : token}
    )


    return token;
    

}

export default generatedRefreshToken