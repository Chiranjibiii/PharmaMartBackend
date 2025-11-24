


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

export interface TransactionVerificationResponse{
    pidx:string,
    total_amount:number,
    status:TransactionStatus,
    transaction_id:string,
    fee:number,
    refunded:boolean
}

export enum TransactionStatus{
    Completed='Completed',
    Refunded='Refunded',
    Pending='Pending',
    Initiated='Initiated'
}