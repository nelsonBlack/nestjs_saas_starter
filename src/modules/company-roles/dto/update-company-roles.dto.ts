import { UpdateCompanyStaffRoleInput } from "./../../../graphql.schema";

import { JwtPayload } from "./../../../common/auth/interfaces/jwt-payload.interface";
export class UpdateCompanyStaffRoleDto extends UpdateCompanyStaffRoleInput {
  userRequestData?: JwtPayload;
}
