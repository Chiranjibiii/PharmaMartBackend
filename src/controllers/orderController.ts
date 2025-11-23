import { Response } from "express";
import Order from "../database/models/order";
import { AuthRequest } from "../middleware/authMiddleware";
import { OrderData, PaymentMethod } from "../types/orderTypes";
import Payment from "../database/models/paymentstatus";
import OrderDetail from "../database/models/orderDetails";

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

        const orderData = await Order.create({
            phoneNumber,
            shippingAddress,
            totalAmount,
            userId
        });

        await Payment.create({
            paymentMethod: paymentDetails.paymentMethod,
            orderId: orderData.id
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
        }else{
            
        res.status(201).json({
            message: "Order created successfully",
            orderId: orderData.id
        });
        }
    }
}

export default OrderController;
