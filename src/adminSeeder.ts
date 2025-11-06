import User from "./database/models/userModel"
import bcrypt from "bcrypt"


const adminSeeder=async():Promise<void>=>{
    const[data]=await User.findAll({
        where:{
            email:"pharma1admin@gmail.com",
        }
    })

    if(!data){
        await User.create({
            email:"pharma1admin@gmail.com",
            password:bcrypt.hashSync("pharma1admin",8),
            username:"pharma1admin",
            role:"admin"
        })
        console.log("Admin credentials seeded sucesful");
        
    }
    else{
        console.log("Admin credentials already seeded");
        
    }
}


export default adminSeeder