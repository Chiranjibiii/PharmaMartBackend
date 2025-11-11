import path from 'path';
import { BelongsTo, Sequelize } from 'sequelize-typescript';
import User from './models/userModel';
import Product from './models/product';
import Category from './models/category';
import Cart from './models/cart';
import { prototype } from 'events';

const sequelize = new Sequelize({
  database: process.env.DB_NAME!,
  dialect: 'mysql',
  username: process.env.DB_USERNAME!,
  password: process.env.DB_PASSWORD!,
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT!),
  models:[__dirname + "/models"]
})

sequelize.authenticate()
.then(()=>{
    console.log("connected");
    
})
.catch((err)=>{
    console.log(err);
    
})
sequelize.sync({force:false}).then(()=>{
    console.log("synced");
    
})


//Relationship between tables
User.hasMany(Product,{foreignKey:'userId'})
Product.belongsTo(User,{foreignKey:'userId'})

Product.belongsTo(Category,{foreignKey:"categoryId"})
Category.hasOne(Product,{foreignKey:"categoryId"})


User.hasMany(Cart,{foreignKey:'userId'})
Cart.belongsTo(User,{foreignKey:'userId'})

Product.hasMany(Cart,{foreignKey:'productId'})
Cart.belongsTo(Product,{foreignKey:'productId'})


export default sequelize