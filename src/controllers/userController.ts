    import { Request,Response } from "express";
    import User from "../database/models/userModel";
    import { promises } from "dns";
    import bcrypt from 'bcrypt'



    class AuthController{
        public static async registerUser(req:Request,res:Response):Promise<void>{

            const{username,email,password}=req.body
            if(!username || !email || !password){
                res.status(400).json({
                    message:"Please provide user name password and email"
                })
                return
            }

            await User.create({
                username,
                email,
                password : bcrypt.hashSync(password,8)
            })

            res.status(200).json({
                message:"User register Sucessful"
            })
        }
        
    }


    export default AuthController