import { AllCustomersInput } from "./../../../graphql.schema";
import { JwtPayload } from "./../../../common/auth/interfaces/jwt-payload.interface";
export class AllCustomersDto extends AllCustomersInput {
  userRequestData?: JwtPayload;
}
