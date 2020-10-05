export class ProductProfile {
    name: string;
    productGroup: string;
    unitConversion: number;
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