import { CreateCustomerInput } from "./../../../graphql.schema";
import { JwtPayload } from "./../../../common/auth/interfaces/jwt-payload.interface";
export class CreateCustomerDto extends CreateCustomerInput {
  password: string;
  userRequestData?: JwtPayload;
}
