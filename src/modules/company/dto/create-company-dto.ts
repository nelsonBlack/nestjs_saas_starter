import { JwtPayload } from "../../../common/auth/interfaces/jwt-payload.interface";
import { CreateCompanyInput } from "../../../graphql.schema";
export class CreateCompanyDto extends CreateCompanyInput {
  userRequestData?: JwtPayload;
}
