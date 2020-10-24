import { CompanyDepartment } from "./company-department.entity";
import { CompanyDepartmentService } from "./company-department.service";
import { CompanyDepartmentResolvers } from "./company-department.resolvers";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Photo } from "../photo/photos.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CompanyDepartment, Photo])],
  providers: [CompanyDepartmentService, CompanyDepartmentResolvers],
  exports: [CompanyDepartmentService],
})
export class CompanyDepartmentModule {}
