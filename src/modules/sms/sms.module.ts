import { CompanyModule } from "./../company/company.module";
import { Company } from "./../company/company.entity";
import { SmsResult } from "./sms-result.entity";
import { SmsValidationResult } from "./sms-result-validation.entity";
import { SmsService } from "./sms.service";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
@Module({
  imports: [
    TypeOrmModule.forFeature([Company, SmsResult, SmsValidationResult]),
    CompanyModule,
  ],
  providers: [SmsService],
  exports: [SmsService],
})
export class SmsModule {}
