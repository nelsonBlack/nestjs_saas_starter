export class ResetPassword {
  customerId?: number;
  companyStaffId?: number;
  companyId?: number;
  phoneNo?: string;
  email?: string;
}

export class OtpResetPassword {
  otpCode?: string;
  phoneNo?: string;
  password?: string;
}

export class ChangePassword {
  companyStaffId?: number;
  newPassword?: string;
  oldPassword?: string;
  companyId: number;
  email?: string;
}
