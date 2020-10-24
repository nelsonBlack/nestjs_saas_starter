import { Company } from "./../company/company.entity";
import { SmsTypeEnum } from "./enums/sms.enums";
import {
  Index,
  Entity,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  Column,
  OneToOne,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
  BeforeInsert,
  CreateDateColumn,
  VersionColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class SmsResult {
  @PrimaryGeneratedColumn()
  smsResultId: number;

  @Column({ nullable: true })
  companyId: number;

  @Column("varchar", {
    nullable: true,
    length: 191,
  })
  cost: string;

  @Column("varchar", {
    nullable: true,
    length: 191,
  })
  messageId: string;

  @Column("varchar", {
    nullable: true,
    length: 191,
  })
  number: string;

  @Column("varchar", {
    nullable: true,
    length: 191,
  })
  status: string;

  @Column({
    nullable: true,
  })
  statusCode: number;

  @Column({
    nullable: true,
  })
  messageParts: number;

  @Column({
    nullable: true,
    type: "enum",
    enum: SmsTypeEnum,
  })
  smsType: SmsTypeEnum;

  @CreateDateColumn({ nullable: false, type: "timestamp" })
  createdAt: string;

  @UpdateDateColumn({ nullable: false, type: "timestamp" })
  updatedAt: string;

  @Column("timestamp", {
    nullable: true,
  })
  deletedAt: string;

  @ManyToOne((type) => Company, (company) => company.smsResults, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "companyId" })
  company: Company;
}
