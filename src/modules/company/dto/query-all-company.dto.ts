import { AllCompanysInput } from "../../../graphql.schema";
import { JwtPayload } from "../../../common/auth/interfaces/jwt-payload.interface";
export class AllCompanysDto extends AllCompanysInput {
  userRequestData?: JwtPayload;
}
