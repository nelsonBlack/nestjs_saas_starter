export class SendSmsDto {
   companyName:string;
   token:string;
   to:string[];
   from:string;
   enque:boolean;
   meterId:string;
   amountPaid:String
   pricePerUnit:String;
   units:string;
   totalPaid:string;
   tokenAmount:string;
  }

  export class SendLoginSmsDto{
      password:string;
      email:string;
      firstName:string;
      lastName:string;
      phoneNumber: string;
      companyName:string;
      
  }
  