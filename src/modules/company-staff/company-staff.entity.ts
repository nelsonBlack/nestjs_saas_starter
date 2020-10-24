import { GenderEnum } from "./../../common/emums/gender.enum";
import { PersonStatusEnum } from "./../../common/emums/person-status.enum";

import { CompanyStaffRole } from "../company-roles/company-roles.entity";
import { Company } from "../company/company.entity";
import "moment-timezone";
import {
  Index,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  BeforeUpdate,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from "typeorm";
import * as bcrypt from "bcryptjs";
import { CompanyStaffRoleEnum } from "./enums/company-staff.enum";
import { Exclude } from "class-transformer/decorators";
import { IsEmail, IsString } from "class-validator";
import { Photo } from "../photo/photos.entity";
@Entity()
export class CompanyStaff {
  @PrimaryGeneratedColumn()
  companyStaffId: number;

  @Column("varchar", {
    nullable: false,
    length: 191,
  })
  firstName: string;

  @Column("varchar", {
    nullable: false,
    length: 191,
  })
  middleName: string;

  @Column("varchar", {
    nullable: false,
    length: 191,
  })
  lastName: string;

  @Column({ nullable: true })
  companyId: number;

  @Column("varchar", {
    nullable: false,
    length: 191,
  })
  @IsEmail()
  email: string;

  @Column({
    nullable: true,
    type: "enum",
    enum: GenderEnum,
  })
  gender: GenderEnum;

  @Column({ type: "text" })
  profilePhoto: string;

  @Column("varchar", {
    nullable: true,
    length: 191,
  })
  @IsString()
  userName: string;

  @Column({ type: "boolean", default: false })
  verifiedEmail: boolean;

  @Column({ type: "boolean", default: false })
  verifiedPhoneNumber: boolean;

  @Column("varchar", {
    nullable: true,
    length: 191,
  })
  phone: string;

  @Column("varchar", {
    nullable: true,
  })
  otpCode: string;

  @Column({
    nullable: true,
    type: "enum",
    enum: PersonStatusEnum,
    default: PersonStatusEnum.Active,
  })
  status: PersonStatusEnum;

  @Exclude()
  @Column("varchar", {
    select: false,
    nullable: true,
    length: 128,
  })
  password: string;
  @BeforeUpdate()
  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  @Column("varchar", {
    nullable: true,
    length: 191,
  })
  rememberToken: string;

  @Column({
    nullable: true,
    type: "enum",
    enum: CompanyStaffRoleEnum,
    default: CompanyStaffRoleEnum.Staff,
  })
  role: CompanyStaffRoleEnum;

  @OneToMany((type) => Photo, (photo) => photo.companyStaff)
  photos: Photo[];

  @CreateDateColumn({ nullable: true, type: "timestamp" })
  createdAt: string;

  @UpdateDateColumn({ nullable: true, type: "timestamp" })
  updatedAt: string;

  @DeleteDateColumn({ nullable: true, type: "timestamp", name: "deletedAt" })
  deletedAt: string;

  @ManyToOne((type) => Company, (company) => company.companyStaff, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "companyId" })
  company: Company;

  @ManyToMany(
    (type) => CompanyStaffRole,
    (companyStaffRole) => companyStaffRole.companyStaffs
  )
  companyStaffRoles: CompanyStaffRole[];
}
