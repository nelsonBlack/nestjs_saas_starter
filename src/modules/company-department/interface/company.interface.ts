export interface CompanyData {
  companyId?: number;
  name: string;
  country: string;
  route?: string;
  locality?: string;
  administrative_area_level_1?: string;
  status: any;
  email: string;
  headOffice: string;
  startDate: string;
  endDate: string;
  phoneNo: string;
  isCustomerRead: string;
  readingDays: number;
  deadline:number;
  readingRadius: number;
  position?: string;
  logo: string;
  senderId: string;
  payBillNumber: string;
  waterPricePerUnit: number;
  registrationFee: number;
  smsAmount: number;
  lowerBoundUnits?: number;
  upperBoundUnits?: number;
  deletedAt?: string;
}

export interface CompanyRO {
  company: CompanyData;
}
