import express from 'express';
import type { Application, Request, Response } from 'express';

const port: number = 3000;
const app: Application = express();

import * as dotenv from 'dotenv'
dotenv.config()

import './database/connection'

import userRoute from './routes/userRoute'
import adminSeeder from './adminSeeder';

app.use(express.json())


//admin seeder
adminSeeder()

app.use("/",userRoute)



app.listen(port, () => {
    console.log(`The server is running at port ${port}`);
});
