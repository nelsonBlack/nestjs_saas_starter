import { CreateCompanyStaffRoleDto } from "./dto/create-company-roles.dto";

import { QueryAllCompanyStaffRolesDto } from "./dto/query-all-company-roles.dto";
import { CompanyStaffRoleService } from "./company-roles.service";
import { CompanyStaffRole } from "./company-roles.entity";
import { CreateCompanyDepartmentDto } from "../company-department/dto/create-company-department.dto";
import { UpdateCompanyStaffRoleDto } from "./dto/update-company-roles.dto";
import { JwtAuthGuard } from "./../../common/auth/jwt-auth.guard";
import { USER_ROLES } from "./../../common/emums/user-roles.enums";
import { Roles } from "./../../common/guards/roles.decorator";
import { RolesGuard } from "./../../common/guards/roles.guard";
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
import {
  AllCompanyStaffRoleInput,
  CompanyStaffRoleStats,
} from "../../graphql.schema";
const { withFilter } = require("apollo-server");
const pubsub = new PubSub();

@Resolver("CompanyStaffRole")
export class CompanyStaffRoleResolvers {
  constructor(
    private readonly companyStaffRoleService: CompanyStaffRoleService
  ) {}

  @Query("allCompanyStaffRoles")
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Roles(
    USER_ROLES.Accountant,
    USER_ROLES.CEO,
    USER_ROLES.Manager,
    USER_ROLES.SuperAdmin,
    USER_ROLES.Staff,
    USER_ROLES.ItManager
  )
  async getCompanyStaffRoles(
    obj,
    @Args("allCompanyStaffRoleInput") args: QueryAllCompanyStaffRolesDto,
    @Context() context,
    info
  ): Promise<CompanyStaffRole[]> {
    args.userRequestData = jwtDecode(context.request.headers.authorization);

    return await this.companyStaffRoleService.findAll(args);
  }

  @Query("companyStaffRole")
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(
    USER_ROLES.Accountant,
    USER_ROLES.CEO,
    USER_ROLES.Manager,
    USER_ROLES.SuperAdmin,
    USER_ROLES.Staff,
    USER_ROLES.ItManager
  )
  async findOneById(
    obj,
    @Args() args,
    @Context() context,
    info
  ): Promise<CompanyStaffRole> {
    args.userRequestData = jwtDecode(context.request.headers.authorization);
    const { companyStaffRoleId, userRequestData } = args;
    return await this.companyStaffRoleService.findOneById(
      companyStaffRoleId,
      userRequestData
    );
  }

  @Query("companyStaffRoleStats")
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(
    USER_ROLES.Accountant,
    USER_ROLES.CEO,
    USER_ROLES.Manager,
    USER_ROLES.SuperAdmin,
    USER_ROLES.Staff,
    USER_ROLES.ItManager
  )
  async findTariffStats(
    obj,
    @Args() args,
    @Context() context,
    info
  ): Promise<CompanyStaffRoleStats> {
    args.userRequestData = jwtDecode(context.request.headers.authorization);
    const { userRequestData } = args;
    return await this.companyStaffRoleService.findCompanyStaffRoleStats(
      userRequestData
    );
  }

  @Mutation("createCompanyStaffRole")
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(
    USER_ROLES.Accountant,
    USER_ROLES.CEO,
    USER_ROLES.Manager,
    USER_ROLES.SuperAdmin,
    USER_ROLES.ItManager
  )
  async create(
    obj,
    @Args("createCompanyStaffRoleInput") args: CreateCompanyStaffRoleDto,
    @Context() context,
    info
  ): Promise<CompanyStaffRole> {
    args.userRequestData = jwtDecode(context.request.headers.authorization);
    const createdCompanyStaffRole = await this.companyStaffRoleService.create(
      args
    );
    pubsub.publish("companyStaffRoleCreated", {
      companyStaffRoleCreated: createdCompanyStaffRole,
    });
    return createdCompanyStaffRole;
  }

  @Mutation("updateCompanyStaffRole")
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(
    USER_ROLES.Accountant,
    USER_ROLES.CEO,
    USER_ROLES.Manager,
    USER_ROLES.SuperAdmin,
    USER_ROLES.ItManager
  )
  async update(
    obj,
    @Args("updateCompanyStaffRoleInput") args: UpdateCompanyStaffRoleDto,
    @Context() context,
    info
  ): Promise<CompanyStaffRole> {
    args.userRequestData = jwtDecode(context.request.headers.authorization);
    const updatedCompanyStaffRole = await this.companyStaffRoleService.updateOne(
      args
    );
    pubsub.publish("companyStaffRoleUpdated", {
      companyStaffRoleUpdated: updatedCompanyStaffRole,
    });
    return updatedCompanyStaffRole;
  }

  @Mutation("softDeleteTariff")
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(
    USER_ROLES.Accountant,
    USER_ROLES.CEO,
    USER_ROLES.Manager,
    USER_ROLES.SuperAdmin,
    USER_ROLES.ItManager
  )
  async softDelete(
    obj,
    @Args() args,
    @Context() context,
    info
  ): Promise<CompanyStaffRole> {
    args.userRequestData = jwtDecode(context.request.headers.authorization);
    const { companyStaffRoleId, userRequestData } = args;
    const softDeletedCompanyStaffRole = await this.companyStaffRoleService.softDeleteOne(
      companyStaffRoleId,
      userRequestData
    );
    pubsub.publish("companyStaffRoleSoftDeleted", {
      companyStaffRoleSoftDeleted: softDeletedCompanyStaffRole,
    });
    return softDeletedCompanyStaffRole;
  }

  @Mutation("hardDeleteCompanyStaffRole")
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(
    USER_ROLES.Accountant,
    USER_ROLES.CEO,
    USER_ROLES.Manager,
    USER_ROLES.SuperAdmin,
    USER_ROLES.ItManager
  )
  async hardDelete(
    obj,
    @Args() args,
    @Context() context,
    info
  ): Promise<CompanyStaffRole> {
    args.userRequestData = jwtDecode(context.request.headers.authorization);
    const { companyStaffRoleId, userRequestData } = args;
    const hardDeletedCompanyStaffRole = await this.companyStaffRoleService.hardDeleteOne(
      companyStaffRoleId,
      userRequestData
    );
    pubsub.publish("companyStaffRoleHardDeleted", {
      companyStaffRoleHardDeleted: hardDeletedCompanyStaffRole,
    });
    return hardDeletedCompanyStaffRole;
  }

  @Subscription("companyStaffRoleCreated", {
    filter: (payload: any, variables: any) =>
      payload.companyStaffRoleCreated.companyId === variables.companyId,
  })
  companyStaffRoleCreated() {
    return pubsub.asyncIterator("companyStaffRoleCreated");
  }

  @Subscription("companyStaffRoleHardDeleted", {
    filter: (payload: any, variables: any) =>
      payload.companyStaffRoleHardDeleted.companyId === variables.companyId,
  })
  companyStaffRoleHardDeleted() {
    return pubsub.asyncIterator("companyStaffRoleHardDeleted");
  }

  @Subscription("companyStaffRoleSoftDeleted", {
    filter: (payload: any, variables: any) =>
      payload.companyStaffRoleSoftDeleted.companyId === variables.companyId,
  })
  companyStaffRoleSoftDeleted() {
    return pubsub.asyncIterator("companyStaffRoleSoftDeleted");
  }

  @Subscription("companyStaffRoleUpdated", {
    filter: (payload: any, variables: any) =>
      payload.companyStaffRoleUpdated.companyId === variables.companyId,
  })
  companyStaffRoleUpdated() {
    return pubsub.asyncIterator("companyStaffRoleUpdated");
  }
}
