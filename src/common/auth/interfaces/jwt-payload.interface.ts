import { CompanyStaff } from "./../../../modules/company-staff/company-staff.entity";
import { Photo } from "./../../../modules/photo/photos.entity";
import { GenderEnum } from "../../emums/gender.enum";
import { PersonStatusEnum } from "../../emums/person-status.enum";
import { Company } from "./../../../modules/company/company.entity";
import { Customer } from "../../../modules/customer/customer.entity";
export interface JwtPayload {
  customer?: Customer;
  companyStaff?: CompanyStaff;
  role?: string;
  email?: string;
}
