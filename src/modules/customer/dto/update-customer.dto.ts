import { JwtPayload } from "./../../../common/auth/interfaces/jwt-payload.interface";

import { UpdateCustomerInput } from "../../../graphql.schema";
export class UpdateCustomerDto extends UpdateCustomerInput {
  userRequestData?: JwtPayload;
}
