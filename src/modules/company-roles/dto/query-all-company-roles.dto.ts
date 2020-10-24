import { AllCompanyStaffRoleInput } from "./../../../graphql.schema";

import { JwtPayload } from "./../../../common/auth/interfaces/jwt-payload.interface";
export class QueryAllCompanyStaffRolesDto extends AllCompanyStaffRoleInput {
  userRequestData?: JwtPayload;
}
