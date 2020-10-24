import { CompanyStaff } from "./../modules/company-staff/company-staff.entity";
import { Customer } from "./../modules/customer/customer.entity";
import { CustomerCreatedEmailTemplateService } from "./email-templates/customer-created-email.service";

import { Company } from "./../modules/company/company.entity";
import { UploadService } from "./upload/upload.service";
import { LoggerModule } from "./logger/logger.module";
import { TimeStampHelper } from "./helpers/timestamp.helper";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CompanyStaffCreatedEmailTemplateService } from "./email-templates/company-staff-created-email.service";
@Module({
  imports: [
    LoggerModule,
    TypeOrmModule.forFeature([CompanyStaff, Company, Customer]),
  ],
  providers: [
    UploadService,
    TimeStampHelper,
    CompanyStaffCreatedEmailTemplateService,
    CustomerCreatedEmailTemplateService,
  ],
  exports: [
    TimeStampHelper,
    CompanyStaffCreatedEmailTemplateService,
    CustomerCreatedEmailTemplateService,
  ],
})
export class CommonsModule {}
