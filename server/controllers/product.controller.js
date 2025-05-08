import productModel from "../models/product.model.js"

export const createProductController = async (request, response) => {

    try {

        const { name,
            image,
            category,
            subCategory,
            unit,
            stock,
            price,
            discount,
            description,
            more_details } = request.body || {}

        if (!name || !image[0] || !category[0] || !subCategory[0] || !unit || !price || !stock || !discount || !description) {

            return response.status(400).json({
                message: "Enter required fields",
                error: true,
                success: false
            })
        }

        const product = new productModel({
            name,
            image,
            category,
            subCategory,
            unit,
            stock,
            price,
            discount,
            description,
            more_details,
        })

        const saveProduct = await product.save()

        return response.json({
            message: 'product created successfully',
            data : saveProduct,
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

export const getProductController = async(request , response) =>{
    try {
        let {page , limit , search} = request.body || {}

        if(!page){
            page = 1
        }

        if(!limit){
            limit = 10
        }

        const query = search ?{
            $text : {
                $search : search
            }
        } : {}

        const skip = (page-1)*limit

        const [data , totalCount] = await Promise.all([
            productModel.find(query).sort({createdAt : -1}).skip(skip).limit(limit).populate('category subCategory'),
            productModel.countDocuments(query)
        ])

        return response.json({
            message :  'product Data',
            error : false,
            success : true,
            totalCount : totalCount,
            totalNopage : Math.ceil( totalCount / limit),
            data : data
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const getProductByCategory = async(request,response)=>{
    try {
        const {id} = request.body || {}

        if(!id){
            return response.status(400).json({
                message : "provide category id",
                error: true,
                success: false
            })
        }

        const product = await productModel.find({
            category : {$in : id}
        }).limit(15)


        return response.json({
            message : "category product list",
            data : product,
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

export const getProductBycategoryAndSubSubCategory = async(request,response)=>{
    try {
        
        let {categoryId , subCategoryId , page , limit} = request.body || {}

        if(!categoryId || ! subCategoryId){
            return response.status(400).json({
                message : 'Provide categoryId and subCategoryId',
                error : true,
                success : false
            })
        }

        if(!page){
            page = 1;
        }

        if(!limit){
            limit = 10;
        }

        const skip = (page-1)*limit

        const query = {
            category :{ $in : categoryId},
            subCategory : {$in : subCategoryId}
        }

        

        const [data , dataCount] = await Promise.all([
            productModel.find(query).sort({createdAt : -1}).skip(skip).limit(limit),
            productModel.countDocuments(query)
        ])
        

        return response.json({
            message : 'product list',
            data : data,
            totalCount : dataCount,
            page : page,
            limit : limit,
            success : true,
            error : false
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const getProductDetails = async(request , response)=>{

    try {

        const {productId} = request.body || {}
        const product = await productModel.findOne({_id : productId})

        return response.json({
            message : "product details",
            data : product,
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

export const updateProductDetails = async(request , response)=>{

    try {
        
        const {_id} = request.body || {}

        if(!_id){
            return response.status(400).json({
                message : 'provide product_id',
                error : true,
                success : false
            })
        }

        const updateProduct = await productModel.updateOne({_id : _id},{
            ...request.body
        })

        return response.json({
            message : 'update Successfully',
            data : updateProduct,
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


export const deleteProductDetails = async(request , response)=>{
    try {

        const {_id} = request.body || {}

        if(!_id){
            return response.status(400).json({
                message: 'provide _id',
                error: true,
                success: false
            })
        }

        const deleteProduct = await productModel.deleteOne({_id : _id})

        return response.json({
            message : 'deleted Successfully',
            error : false,
            success : true,
            data : deleteProduct
        })
        
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


export const searchProduct = async(request , response)=>{
    try {

        let {search , page , limit} = request.body || {}

        if(!page){
            page = 1;
        }

        if(!limit){
            limit = 10;
        }

        const query = search ? {
            $text : {
                $search : search
            }
        }:{}

        const skip = (page-1)*limit

        const [data , dataCount] = await Promise.all([
            productModel.find(query).sort({createdAt : -1}).skip(skip).limit(limit).populate('category subCategory'),
            productModel.countDocuments(query)
        ])

        return response.json({
            message : 'product data',
            error : false,
            success : true,
            data : data,
            totalCount : dataCount,
            totalPage : Math.ceil(dataCount/limit),
            page : page,
            limit : limit
        })
        
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}