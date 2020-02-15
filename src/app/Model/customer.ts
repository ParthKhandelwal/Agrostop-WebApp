import { Address } from './address';
export interface Customer {

    id: string ;
    name: string;
    fatherName: string ;
    addressId: string;
    phoneNumber: string;
    landHolding: number;
    fullAddress?: Address;

}
