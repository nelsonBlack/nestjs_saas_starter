import { CreateCompanyStaffInput } from './../../../graphql.schema';
import { JwtPayload } from './../../../common/auth/interfaces/jwt-payload.interface';
export class CreateCompanyStaffDto extends CreateCompanyStaffInput {
  password:string;
  userRequestData?: JwtPayload;
 
}