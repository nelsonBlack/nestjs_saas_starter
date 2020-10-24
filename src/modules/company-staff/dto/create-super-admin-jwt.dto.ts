import { JwtPayload } from "./../../../common/auth/interfaces/jwt-payload.interface";

import { IsNotEmpty } from "class-validator";
export class CreateSuperAdminJWTDto {
  @IsNotEmpty()
  companyStaffId: number;
  @IsNotEmpty()
  companyId: number;
  userRequestData?: JwtPayload;
}
