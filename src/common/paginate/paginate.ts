import { JwtPayload } from "./../auth/interfaces/jwt-payload.interface";

export class PaginateCompanyParams {
  companyId?: number;
  limit?: number;
  userRequestData?: JwtPayload;
}

export class PaginateCompanyStaffParams {
  companyId?: number;
  companyStaffId?: number;
  limit?: number;
  userRequestData?: JwtPayload;
}
