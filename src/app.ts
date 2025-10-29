import express from 'express';
import type { Application, Request, Response } from 'express';

const port: number = 3000;
const app: Application = express();

import * as dotenv from 'dotenv'
dotenv.config()

import './database/connection'


app.get("/", (req: Request, res: Response) => {
    res.send("Hello World");
});
app.get("/about", (req: Request, res: Response) => {
    res.send("Hello this is about");
});

app.listen(port, () => {
    console.log(`The server is running at port ${port}`);
});
