import express,{Router} from 'express'
import AuthController from '../controllers/userController'

const router = Router(); // import { Router } from 'express'


router.route("/register")
.post(AuthController.registerUser)






export default router