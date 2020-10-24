import { DepartmentStatus } from "./../../common/emums/department-status.enum";

import { Company } from "../company/company.entity";
import { CompanyStaff } from "../company-staff/company-staff.entity";
import "moment-timezone";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import { IsEmail, IsOptional } from "class-validator";
@Entity()
export class CompanyDepartment {
  @PrimaryGeneratedColumn()
  companyDepartmentId: number;

  @Column({ nullable: true })
  companyId: number;

  @Column("varchar", {
    nullable: true,
    length: 191,
  })
  name: string;

  @Column("varchar", {
    nullable: true,
    length: 191,
  })
  description: string;

  @Column({
    nullable: true,
    type: "enum",
    enum: DepartmentStatus,
    default: DepartmentStatus.Active,
  })
  status: DepartmentStatus;

  @Column("varchar", {
    nullable: true,
    length: 191,
  })
  @IsOptional()
  @IsEmail()
  email: string;

  @Column("varchar", {
    nullable: true,
    length: 191,
  })
  @IsOptional()
  @IsEmail()
  emailNotifications: string;

  @Column("varchar", {
    nullable: true,
  })
  phoneNo: string;

  @Column("varchar", {
    nullable: true,
  })
  phoneNoNotifications: string;

  @ManyToOne((type) => Company, (company) => company.companyDepartments, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "companyId" })
  company: Company;

  @OneToMany((type) => CompanyStaff, (companyStaff) => companyStaff.company)
  companyStaff: CompanyStaff[];

  @CreateDateColumn({ nullable: true, type: "timestamp" })
  createdAt: string;

  @UpdateDateColumn({ nullable: true, type: "timestamp" })
  updatedAt: string;

  @DeleteDateColumn({ nullable: true, type: "timestamp", name: "deletedAt" })
  deletedAt: string;
}
