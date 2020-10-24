import { JwtPayload } from "./../../../common/auth/interfaces/jwt-payload.interface";
import { CreateCompanyDepartmentInput } from "./../../../graphql.schema";
export class CreateCompanyDepartmentDto extends CreateCompanyDepartmentInput {
  userRequestData?: JwtPayload;
}
