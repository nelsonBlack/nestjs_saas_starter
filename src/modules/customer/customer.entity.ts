import { Photo } from "./../photo/photos.entity";

import { GenderEnum } from "./../../common/emums/gender.enum";
import { PersonStatusEnum } from "./../../common/emums/person-status.enum";
import { CustomerRoleEnum } from "./enums/customer.enum";

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
  OneToMany,
  BeforeUpdate,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";

import { Exclude } from "class-transformer/decorators";
import * as bcrypt from "bcryptjs";
import { IsEmail } from "class-validator";
@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  customerId: number;

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

  @Column("varchar", {
    nullable: true,
    length: 191,
  })
  userName: string;

  @Column("varchar", {
    nullable: true,
  })
  otpCode: string;

  @Column({ type: "boolean", default: false })
  verifiedEmail: boolean;

  @Column({ type: "boolean", default: false })
  verifiedPhoneNumber: boolean;

  @Column({ type: "text" })
  profilePhoto: string;

  @Column({ type: "double precision", default: 0, nullable: true })
  lastLng: number;

  @Column({ type: "double precision", default: 0, nullable: true })
  lastLat: number;

  @Column("varchar", {
    nullable: true,
    length: 191,
  })
  phone: string;

  @Column({
    nullable: true,
    type: "enum",
    enum: PersonStatusEnum,
    default: PersonStatusEnum.Active,
  })
  status: PersonStatusEnum;

  @OneToMany((type) => Photo, (photo) => photo.customer)
  photos: Photo[];

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
    enum: CustomerRoleEnum,
  })
  role: CustomerRoleEnum;

  @CreateDateColumn({ nullable: true, type: "timestamp" })
  createdAt: string;

  @UpdateDateColumn({ nullable: true, type: "timestamp" })
  updatedAt: string;

  @DeleteDateColumn({ nullable: true, type: "timestamp", name: "deletedAt" })
  deletedAt: string;
}
