

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
    this.deliveryDetails = new DeliveryDetails();
    this.paymentDetails = new PaymentDetails();
    this.orderCharges = [];
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
    paymentType: string;
    paymentVerified: boolean;
    paymentVerifiedBy: string;
    verificationDate: Date;
    comments: string;
}

export class DeliveryDetails{
    deliveryType: string;
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