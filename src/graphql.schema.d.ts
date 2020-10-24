
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export class CreateCompanyDepartmentInput {
    companyId?: number;
    name?: string;
    description?: string;
    status?: string;
    email?: string;
    emailNotifications?: string;
    phoneNo?: string;
    phoneNoNotifications?: string;
}

export class UpdateCompanyDepartmentInput {
    companyDepartmentId?: number;
    companyId?: number;
    name?: string;
    description?: string;
    status?: string;
    email?: string;
    emailNotifications?: string;
    phoneNo?: string;
    phoneNoNotifications?: string;
}

export class AllCompanyDepartmentsInput {
    companyDepartmentId?: number;
    limit?: number;
}

export class AllCompanyStaffRoleInput {
    companyStaffRoleId?: number;
    companyId?: number;
    limit?: number;
}

export class CreateCompanyStaffRoleInput {
    companyId?: number;
    status?: string;
    name?: string;
    displayName?: string;
}

export class UpdateCompanyStaffRoleInput {
    companyStaffRoleId: number;
    companyId?: number;
    status?: string;
    name?: string;
    displayName?: string;
}

export class CreateCompanyStaffInput {
    companyId?: number;
    firstName?: string;
    password?: string;
    middleName?: string;
    profilePhoto?: string;
    lastName?: string;
    email?: string;
    gender?: string;
    userName?: string;
    verifiedEmail?: boolean;
    verifiedPhoneNumber?: boolean;
    phone?: string;
    status?: string;
    base64Image?: string;
    role?: string;
}

export class UpdateCompanyStaffInput {
    companyStaffId: number;
    companyId?: number;
    firstName?: string;
    password?: string;
    middleName?: string;
    profilePhoto?: string;
    lastName?: string;
    email?: string;
    gender?: string;
    userName?: string;
    verifiedEmail?: boolean;
    verifiedPhoneNumber?: boolean;
    phone?: string;
    status?: string;
    base64Image?: string;
    role?: string;
}

export class CreateCompanyInput {
    name?: string;
    country?: string;
    route?: string;
    locality?: string;
    administrative_area_level_1?: string;
    status?: string;
    email?: string;
    emailNotifications?: string;
    headOffice?: string;
    phoneNo?: string;
    phoneNoNotifications?: string;
    isAllowManualPayments?: string;
    smsApiKey?: string;
    smsUserName?: string;
    startDate?: string;
    endDate?: string;
    position?: string;
    latitude?: number;
    longitude?: number;
    logo?: string;
    senderId?: string;
    payBillNumber?: string;
    registrationFee?: number;
    smsAmount?: number;
}

export class UpdateCompanyInput {
    companyId: number;
    name?: string;
    country?: string;
    route?: string;
    locality?: string;
    administrative_area_level_1?: string;
    status?: string;
    email?: string;
    emailNotifications?: string;
    headOffice?: string;
    phoneNo?: string;
    phoneNoNotifications?: string;
    isAllowManualPayments?: string;
    smsApiKey?: string;
    smsUserName?: string;
    startDate?: string;
    endDate?: string;
    position?: string;
    latitude?: number;
    longitude?: number;
    logo?: string;
    senderId?: string;
    payBillNumber?: string;
    registrationFee?: number;
    smsAmount?: number;
}

export class AllCompanysInput {
    companyId?: number;
    limit?: number;
}

export class AllCustomersInput {
    customerId?: number;
    companyId?: number;
    limit?: number;
}

export class CreateCustomerInput {
    companyId?: number;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    organizationId?: number;
    organizationDepartmentId?: number;
    base64Image?: string;
    email?: string;
    gender?: string;
    userName?: string;
    verifiedEmail?: string;
    verifiedPhoneNumber?: boolean;
    profilePhoto?: string;
    phone?: string;
    status?: string;
    role?: string;
    avatarUrl?: string;
    password?: string;
    rememberToken?: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
    token?: string;
}

export class UpdateCustomerInput {
    customerId: number;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    companyId?: number;
    organizationId?: number;
    organizationDepartmentId?: number;
    email?: string;
    gender?: string;
    userName?: string;
    verifiedEmail?: string;
    verifiedPhoneNumber?: boolean;
    lastLng?: number;
    lastLat?: number;
    profilePhoto?: string;
    phone?: string;
    status?: string;
    role?: string;
    password?: string;
    rememberToken?: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
    token?: string;
}

export abstract class IQuery {
    abstract allCompanyDepartments(allCompanyDepartmentsInput?: AllCompanyDepartmentsInput): CompanyDepartment[] | Promise<CompanyDepartment[]>;
    abstract companyDepartment(companyDepartmentId: number): CompanyDepartment | Promise<CompanyDepartment>;
    abstract allCompanyDepartmentStats(): CompanyDepartmentStats | Promise<CompanyDepartmentStats>;
    abstract allCompanyStaffRoles(allCompanyStaffRoleInput?: AllCompanyStaffRoleInput): CompanyStaffRole[] | Promise<CompanyStaffRole[]>;
    abstract companyStaffRole(companyStaffRoleId: number): CompanyStaffRole | Promise<CompanyStaffRole>;
    abstract companyStaffRoleStats(): CompanyStaffRoleStats | Promise<CompanyStaffRoleStats>;
    abstract allCompanyStaff(companyStaffId?: number, companyId?: number): CompanyStaff[] | Promise<CompanyStaff[]>;
    abstract companyStaff(companyStaffId: number): CompanyStaff | Promise<CompanyStaff>;
    abstract companyStaffStats(): CompanyStaffStats | Promise<CompanyStaffStats>;
    abstract allCompanys(allCompanysInput?: AllCompanysInput): Company[] | Promise<Company[]>;
    abstract company(companyId: number): Company | Promise<Company>;
    abstract allCompanysStats(): CompanyStats | Promise<CompanyStats>;
    abstract allCustomers(allCustomersInput?: AllCustomersInput): Customer[] | Promise<Customer[]>;
    abstract customer(customerId: number): Customer | Promise<Customer>;
    abstract customerStats(): CustomerStats | Promise<CustomerStats>;
}

export abstract class IMutation {
    abstract createCompanyDepartment(createCompanyDepartmentInput?: CreateCompanyDepartmentInput): CompanyDepartment | Promise<CompanyDepartment>;
    abstract updateCompanyDepartment(updateCompanyDepartmentInput?: UpdateCompanyDepartmentInput): CompanyDepartment | Promise<CompanyDepartment>;
    abstract softDeleteCompanyDepartment(companyDepartmentId: number): CompanyDepartment | Promise<CompanyDepartment>;
    abstract hardDeleteCompanyDepartment(companDepartmentyId: number): CompanyDepartment | Promise<CompanyDepartment>;
    abstract createCompanyStaffRole(createCompanyStaffRoleInput?: CreateCompanyStaffRoleInput): CompanyStaffRole | Promise<CompanyStaffRole>;
    abstract updateCompanyStaffRole(updateCompanyStaffRoleInput?: UpdateCompanyStaffRoleInput): CompanyStaffRole | Promise<CompanyStaffRole>;
    abstract softDeleteCompanyStaffRole(companyStaffRoleId: number): CompanyStaffRole | Promise<CompanyStaffRole>;
    abstract hardDeleteCompanyStaffRole(companyStaffRoleId: number): CompanyStaffRole | Promise<CompanyStaffRole>;
    abstract generateSuperAdminJWT(companyStaffId?: number, companyId?: number): string | Promise<string>;
    abstract changePassword(newPassword?: string, oldPassword?: string, email?: string): CompanyStaff | Promise<CompanyStaff>;
    abstract requestResetPassword(newPassword?: string, email?: string): CompanyStaff | Promise<CompanyStaff>;
    abstract login(email?: string, password?: string): CompanyStaff | Promise<CompanyStaff>;
    abstract createCompanyStaff(createCompanyStaffInput?: CreateCompanyStaffInput): CompanyStaff | Promise<CompanyStaff>;
    abstract updateCompanyStaff(updateCompanyStaffInput?: UpdateCompanyStaffInput): CompanyStaff | Promise<CompanyStaff>;
    abstract softDeleteCompanyStaff(companyStaffId: number): CompanyStaff | Promise<CompanyStaff>;
    abstract hardDeleteCompanyStaff(companyStaffId: number): CompanyStaff | Promise<CompanyStaff>;
    abstract createCompany(createCompanyInput?: CreateCompanyInput): Company | Promise<Company>;
    abstract updateCompany(updateCompanyInput?: UpdateCompanyInput): Company | Promise<Company>;
    abstract softDeleteCompany(companyId: number): Company | Promise<Company>;
    abstract hardDeleteCompany(companyId: number): Company | Promise<Company>;
    abstract changeCustomerPassword(newPassword?: string, oldPassword?: string, email?: string): Customer | Promise<Customer>;
    abstract requestResetCustomerPassword(newPassword?: string, email?: string): Customer | Promise<Customer>;
    abstract loginCustomer(email?: string, password?: string): Customer | Promise<Customer>;
    abstract createCustomer(createCustomerInput?: CreateCustomerInput): Customer | Promise<Customer>;
    abstract updateCustomer(updateCustomerInput?: UpdateCustomerInput): Customer | Promise<Customer>;
    abstract softDeleteCustomer(customerId: number): Customer | Promise<Customer>;
    abstract hardDeleteCustomer(customerId: number): Customer | Promise<Customer>;
}

export abstract class ISubscription {
    abstract companyDepartmentCreated(companyDepartmentId?: number): CompanyDepartment | Promise<CompanyDepartment>;
    abstract companyDepartmentSoftDeleted(companyDepartmentId?: number): CompanyDepartment | Promise<CompanyDepartment>;
    abstract companyDepartmentUpdated(companyDepartmentId?: number): CompanyDepartment | Promise<CompanyDepartment>;
    abstract companyDepartmentHardDeleted(companyDepartmentId?: number): CompanyDepartment | Promise<CompanyDepartment>;
    abstract companyStaffRoleCreated(companyId?: number): CompanyStaffRole | Promise<CompanyStaffRole>;
    abstract companyStaffRoleSoftDeleted(companyId?: number): CompanyStaffRole | Promise<CompanyStaffRole>;
    abstract companyStaffRoleUpdated(companyId?: number): CompanyStaffRole | Promise<CompanyStaffRole>;
    abstract companyStaffRoleHardDeleted(companyId?: number): CompanyStaffRole | Promise<CompanyStaffRole>;
    abstract companyStaffCreated(companyId?: number): CompanyStaff | Promise<CompanyStaff>;
    abstract companyStaffSoftDeleted(companyId?: number): CompanyStaff | Promise<CompanyStaff>;
    abstract companyStaffUpdated(companyId?: number): CompanyStaff | Promise<CompanyStaff>;
    abstract companyStaffHardDeleted(companyId?: number): CompanyStaff | Promise<CompanyStaff>;
    abstract companyCreated(companyId?: number): Company | Promise<Company>;
    abstract companySoftDeleted(companyId?: number): Company | Promise<Company>;
    abstract companyUpdated(companyId?: number): Company | Promise<Company>;
    abstract companyHardDeleted(companyId?: number): Company | Promise<Company>;
    abstract customerCreated(companyId?: number): Customer | Promise<Customer>;
    abstract customerSoftDeleted(companyId?: number): Customer | Promise<Customer>;
    abstract customerUpdated(companyId?: number): Customer | Promise<Customer>;
    abstract customerHardDeleted(companyId?: number): Customer | Promise<Customer>;
}

export class CompanyDepartment {
    companyDepartmentId?: number;
    companyId?: number;
    name?: string;
    description?: string;
    status?: string;
    email?: string;
    emailNotifications?: string;
    phoneNo?: string;
    phoneNoNotifications?: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
    company?: Company;
    companyStaff?: CompanyStaff[];
}

export class CompanyDepartmentStats {
    total?: number;
    totalActive?: number;
    totalInactive?: number;
}

export class CompanyStaffRole {
    companyStaffRoleId?: number;
    companyId?: number;
    status?: string;
    name?: string;
    displayName?: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
    company?: Company;
    companyStaffs?: CompanyStaff;
}

export class CompanyStaffRoleStats {
    total?: number;
}

export class CompanyStaff {
    companyStaffId?: number;
    companyId?: number;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    email?: string;
    gender?: string;
    userName?: string;
    verifiedEmail?: boolean;
    verifiedPhoneNumber?: boolean;
    profilePhoto?: string;
    phone?: string;
    status?: string;
    role?: string;
    avatarUrl?: string;
    password?: string;
    rememberToken?: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
    company?: Company;
    token?: string;
}

export class CompanyStaffStats {
    total?: number;
    totalMeterReader?: number;
    totalItManager?: number;
    totalAccountant?: number;
    totalManager?: number;
    totalStaff?: number;
    totalActive?: number;
    totalInactive?: number;
    totalSecretary?: number;
    totalSoftDeleted?: number;
}

export class Company {
    companyId?: number;
    name?: string;
    country?: string;
    route?: string;
    locality?: string;
    administrative_area_level_1?: string;
    status?: string;
    email?: string;
    emailNotifications?: string;
    headOffice?: string;
    phoneNo?: string;
    phoneNoNotifications?: string;
    isAllowManualPayments?: string;
    smsApiKey?: string;
    smsUserName?: string;
    startDate?: string;
    endDate?: string;
    position?: string;
    latitude?: number;
    longitude?: number;
    logo?: string;
    senderId?: string;
    payBillNumber?: string;
    registrationFee?: number;
    smsAmount?: number;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
    companyStaff?: CompanyStaff[];
}

export class CompanyStats {
    total?: number;
    totalActive?: number;
    totalInactive?: number;
    totalMeters?: number;
    totalSoftDeleted?: number;
}

export class Customer {
    customerId?: number;
    companyId?: number;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    organizationId?: number;
    organizationDepartmentId?: number;
    email?: string;
    gender?: string;
    userName?: string;
    verifiedEmail?: string;
    otpCode?: string;
    verifiedPhoneNumber?: boolean;
    profilePhoto?: string;
    lastLng?: number;
    lastLat?: number;
    phone?: string;
    status?: string;
    role?: string;
    avatarUrl?: string;
    password?: string;
    rememberToken?: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
    company?: Company;
    token?: string;
    photo?: Photo[];
}

export class CustomerStats {
    total?: number;
    totalActive?: number;
    totalInactive?: number;
}

export class Photo {
    photoId?: number;
    url?: string;
    customerId?: number;
    companyStaffId?: number;
    companyId?: number;
    photoType?: string;
    isVerified?: boolean;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
    customer?: Customer;
    company?: Company;
    companyStaff?: CompanyStaff;
}

export class SmsResult {
    smsResultId?: number;
    cost?: string;
    messageId?: string;
    smsType?: string;
    messageParts?: number;
    number?: string;
    status?: string;
    statusCode?: number;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
}
