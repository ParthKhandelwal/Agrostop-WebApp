

export class Order {
id: string;
customerId: string;
dateOfCreation: Date;
itemList: OrderItem[];
orderCharges: OrderCharge[];
voucherId: string;
deliveryDetails: DeliveryDetails;
paymentDetails: PaymentDetails;

constructor(){
    this.itemList = [];
}
}

export class OrderItem{
    item: string;
    qty: number;
    rate: number;
    constructor(){}
}

export class OrderCharge{
    type: string;
    amount: number;
}

export class PaymentDetails{
    paymentType: PaymentType;
    paymentVerified: boolean;
    paymentVerifiedBy: string;
    verificationDate: Date;
    comments: string;
}

export class DeliveryDetails{
    deliveryType: DeliveryType;
    address: string;
    expectedBy: Date;
    delivered: boolean;
    deliveryBy: string;
    comments: string;
}

enum DeliveryType{
    HOMEDELIVERY,
    STOREPICKUP
}

enum PaymentType{
    ONLINEPAYMENT,
    PAYATSTORE,
    CASHONDELIVERY
}