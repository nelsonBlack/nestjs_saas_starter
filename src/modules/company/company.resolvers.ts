import { AllCompanysDto } from "./dto/query-all-company.dto";
import { JwtAuthGuard } from "../../common/auth/jwt-auth.guard";
import { USER_ROLES } from "../../common/emums/user-roles.enums";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/guards/roles.decorator";
import { UpdateCompanyDto } from "./dto/update-company-dto";
import { CompanyService } from "./company.service";
import { CreateCompanyDto } from "./dto/create-company-dto";
import { Company } from "./company.entity";
import { UseGuards } from "@nestjs/common";
import {
  Query,
  Mutation,
  Resolver,
  Subscription,
  Args,
  Context,
} from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { AuthGuard } from "@nestjs/passport";
import * as jwtDecode from "jwt-decode";
const { withFilter } = require("apollo-server");
const pubsub = new PubSub();
const superCompany = 1;
@Resolver("companys")
export class CompanyResolvers {
  constructor(private readonly companyService: CompanyService) {}

  @Query("allCompanys")
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Roles(USER_ROLES.SuperAdmin)
  async getCompanys(
    obj,
    @Args("allCompanysInput") args: AllCompanysDto,
    @Context() @Context() context,
    info
  ) {
    args.userRequestData = jwtDecode(context.request.headers.authorization);
    const { companyId, limit, userRequestData } = args;
    return await this.companyService.findAll(args);
  }

  @Query("allCompanysStats")
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Roles(USER_ROLES.SuperAdmin, USER_ROLES.ItManager)
  async allCompansStats(obj, @Args() args, @Context() context, info) {
    args.userRequestData = jwtDecode(context.request.headers.authorization);
    const { userRequestData } = args;
    return await this.companyService.findCompanyStats(userRequestData);
  }

  @Query("company")
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Roles(
    USER_ROLES.Accountant,
    USER_ROLES.ItManager,
    USER_ROLES.CEO,
    USER_ROLES.Manager,
    USER_ROLES.SuperAdmin,
    USER_ROLES.Staff
  )
  async findOneById(
    obj,
    @Args() args,
    @Context() context,
    info
  ): Promise<Company> {
    return await this.companyService.findCompanyById(args.companyId);
  }

  @Mutation("createCompany")
  /* @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard) */
  @Roles(USER_ROLES.SuperAdmin, USER_ROLES.ItManager)
  async create(
    obj,
    @Args("createCompanyInput") args: CreateCompanyDto,
    @Context() context,
    info
  ) {
    const createdCompany = await this.companyService.create(args);
    pubsub.publish("companyCreated", {
      companyCreated: createdCompany,
    });
    return createdCompany;
  }

  @Mutation("updateCompany")
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Roles(USER_ROLES.SuperAdmin, USER_ROLES.ItManager)
  async update(
    obj,
    @Args("updateCompanyInput") args: UpdateCompanyDto,
    @Context() context,
    info
  ) {
    args.userRequestData = jwtDecode(context.request.headers.authorization);
    const updatedCompany = await this.companyService.updateOne(args);
    pubsub.publish("companyUpdated", { companyUpdated: updatedCompany });
    return updatedCompany;
  }

  @Mutation("softDeleteCompany")
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Roles(USER_ROLES.SuperAdmin, USER_ROLES.ItManager)
  async softDelete(
    obj,
    @Args() args,
    @Context() context,
    info
  ): Promise<Company> {
    const { companyId } = args;
    const softDeletedCompany = await this.companyService.softDeleteOne(
      +companyId
    );
    pubsub.publish("companySoftDeleted", {
      companySoftDeleted: softDeletedCompany,
    });
    return softDeletedCompany;
  }

  @Mutation("hardDeleteCompany")
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Roles(USER_ROLES.SuperAdmin, USER_ROLES.ItManager)
  async hardDelete(
    obj,
    @Args() args,
    @Context() context,
    info
  ): Promise<Company> {
    const { companyId } = args;
    const hardDeletedCompany = await this.companyService.hardDeleteOne(
      +companyId
    );
    pubsub.publish("companyHardDeleted", {
      companyHardDeleted: hardDeletedCompany,
    });
    return hardDeletedCompany;
  }

  @Subscription("companyCreated", {
    filter: (payload: any, variables: any) =>
      payload.companyCreated.companyId === variables.companyId,
  })
  companyCreated() {
    return pubsub.asyncIterator("companyCreated");
  }

  @Subscription("companySoftDeleted", {
    filter: (payload: any, variables: any) =>
      payload.companySoftDeleted.companyId === variables.companyId,
  })
  companySoftDeleted() {
    return pubsub.asyncIterator("companySoftDeleted");
  }

  @Subscription("companyHardDeleted", {
    filter: (payload: any, variables: any) =>
      payload.companyHardDeleted.companyId === variables.companyId,
  })
  companyHardDeleted() {
    return pubsub.asyncIterator("companyHardDeleted");
  }

  @Subscription("companyUpdated", {
    filter: (payload: any, variables: any) =>
      payload.companyUpdated.companyId === variables.companyId,
  })
  companyUpdated() {
    return pubsub.asyncIterator("companyUpdated");
  }
}
