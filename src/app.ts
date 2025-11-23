import express from 'express';
import type { Application, Request, Response } from 'express';

const port: number = 3000;
const app: Application = express();

import * as dotenv from 'dotenv'
dotenv.config()

import './database/connection'

import userRoute from './routes/userRoute'
import porductRoute from './routes/productRoute'
import categoryRoute from './routes/categoryRoute'
import adminSeeder from './adminSeeder';
import categoryController from './controllers/categoryController';
import cartRoute from './routes/cartRoute'
import orderRoute from './routes/orderRoute'



app.use(express.json())



//admin seeder
adminSeeder()
categoryController.seedCategory()

app.use("/",userRoute)
app.use("/admin/product",porductRoute)
app.use("/admin/category",categoryRoute)
app.use("/customer/cart",cartRoute)
app.use("/customer/order",orderRoute)



app.listen(port, () => {

    console.log(`The server is running at port ${port}`);
});
