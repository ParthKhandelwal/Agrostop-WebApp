

export class Order {
id: string;
customerId: string;
dateOfCreation: Date;
itemList: OrderItem[];
isCompleted: boolean;
dateOfCompletion: Date;
dateOfDelivery: Date;
voucherId: string;
employeeId: string;
isReady: boolean;
placeOfSupply: string

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
