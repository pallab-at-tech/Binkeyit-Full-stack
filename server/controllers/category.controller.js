import CategoryModel from "../models/category.model.js"
import subCategoryModel from "../models/subCategory.model.js"
import productModel from "../models/product.model.js"

export const AddCategoryController = async (request, response) => {

    try {
        const { name, image } = request.body || {}

        if (!name || !image) {
            return response.status(400).json({
                message: "Enter required fields",
                error: true,
                success: false
            })
        }

        const addCategory = new CategoryModel({
            name,
            image
        })

        const saveCategory = await addCategory.save()

        if (!saveCategory) {
            return response.status(500).json({
                message: "Not created",
                error: true,
                success: false
            })
        }

        return response.json({
            message: "Added category",
            data: saveCategory,
            success: true,
            error: false
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }

}

export const getCategoryController = async (request, response) => {
    try {
        const data = await CategoryModel.find().sort({createdAt : -1})

        return response.json({
            data: data,
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

export const updateCategoryController = async (request, response) => {
    try {

        const { _id, name, image } = request.body || {}
        // console.log("request",request)

        const update = await CategoryModel.updateOne({
            _id: _id
        }, {
            name,
            image
        })

        return response.json({
            message: 'updated successfully',
            error: false,
            success: true,
            data: update
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const deleteCategoryController = async (request, response)=>{
    try {

        const {_id } = request.body || {}

        const checkSubCategory = await subCategoryModel.find({
            category : {
                "$in" : [ _id ]
            }
        }).countDocuments()

        const checkProductModel = await productModel.find({
            category : {
                "$in" : [ _id ]
            }
        }).countDocuments()

        if(checkSubCategory > 0 || checkProductModel > 0){
            return response.status(400).json({
                message : "Category is already used , can't deleted",
                error : true,
                success : false
            })
        }

        const deleteCategory = await CategoryModel.deleteOne({
            _id : _id
        })

        return response.json({
            message : "Delete category successfully",
            data : deleteCategory,
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