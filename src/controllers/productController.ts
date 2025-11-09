
import { Request,Response } from "express";
import Product from "../database/models/product";
import { AuthRequest } from "../middleware/authMiddleware";

class ProductController{
    async addproduct(req:AuthRequest,res:Response):Promise<void>{
        const userId=req.user?.id
        const{productName,productDescription,productTotalStockQty,productPrice}=req.body
        let fileName
        if(req.file){
            fileName=req.file?.filename
        }else{
            fileName="this is will be generated";
        }

        if(!productName || !productPrice || !productDescription || !productTotalStockQty){
            res.status(400).json({
                message:"Please provide productName,productDescription,productTotalStockQty,productPrice"
            })
      return
            
        }
        await Product.create({
            productName,
            productDescription,
            productPrice,
            productTotalStockQty,
            prodcutImageUrl : fileName,
            userId:userId
        })
        res.status(200).json({
            message:"Product added sucessfully"
        })
    }
}

export default new ProductController()