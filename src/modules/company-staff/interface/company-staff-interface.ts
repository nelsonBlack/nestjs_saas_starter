import { CompanyStaff } from "./../../../graphql.schema";
export interface CompanyStaffData extends CompanyStaff {
  token?: any;
  password?: string;
}

export interface CompanyStaffRO {
  companyStaff: CompanyStaffData;
}
