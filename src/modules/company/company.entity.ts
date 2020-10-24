import { Customer } from "./../customer/customer.entity";
import { CompanyDepartment } from "./../company-department/company-department.entity";
import { CompanyStaffRole } from "./../company-roles/company-roles.entity";
import { SmsResult } from "./../sms/sms-result.entity";
import { CompanyStaff } from "../company-staff/company-staff.entity";
import { CompanyStatus, AllowManualPayments } from "./enums/company-enums";
import "moment-timezone";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import { IsEmail, IsOptional } from "class-validator";
@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  companyId: number;

  @Column({
    nullable: true,
    type: "enum",
    enum: CompanyStatus,
    default: CompanyStatus.Testing,
  })
  status: CompanyStatus;

  @Column({
    nullable: true,
    type: "enum",
    enum: AllowManualPayments,
    default: AllowManualPayments.No,
  })
  isAllowManualPayments: AllowManualPayments;

  @Column("varchar", {
    nullable: true,
  })
  name: string;

  @Column("varchar", {
    nullable: true,
  })
  country: string;

  @Column("varchar", {
    nullable: true,
  })
  route: string;

  @Column("varchar", {
    nullable: true,
  })
  locality: string;

  @Column("varchar", {
    nullable: true,
  })
  smsApiKey: string;

  @Column("varchar", {
    nullable: true,
  })
  smsUserName: string;

  @Column("varchar", {
    nullable: true,
  })
  senderId: string;

  @Column("varchar", {
    nullable: true,
  })
  administrative_area_level_1: string;

  @Column("varchar", {
    nullable: true,
  })
  @IsOptional()
  @IsEmail()
  email: string;

  @Column("varchar", {
    nullable: true,
  })
  businessPermitNumber: string;

  @Column("varchar", {
    nullable: true,
  })
  businessPermitUrl: string;

  @Column("varchar", {
    nullable: true,
  })
  @IsOptional()
  @IsEmail()
  emailNotifications: string;

  @Column({ nullable: true })
  headOffice: string;

  @Column("varchar", {
    nullable: true,
  })
  phoneNo: string;

  @Column("varchar", {
    nullable: true,
  })
  phoneNoNotifications: string;

  @Column("datetime", { nullable: true })
  startDate: string;

  @Column("datetime", { nullable: true })
  endDate: string;

  @Column("varchar", {
    nullable: true,
  })
  logo: string;

  @Column("varchar", {
    nullable: true,
  })
  payBillNumber: string;

  @Column("decimal", { nullable: true, precision: 15, scale: 2 })
  registrationFee: number;

  @Column("decimal", { nullable: true, precision: 15, scale: 2 })
  smsAmount: number;

  @Column({ type: "point", nullable: true })
  position: string;

  @Column({ type: "float", precision: 10, scale: 6, nullable: true })
  latitude: number;

  @Column({ type: "float", precision: 10, scale: 6, nullable: true })
  longitude: number;

  @OneToMany((type) => CompanyStaff, (companyStaff) => companyStaff.company)
  companyStaff: CompanyStaff[];

  @OneToMany(
    (type) => CompanyDepartment,
    (companyDepartment) => companyDepartment.company
  )
  companyDepartments: CompanyDepartment[];

  @OneToMany((type) => SmsResult, (smsResult) => smsResult.company)
  smsResults: SmsResult[];

  @OneToMany(
    (type) => CompanyStaffRole,
    (companyStaffRole) => companyStaffRole.company
  )
  companyStaffRoles: CompanyStaffRole[];

  @CreateDateColumn({ nullable: true, type: "timestamp" })
  createdAt: string;

  @UpdateDateColumn({ nullable: true, type: "timestamp" })
  updatedAt: string;

  @DeleteDateColumn({ nullable: true, type: "timestamp", name: "deletedAt" })
  deletedAt: string;
}
