import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
@Entity()
export class ErrorLogger {
  @PrimaryGeneratedColumn()
  errorloggerId: number;

  @Column("varchar", {
    nullable: true,
    length: 191
  })
  message: string;

  @Column("varchar", {
    nullable: true,
    length: 191
  })
  appName: string;

  @Column("longtext", {
    nullable: true
  })
  trace: string;

  @CreateDateColumn({ nullable: false, type: "timestamp" })
  createdAt: string;

  @UpdateDateColumn({ nullable: false, type: "timestamp" })
  updatedAt: string;

  @Column("timestamp", {
    nullable: true
  })
  deletedAt: string;
}
