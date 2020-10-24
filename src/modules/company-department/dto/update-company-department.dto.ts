import { UpdateCompanyDepartmentInput } from "./../../../graphql.schema";

import { JwtPayload } from "../../../common/auth/interfaces/jwt-payload.interface";
export class UpdateCompanyDepartmentDto extends UpdateCompanyDepartmentInput {
  userRequestData?: JwtPayload;
}
