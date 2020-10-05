export class PrintConfiguration {
        name: string;
        address: string[];
        contactNumber: string;
        emailId: string;
        licenseNumbers: LicenseNumbers[];;
        termsAndConditions: string[];
        constructor(){
          this.address = [];
          this.licenseNumbers = [];
          this.termsAndConditions = [];
        }
}


export class LicenseNumbers{
    licenseName:string;
    licenseNumber: string;
  }
