import { CompanyStaffRoleResolvers } from "./company-roles.resolvers";
import { CompanyStaffRole } from "./company-roles.entity";
import { CompanyStaffRoleService } from "./company-roles.service";
import { CompanyStaffService } from "../company-staff/company-staff.service";
import { Company } from "../company/company.entity";
import { CompanyModule } from "../company/company.module";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forFeature([Company, CompanyStaffRole]),
    CompanyModule,
  ],
  providers: [CompanyStaffService, CompanyStaffRoleResolvers],
  exports: [CompanyStaffRoleService],
})
export class CompanyStaffRoleModule {}
