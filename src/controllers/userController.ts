    import { Request,Response } from "express";
    import User from "../database/models/userModel";
    import { promises } from "dns";
    import bcrypt from 'bcrypt'
    import jwt from 'jsonwebtoken'



    class AuthController{
        public static async registerUser(req:Request,res:Response):Promise<void>{

            const{username,email,password,role}=req.body
            if(!username || !email || !password){
                res.status(400).json({
                    message:"Please provide user name password and email"
                })
                return
            }

            await User.create({
                username,
                email,
                password : bcrypt.hashSync(password,8),
                role:role 
            })

            res.status(200).json({
                message:"User register Sucessful"
            })
        }

        public static async loginUser(req:Request,res:Response):Promise<void>{
            //user input for login 
            const {email,password}=req.body
            if(!email || !password){
                res.status(400).json({
                    message:"please enter email and password"
                })
                return
            }
            //check whether the user with above email exist or not
            const [data]=await User.findAll({
                where:{
                    email:email 
                }
            })
            if(!data){
                res.status(404).json({
                    message:"No user with that email"
                })
                return
            }
            
            //check password                  //passwordfrombody,dataindatabase
            const isMatched=bcrypt.compareSync(password,data.password)

            if(isMatched){
                //generating token

                    const token = jwt.sign({id:data.id},"chiran",{
                        expiresIn:"20days"
                    })
                    res.status(200).json({
                        message:"Loged In sucessfully",
                        data:token
                    })

                }
            else{
                res.status(403).json({
                    message:"Invalid password"
                })
            }
        }
        
    }   


    export default AuthController