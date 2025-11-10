
import { Request,Response } from "express";
import Product from "../database/models/product";
import { AuthRequest } from "../middleware/authMiddleware";
import User from "../database/models/userModel";
import Category from "../database/models/category";
import { promises } from "dns";

class ProductController{
    async addproduct(req:AuthRequest,res:Response):Promise<void>{
        const userId=req.user?.id
        const{productName,productDescription,productTotalStockQty,productPrice,categoryId}=req.body
        let fileName
        if(req.file){
            fileName=req.file?.filename
        }else{
            fileName="this is will be generated";
        }

        if(!productName || !productPrice || !productDescription || !productTotalStockQty || !categoryId){
            res.status(400).json({
                message:"Please provide productName,productDescription,productTotalStockQty,productPrice,categoryId"
            })
      return
            
        }
        await Product.create({
            productName,
            productDescription,
            productPrice,
            productTotalStockQty,
            prodcutImageUrl : fileName,
            userId:userId,
            categoryId:categoryId
        })
        res.status(200).json({
            message:"Product added sucessfully"
        })
    }
    async getAllproduct(req:Request,res:Response):Promise<void>{
        const data = await Product.findAll({
            include : [
                {
                    model:User,
                    attributes:['id','email','usename']
                },
                {
                    model:Category,
                    attributes:['id','categoryName']
                }
            ]
        })
        
        res.status(200).json({
            message:"Product fetched Sucessfully!!"
        })
    }
    async getSingleProduct(req:Request,res:Response):Promise<void>{
        const id=req.params.id
        const data=await Product.findAll({
            where :{
                id:id
            },
            include : [
                {
                    model:User,
                    attributes:['id','email','username']
                },
                {
                    model:Category,
                    attributes:['id','categoryName']
                }
            ]
        })
        if(data.length==0){
            res.status(404).json({
                message:"No product with that id"
            })
        }
        else{
            res.status(200).json({
                message:"Product fetched sucessfully",
                data
            })
        }
    }
    async deleteProduct(req:Request,res:Response):Promise<void>{
        const{id}=req.params
        const data=await Product.findAll({
            where:{
                id:id
            }
        }) 
        if(data.length>0){
            await Product.destroy({
                where:{
                    id:id
                }
            })
             res.status(200).json({
            message:"Product deleted successfully"
        })
        }else{
            res.status(400).json({
                message:"No product with that Id"
            })
        }
       
    }
}

export default new ProductController()