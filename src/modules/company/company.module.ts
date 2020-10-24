import { CompanyResolvers } from "./company.resolvers";
import { CompanyService } from "./company.service";
import { Company } from "./company.entity";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Photo } from "../photo/photos.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Company, Photo])],
  providers: [CompanyService, CompanyResolvers],
  exports: [CompanyService],
})
export class CompanyModule {}
