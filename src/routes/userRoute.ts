import express,{Router} from 'express'
import AuthController from '../controllers/userController'
import errorHandler from '../services/catchAsyncErr';

const router = Router(); // import { Router } from 'express'


router.route("/register")
.post(errorHandler(AuthController.registerUser))


router.route("/login")
.post(errorHandler(AuthController.loginUser))


export default router