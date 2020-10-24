import { UpdateCompanyInput } from "../../../graphql.schema";
import { IsNotEmpty } from "class-validator";
import { JwtPayload } from "../../../common/auth/interfaces/jwt-payload.interface";
export class UpdateCompanyDto extends UpdateCompanyInput {
  userRequestData?: JwtPayload;
}
