export class TimePeriod{
    from:Date;
    to:Date;
    constructor(from:Date, to:Date){
        this.from = from;
        this.to = to;
    }
}

export class VoucherDisplay{
    id:string;
    address:string[];
    date: Date;
    ledgers: string[];
    total: number;
    vouchernumber: string;
    voucherparenttype: string;
    vouchertypename: string;
    classname:string;
}

export class VoucherFilter{
    from: Date = new Date();
    to: Date = new Date();
    customerId: string;
    addressId: string;
    voucherTypeId: string;
    inventoryId: string;
    ledgerId: string;

    constructor(){
    }
}