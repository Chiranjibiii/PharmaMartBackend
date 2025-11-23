


export interface OrderData{
    phoneNumber:string,
    shippingAddress:string,
    totalAmount:number,
    paymentDetails:{
        paymentMethod:PaymentMethod,
        paymentStatus:PaymentStatus,
        pidx?:string
    },
    items:OrderDetail[]
}


export interface OrderDetail{
    quantity:number,
    productId:string,
}


export enum PaymentMethod{
    cod='cod',
    khalti='khalti',
    esewa='esewa'
}

enum PaymentStatus{
    paid='paid',
    unpaid='unpaid'
}

export interface KhaltiResponse{
    pidx:string,
    payment_url:string, 
    expire_at:Date|string,
    expire_in:number,
    user_fee:number
}