import { CompanyStaff } from "./../company-staff/company-staff.entity";
import "moment-timezone";
import {
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
import { Company } from "../company/company.entity";
import { Customer } from "../customer/customer.entity";
import { PhotoTypeEnum } from "./enums/photo.enum";

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  photoId: number;

  @Column("varchar", {
    nullable: false,
    length: 191,
  })
  url: string;

  @Column({ nullable: true })
  customerId: number;

  @Column({ nullable: true })
  companyStaffId: number;

  @Column({ nullable: true })
  companyId: number;

  @Column({
    nullable: true,
    type: "enum",
    enum: PhotoTypeEnum,
  })
  photoType: PhotoTypeEnum;

  @Column({ type: "boolean", default: false })
  isVerified: boolean;

  @CreateDateColumn({ nullable: true, type: "timestamp" })
  createdAt: string;

  @UpdateDateColumn({ nullable: true, type: "timestamp" })
  updatedAt: string;

  @DeleteDateColumn({ nullable: true, type: "timestamp", name: "deletedAt" })
  deletedAt: string;

  @ManyToOne((type) => Photo, (photo) => photo.customer, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "customerId" })
  customer: Customer;

  @ManyToOne((type) => Photo, (photo) => photo.company, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "companyId" })
  company: Company;

  @ManyToOne((type) => Photo, (photo) => photo.companyStaff, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "companyStaffId" })
  companyStaff: CompanyStaff;
}
