import { CreateCompanyStaffRoleInput } from "./../../../graphql.schema";
import { JwtPayload } from "./../../../common/auth/interfaces/jwt-payload.interface";
export class CreateCompanyStaffRoleDto extends CreateCompanyStaffRoleInput {
  userRequestData?: JwtPayload;
}
