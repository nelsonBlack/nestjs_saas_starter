export const COMPANY_EXCEPTIONS = {
  notExist: `Sorry, the Company does not exist in the system`,
  notExistUpdate: `Sorry, the Company you are trying to update does not exist`,
  existsName: `Sorry, the Company name you are trying to add exists. Company Name must be unique`,
  existsEmail: `Sorry, the Company emai you are trying to add exists. Company Name must be unique`,
  existsNameEmail: `Sorry, the Company name and email you are trying to add exist. Company Name and Email must be unique`,
  invalidData: `Sorry, Company data is invalid. `,
};

export const COMPANY_STAFF_EXCEPTIONS = {
  otpMismatch:
    "Otp code entered was wrong. Please enter correct code or request another code",
  notExist: `Sorry, the Staff does not exist in the system`,
  passwordMisMatch: `Password entered is incorrect, please confirm that its correct or contact Company Admin`,
  incorrectLoginData: `Login email or password is incorrect`,
  notExistUpdate: `Sorry, the Company Staff you are trying to update does not exist`,
  existsEmail: `Sorry, the email has already been taken`,
  invalidData: `Sorry, Company Staff data is invalid.`,
  userNotFound: `Sorry, User with the credentials not found in the system. Contact Company Admin`,
};

export const ROLES_EXCEPTIONS = {
  notExist: `Sorry, Role does not exist in the system`,
  notExistUpdate: `Sorry, the Role you are trying to update does not exist`,
  existsName: `Sorry, the Role name you are trying to add exists. Role name must be unique`,
  existsDisplayName: `Sorry, the Role display name you are trying to add exists. Role display name must be unique`,
  invalidData: `Sorry, Role data is invalid.`,
  userNotFound: `Sorry, Role was not found in the system. Contact Company Admin`,
};

export const COMPANY_DEPARTMENT_EXCEPTIONS = {
  notExist: `Sorry, the Company Department does not exist in the system`,
  notExistUpdate: `Sorry, the Company Department you are trying to update does not exist`,
  existsName: `Sorry, the Company Department name you are trying to add exists. Company Department name must be unique`,
  invalidData: `Sorry, Company Department data is invalid.`,
  userNotFound: `Sorry, Company Department was not found in the system. Contact Company Admin`,
};

export const CUSTOMER_EXCEPTIONS = {
  otpMismatch:
    "Otp code entered was wrong. Please enter correct code or request another code",
  notExist: `Sorry, the User does not exist in the system`,
  passwordMisMatch: `Password entered is incorrect, please confirm that its correct or contact Company Admin`,
  incorrectLoginData: `Login email or password is incorrect`,
  existsEmail: `Sorry, User with that email already exists in the system, email must be unique.`,
  existsPhone: `Sorry, User with that Phone number already exists in the system, Phone number must be unique.`,
  notExistUpdate: `Sorry, the User you are trying to update does not exist`,
  invalidData: `Sorry, User data is invalid.`,
  userNotFound: `Sorry, User with the credentials not found in the system. Contact Company Admin`,
};

export const WEBSOCKET_EXCEPTIONS = {
  invalidCred: `wrong token provided`,
};
