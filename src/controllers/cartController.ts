import {Request,Response} from 'express'
import { AuthRequest } from '../middleware/authMiddleware'
import Cart from '../database/models/cart'
import Product from '../database/models/product'
import Category from '../database/models/category'


class CartController{

    async addToCart(req:AuthRequest,res:Response):Promise<void>{
        const userId=req.user?.id
        const {quantity,productId}=req.body
        
        if(!quantity || !productId){
            res.status(400).json({
                message:"Please Provide quantity and ProductId"
            })
            return
        }

        let cartItem=await Cart.findOne({
            where:{ productId, userId }
        })

        if(cartItem){
            cartItem.quantity += quantity
            await cartItem.save()
        }else{
            cartItem = await Cart.create({
                quantity,
                userId,
                productId
            })
        }

        res.status(200).json({
            message:"Product added to Cart",
            data:cartItem
        })
    }


    async getyMyCarts(req:AuthRequest,res:Response):Promise<void>{
        const userId=req.user?.id
        
        const cartItems=await Cart.findAll({
            where:{ userId },
            include:[
                {
                    model:Product,
                    attributes:['productName','productDescription','productImageUrl'],
                    include:[
                        {
                            model: Category,
                            attributes:['id','categoryName']    
                        }
                    ]
                }
            ],
            attributes : ['productId','quantity']
        })

        if(cartItems.length===0){
            res.status(400).json({
                message:"No Item in the cart"
            })
            return
        }

        res.status(200).json({
            message:"Cart Item fetched Sucessfully",
            data:cartItems
        })
    }


    async deleteMyCartItem(req:AuthRequest,res:Response):Promise<void>{
        const userId=req.user?.id
        const {productId} = req.params

        const product = await Product.findByPk(productId)
        if(!product){
            res.status(404).json({
                message:"No product with that Id"
            })
            return
        }

        await Cart.destroy({
            where:{ userId, productId }
        })

        res.status(200).json({
            message:"Product Delete sucessfully from the cart "
        })
    }


    async updateCartItem(req:AuthRequest,res:Response):Promise<void>{
        const {productId} = req.params
        const userId=req.user?.id
        const {quantity}=req.body

        if(!quantity){
            res.status(400).json({
                message:"Please Provide Quantity"
            })
            return
        }

        const cartData = await Cart.findOne({
            where:{ userId, productId }
        })

        if(cartData){
            cartData.quantity = quantity
            await cartData.save()

            res.status(200).json({
                message:"Product of the cart Updated",
                data:cartData 
            })
        }else{
            res.status(404).json({
                message:"No productId of that userId"
            })
        }
    }
}

export default new CartController()
