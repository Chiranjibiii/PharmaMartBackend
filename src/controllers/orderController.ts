import { Response } from "express";
import Order from "../database/models/order";
import { AuthRequest } from "../middleware/authMiddleware";
import {
    KhaltiResponse,
    OrderData,
    OrderStatus,
    PaymentMethod,
    TransactionStatus,
    TransactionVerificationResponse
} from "../types/orderTypes";
import Payment from "../database/models/paymentstatus";
import OrderDetail from "../database/models/orderDetails";
import Product from "../database/models/product";
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

        const paymentData = await Payment.create({
            paymentMethod: paymentDetails.paymentMethod,
        });

        const orderData = await Order.create({
            phoneNumber,
            shippingAddress,
            totalAmount,
            userId,
            paymentId: paymentData.id
        });

        for (let i = 0; i < items.length; i++) {
            await OrderDetail.create({
                quantity: items[i]!.quantity,
                productId: items[i]!.productId,
                orderId: orderData.id
            });
        }

        if (paymentDetails.paymentMethod == PaymentMethod.khalti) {
            const data = {
                return_url: "http://localhost:3000/success",
                purchase_order_id: orderData.id,
                amount: totalAmount * 100,
                website_url: "http://localhost:300",
                purchase_order_name: 'orderName_' + orderData.id
            };

            const response = await axios.post(
                'https://dev.khalti.com/api/v2/epayment/initiate/',
                data,
                {
                    headers: {
                        'Authorization': 'key d0177effa15a49f697ec894d39365a1e'
                    }
                }
            );

            const khaltiResponse: KhaltiResponse = response.data;
            paymentData.pidx = khaltiResponse.pidx;
            await paymentData.save();

            res.status(200).json({
                message: "Order placed successfully",
                url: khaltiResponse.payment_url
            });
        } else {
            res.status(201).json({
                message: "Order created successfully",
            });
        }
    }

    async verifyTransaction(req: AuthRequest, res: Response): Promise<void> {
        const { pidx } = req.body;

        if (!pidx) {
            res.status(400).json({
                message: "Please provide pidx"
            });
            return;
        }

        const response = await axios.post(
            "https://dev.khalti.com/api/v2/epayment/lookup/",
            { pidx },
            {
                headers: {
                    'Authorization': 'key d0177effa15a49f697ec894d39365a1e'
                }
            }
        );

        const data: TransactionVerificationResponse = response.data;

        if (data.status === TransactionStatus.Completed) {
            await Payment.update(
                { paymentStatus: 'paid' },
                { where: { pidx: pidx } }
            );

            res.status(200).json({
                message: "Payment Verified Successfully"
            });
        } else {
            res.status(200).json({
                message: "Payment not verified"
            });
        }
    }
    //Customer Side start here      
    async fetchMyOrders(req: AuthRequest, res: Response): Promise<void> {
        const userId = req.user?.id;

        const orders = await Order.findAll({
            where: { userId },
            include: [{ model: Payment }]
        });

        if (orders.length > 0) {
            res.status(200).json({
                message: "Orders fetched successfully",
                data: orders
            });
        } else {
            res.status(404).json({
                message: "You haven't ordered anything yet...",
                data: []
            });
        }
    }

    async fetchOrderDetails(req: AuthRequest, res: Response): Promise<void> {
        const orderId = req.params.id;

        const orderDetails = await OrderDetail.findAll({
            where: { orderId },
            include: [{ model: Product }]
        });

        if (orderDetails.length > 0) {
            res.status(200).json({
                message: "Order details fetched successfully",
                data: orderDetails
            });
        } else {
            res.status(404).json({
                message: "No order details found",
                data: []
            });
        }
    }

    async cancelMyOrder(req: AuthRequest, res: Response): Promise<void> {
        const userId = req.user?.id;
        const orderId = req.params.id;

        const order: any = await Order.findOne({
            where: { userId, id: orderId }
        });

        if (!order) {
            res.status(404).json({
                message: "Order not found"
            });
            return;
        }

        if (order.orderStatus === OrderStatus.Ontheway || order.orderStatus === OrderStatus.Prepration) {
            res.status(200).json({
                message: "You cannot cancel the order when it's on the way or in preparation"
            });
            return;
        }

       await Order.update({OrderStatus:OrderStatus.Cancelled},{
        where:{
            id:orderId
        }
       })
       res.status(200).json({
        message:"Order Cancelled Sucessfully"
       })
    }
    //customer side ends here 
}

export default new OrderController();
