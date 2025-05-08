import express from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config();
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet"


import connectDB from "./config/connectDB.js";
import userRouter from "./route/user.route.js"
import categoryRouter from "./route/category.route.js";
import uploadRouter from "./route/upload.route.js";
import subCategoryRouter from "./route/subCategory.route.js";
import productRouter from "./route/product.route.js";
import cartRouter from "./route/cart.route.js";
import adressRouter from "./route/adress.route.js";
import orderRouter from "./route/order.route.js";


const app = express();

app.use(cors({
    credentials : true,
    origin : process.env.FRONTENT_URL
}));

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"))
app.use(helmet({
    crossOriginResourcePolicy : false
}))

app.get("/",(request,response)=>{

    // server to client side
    response.json({
        message : "Server is running "+PORT
    })
})

app.use('/api/user',userRouter)
app.use('/api/category',categoryRouter)
app.use('/api/file',uploadRouter)
app.use('/api/subCategory',subCategoryRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/address',adressRouter)
app.use('/api/order',orderRouter)

const PORT = 8080 || process.env.PORT
// process.env.PORT || 8080

connectDB().then(()=>{

    app.listen(PORT , ()=>{
        console.log("Server is running ",PORT);
    })
})


