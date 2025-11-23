import { Response } from "express";
import Order from "../database/models/order";
import { AuthRequest } from "../middleware/authMiddleware";
import { KhaltiResponse, OrderData, PaymentMethod } from "../types/orderTypes";
import Payment from "../database/models/paymentstatus";
import OrderDetail from "../database/models/orderDetails";
import axios from "axios";

class OrderController {
    async createOrder(req: AuthRequest, res: Response): Promise<void> {
        const { phoneNumber, shippingAddress, totalAmount, paymentDetails, items }: OrderData = req.body;
        const userId = req.user?.id;

        if (!phoneNumber || !shippingAddress || !totalAmount || !paymentDetails || !paymentDetails.paymentMethod || items.length === 0) {
            res.status(400).json({
                message: "Please provide the phoneNumber, shippingAddress, totalAmount, paymentDetails, items"
            });
            return;
        }

      

        const paymentData=await Payment.create({
            paymentMethod: paymentDetails.paymentMethod,
            
        });
          const orderData = await Order.create({
            phoneNumber,
            shippingAddress,
            totalAmount,
            userId,
            paymentId:paymentData.id
        });

        for (let i = 0; i < items.length; i++) {
            await OrderDetail.create({
                quantity: items[i]!.quantity,
                productId: items[i]!.productId,
                orderId: orderData.id
            });
        }

        if(paymentDetails.paymentMethod==PaymentMethod.khalti){
            //khalti integration code

            const data={
                return_url:"http://localhost:3000/sucess",
                purchase_order_id:orderData.id,
                amount:totalAmount*100,
                websiteUrl:"http://localhost:300",
                purchase_order_name:'orderName_'+orderData.id

            }
            const response = await axios.post('https://dev.khalti.com/api/v2/epayment/initiate/',data,{
                headers:{
                    'Authorization':'key d0177effa15a49f697ec894d39365a1e'
                }
            })
            const khaltiResponse:KhaltiResponse=response.data
            paymentData.pidx=khaltiResponse.pidx
            paymentData.save()
            res.status(200).json({
                message:"Order placed sucessfully",
                url:khaltiResponse.payment_url
            })


        }else{
            
        res.status(201).json({
            message: "Order created successfully",
            orderId: orderData.id
        });
        }
    }
}

export default new OrderController()
