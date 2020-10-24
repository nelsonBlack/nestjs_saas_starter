import { JwtPayload } from "./../../../common/auth/interfaces/jwt-payload.interface";

import { UpdateCompanyStaffInput } from "../../../graphql.schema";
export class UpdateCompanyStaffDto extends UpdateCompanyStaffInput {
  userRequestData?: JwtPayload;
}
