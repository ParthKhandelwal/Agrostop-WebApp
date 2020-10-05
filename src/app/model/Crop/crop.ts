export class Crop {
  id: string;
  name: string;
  varieties: CropVariety[];

  constructor(){
    this.varieties = [];
  }

}


export class CropVariety{
  name: string;
  narration: string;
}
