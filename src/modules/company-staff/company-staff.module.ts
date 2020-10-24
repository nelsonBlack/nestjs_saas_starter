import { CommonsModule } from "./../../common/common.module";
import { SmsModule } from "../sms/sms.module";
import { Company } from "../company/company.entity";
import { CompanyModule } from "../company/company.module";
import { CompanyStaff } from "./company-staff.entity";
import { CompanyStaffService } from "./company-staff.service";
import { CompanyStaffResolvers } from "./company-staff.resolvers";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Photo } from "../photo/photos.entity";
@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyStaff, Company, Photo]),
    CompanyModule,
    SmsModule,
    CommonsModule,
  ],
  providers: [CompanyStaffService, CompanyStaffResolvers],
  exports: [CompanyStaffService],
})
export class CompanyStaffModule {}
