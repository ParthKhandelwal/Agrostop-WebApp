export class ProductProfile {
    name: string;
    productGroup: string;
    unitConversion: number;
    mrp: number;
    price: number;
    cgstRate: number;
    sgstRate: number;
    igstRate: number;
    disable: boolean;
    defaultSalesLedger: boolean;
    defaultPurchaseLedger: boolean;
    unit: string;
    loyaltyPointDetailList: LoyaltyPointDetail[];

    constructor(){
        this.loyaltyPointDetailList = [];
    }
    
}

export class LoyaltyPointDetail{
    startingDate: Date;
    endingDate: Date;
    points: number;
}