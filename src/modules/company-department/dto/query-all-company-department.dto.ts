import { AllCompanyDepartmentsInput } from "./../../../graphql.schema";
import { JwtPayload } from "./../../../common/auth/interfaces/jwt-payload.interface";
export class AllCompanyDepartmentsDto extends AllCompanyDepartmentsInput {
  userRequestData?: JwtPayload;
}
