import { NextFunction, Request,Response } from "express";
import jwt from "jsonwebtoken"
import User from "../database/models/userModel";
import { ENUM } from "sequelize";
import AuthController from "../controllers/userController";

export interface AuthRequest extends Request{
    user?:{
        username:string,
        password:string,
        email:string,
        role:string,
        id:string
    }
}


export enum Role{
    Admin="admin",
    Customer="customer"
}

class Authmiddleware{
    async isAuthenticated(req:AuthRequest,res:Response,next:NextFunction):Promise<void>{

        //get token from user
        const token = req.headers.authorization
        if(!token || token==undefined){
            res.status(403).json({
                message:"Token not provided"
            })
            return
        }

        //verify the token
        jwt.verify(token,process.env.SECRET_KEY as string,async (err,decode:any)=>{
            if(err){
                res.status(403).json({
                    message:"Invalid Token"
                })
            }
            else{
                //check if decoded object id user exist or not 
             try {
                  const userData= await User.findByPk(decode.id)
               if(!userData){
                res.status(400).json({
                    message:"No user with that token"
                })
                return
               }
               req.user=userData
               next()


             } catch (error) {
                res.status(500).json({
                    message:"Something went wrong"
                })
             }
            }
        } )
    }
    restrictTo(...roles:Role[]){
        return(req:AuthRequest,res:Response,next:NextFunction)=>{
            let userRole= req.user?.role as Role
            if(!roles.includes(userRole)){
                res.status(403).json({
                    message:"You don't have permission"
                })
            }
            else{
                next()
            }
        }
    }
}
export default new Authmiddleware()