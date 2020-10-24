import { CompanyStaff } from "../company-staff/company-staff.entity";
import { CompanyRoleStatusEnum } from "./enums/company-roles.enums";
import { Company } from "../company/company.entity";
import * as moment from "moment";
import "moment-timezone";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";

@Entity()
export class CompanyStaffRole {
  @PrimaryGeneratedColumn()
  companyStaffRoleId: number;

  @Column({ nullable: true })
  companyId: number;

  @Column({
    nullable: true,
    type: "enum",
    enum: CompanyRoleStatusEnum,
  })
  status: CompanyRoleStatusEnum;

  @Column("varchar", {
    nullable: true,
  })
  name: string;

  @Column("varchar", {
    nullable: true,
  })
  displayName: string;

  @CreateDateColumn({ nullable: true, type: "timestamp" })
  createdAt: string;

  @UpdateDateColumn({ nullable: true, type: "timestamp" })
  updatedAt: string;

  @DeleteDateColumn({ nullable: true, type: "timestamp", name: "deletedAt" })
  public deletedAt: string;

  @ManyToOne((type) => Company, (company) => company.companyStaffRoles, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "companyId" })
  company: Company;

  @ManyToMany(
    (type) => CompanyStaff,
    (companyStaff) => companyStaff.companyStaffRoles
  )
  @JoinTable()
  companyStaffs: CompanyStaff[];
}
