import express from 'express';
import type { Application, Request, Response } from 'express';

const port: number = 3000;
const app: Application = express();

import * as dotenv from 'dotenv'
dotenv.config()

import './database/connection'

import userRoute from './routes/userRoute'
import porductRoute from './routes/productRoute'
import adminSeeder from './adminSeeder';
import categoryController from './controllers/categoryController';

app.use(express.json())



//admin seeder
adminSeeder()
categoryController.seedCategory()

app.use("/",userRoute)
app.use("/admin/product",porductRoute)



app.listen(port, () => {

    console.log(`The server is running at port ${port}`);
});
