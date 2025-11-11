import { where } from "sequelize";
import Category from "../database/models/category";
import { Request,Response } from "express";

class CategoryController {
    categoryData = [
        {
            categoryName: "Medicines & Health"
        },
        {
            categoryName: "Vitamins & Supplements"
        },
        {
            categoryName: "Beauty & Personal Care"
        },
        {
            categoryName: "Ayurvedic & Herbal"
        },
        {
            categoryName: "Healthcare Devices"
        }
    ]
    async seedCategory():Promise<void>{
        const datas = await Category.findAll()
        if(datas.length === 0){
             const data = await Category.bulkCreate(this.categoryData)
             console.log("Categories data seeded sucessfully");
             
        }
        else{
            console.log("Categories already seeded");
            
        }
       
    }
    async addCategory(req:Request,res:Response):Promise<void>{
        const {categoryName}=req.body
        if(!categoryName ){
            res.status(400).json({
                message:"please provide categoryName"
            })
            return

        }
        await Category.create({
            categoryName
        })
        res.status(200).json({
            message:"Category Added sucessfully"
        })
    }
    async getCategory(req:Request,res:Response):Promise<void>{
        const data=await Category.findAll()
        res.status(200).json({
            message:"Category fetched sucessfully",
            data
        })
    }
    async deleteCategory(req:Request,res:Response):Promise<void>{
        const {id}=req.params
        const data= await Category.findAll({
            where :{
                id
            }
        })
        if(data.length === 0){
            res.status(404).json({
                message:"No category with that Id"
            })
            
        }
        else{
            await Category.destroy({
                where :{
                    id : id
                }
            })
            res.status(200).json({
                message:"Category Deleted Sucessfully"
            })
        }
    }
    async updateCategory(req:Request,res:Response):Promise<void>{
        const {id}=req.params
        const {categoryName}=req.body
        await Category.update({categoryName},{
            where : {
                id
            }
        })
        res.status(200).json({
            message:"Category Updated"
        })
    }
}

export default new CategoryController();
