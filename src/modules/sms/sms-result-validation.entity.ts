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
import * as crypto from "crypto";
import { IsEmail, Validate } from "class-validator";
@Entity()
export class SmsValidationResult {
  @PrimaryGeneratedColumn()
  smsValidationResultId: number;

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
}
