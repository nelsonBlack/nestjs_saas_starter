import { CompanyStaffStats } from "./../../graphql.schema";
import { CreateSuperAdminJWTDto } from "./dto/create-super-admin-jwt.dto";
import { ChangePassword, ResetPassword } from "./dto/reset-password.dto";
import { JwtAuthGuard } from "./../../common/auth/jwt-auth.guard";
import { USER_ROLES } from "./../../common/emums/user-roles.enums";
import { PaginateCompanyStaffParams } from "./../../common/paginate/paginate";
import { LoginCompanyStaffDto } from "./dto/login-company-staff-dto";
import { UpdateCompanyStaffDto } from "./dto/update-company-staff-dto";
import { CompanyStaffService } from "./company-staff.service";
import { CreateCompanyStaffDto } from "./dto/create-company-staff-dto";
import { CompanyStaff } from "./company-staff.entity";
import { UseGuards, HttpException, Req } from "@nestjs/common";
import {
  Query,
  Mutation,
  Resolver,
  Subscription,
  Info,
  Context,
  Args,
} from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "./../../common/guards/roles.guard";
import { Roles } from "./../../common/guards/roles.decorator";
import * as jwtDecode from "jwt-decode";
const { withFilter } = require("apollo-server");
const pubsub = new PubSub();

@Resolver("CompanyStaff")
export class CompanyStaffResolvers {
  constructor(private readonly companyStaffService: CompanyStaffService) {}

  @Query("allCompanyStaff")
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
  async getAllCompanyStaff(
    obj,
    @Args() args: PaginateCompanyStaffParams,
    @Context() context,
    info
  ): Promise<CompanyStaff[]> {
    args.userRequestData = jwtDecode(context.request.headers.authorization);
    const { companyId, companyStaffId, limit, userRequestData } = args;
    return await this.companyStaffService.findAll(
      companyStaffId,
      userRequestData.companyStaff.companyId,
      limit,
      userRequestData
    );
  }

  @Query("companyStaff")
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
  ): Promise<CompanyStaff> {
    args.userRequestData = jwtDecode(context.request.headers.authorization);
    const { companyStaffId, userRequestData } = args;
    return await this.companyStaffService.findCompanyStaffById(
      companyStaffId,
      userRequestData
    );
  }

  @Query("companyStaffStats")
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
  async companyStaffStats(
    obj,
    @Args() args,
    @Context() context,
    info
  ): Promise<CompanyStaffStats> {
    args.userRequestData = jwtDecode(context.request.headers.authorization);
    const { companyStaffId, userRequestData } = args;
    return await this.companyStaffService.findCompanyStaffStats(
      userRequestData
    );
  }

  @Mutation("login")
  async login(
    obj,
    @Args() args: LoginCompanyStaffDto,
    @Context() context,
    info
  ) {
    const _user = await this.companyStaffService.loginUser(args);
    return _user.companyStaff;
  }

  @Mutation("generateSuperAdminJWT")
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(USER_ROLES.SuperAdmin)
  async createCompanyStaffJWT(
    obj,
    @Args() args: CreateSuperAdminJWTDto,
    @Context() @Context() context,
    @Info() info
  ) {
    args.userRequestData = jwtDecode(context.request.headers.authorization);
    const { companyStaffId, companyId } = args;
    const createdJWT = await this.companyStaffService.generateSuperAdminJWT(
      companyStaffId,
      companyId
    );

    return createdJWT;
  }

  @Mutation("createCompanyStaff")
  /*  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard) */
  @Roles(
    USER_ROLES.CEO,
    USER_ROLES.Manager,
    USER_ROLES.SuperAdmin,
    USER_ROLES.ItManager
  )
  async create(
    obj,
    @Args("createCompanyStaffInput") args: CreateCompanyStaffDto,
    @Context() @Context() context,
    @Info() info
  ) {
    // args.userRequestData = jwtDecode(context.request.headers.authorization);
    const createdCompanyStaff = await this.companyStaffService.create(args);
    pubsub.publish("companyStaffCreated", {
      companyStaffCreated: createdCompanyStaff.companyStaff,
    });

    return createdCompanyStaff.companyStaff;
  }

  @Mutation("changePassword")
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(
    USER_ROLES.CEO,
    USER_ROLES.Manager,
    USER_ROLES.SuperAdmin,
    USER_ROLES.ItManager
  )
  async changePassword(
    obj,
    @Args() args: ChangePassword,
    @Context() @Context() context,
    @Info() info
  ) {
    const UpdatedUserPass = await this.companyStaffService.changePassword(args);
    return UpdatedUserPass;
  }

  @Mutation("requestResetPassword")
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(
    USER_ROLES.CEO,
    USER_ROLES.Manager,
    USER_ROLES.SuperAdmin,
    USER_ROLES.ItManager
  )
  async requestResetPassword(
    obj,
    @Args() args: ResetPassword,
    @Context() @Context() context,
    @Info() info
  ) {
    const UpdatedUserPass = await this.companyStaffService.requestResetPassword(
      args
    );
    return UpdatedUserPass;
  }

  @Mutation("updateCompanyStaff")
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(
    USER_ROLES.CEO,
    USER_ROLES.Manager,
    USER_ROLES.SuperAdmin,
    USER_ROLES.ItManager
  )
  async update(
    obj,
    @Args("updateCompanyStaffInput") args: UpdateCompanyStaffDto,
    @Context() context,
    info
  ) {
    args.userRequestData = jwtDecode(context.request.headers.authorization);
    const updatedCompanyStaff = await this.companyStaffService.updateOne(args);
    pubsub.publish("companyStaffUpdated", {
      companyStaffUpdated: updatedCompanyStaff.companyStaff,
    });
    return updatedCompanyStaff.companyStaff;
  }

  @Mutation("softDeleteCompanyStaff")
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(
    USER_ROLES.CEO,
    USER_ROLES.Manager,
    USER_ROLES.SuperAdmin,
    USER_ROLES.ItManager
  )
  async delete(
    obj,
    @Args() args,
    @Context() context,
    info
  ): Promise<CompanyStaff> {
    args.userRequestData = jwtDecode(context.request.headers.authorization);
    const { companyStaffId, userRequestData } = args;
    const softDeletedCompanyStaff = await this.companyStaffService.softDeleteOne(
      +companyStaffId,
      userRequestData
    );
    pubsub.publish("companyStaffSoftDeleted", {
      companyStaffSoftDeleted: softDeletedCompanyStaff,
    });
    return softDeletedCompanyStaff;
  }

  @Mutation("hardDeleteCompanyStaff")
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(
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
  ): Promise<CompanyStaff> {
    args.userRequestData = jwtDecode(context.request.headers.authorization);
    const { companyStaffId, userRequestData } = args;
    const hardDeletedCompanyStaff = await this.companyStaffService.hardDeleteOne(
      +companyStaffId,
      userRequestData
    );
    pubsub.publish("companyStaffHardDeleted", {
      companyStaffHardDeleted: hardDeletedCompanyStaff,
    });
    return hardDeletedCompanyStaff;
  }

  @Subscription("companyStaffCreated", {
    filter: (payload: any, variables: any) =>
      payload.companyStaffCreated.companyId === variables.companyId,
  })
  companyStaffCreated() {
    return pubsub.asyncIterator("companyStaffCreated");
  }

  @Subscription("companyStaffHardDeleted", {
    filter: (payload: any, variables: any) =>
      payload.companyStaffHardDeleted.companyId === variables.companyId,
  })
  companyStaffHardDeleted() {
    return pubsub.asyncIterator("companyStaffHardDeleted");
  }

  @Subscription("companyStaffSoftDeleted", {
    filter: (payload: any, variables: any) =>
      payload.companyStaffSoftDeleted.companyId === variables.companyId,
  })
  companyStaffSoftDeleted() {
    return pubsub.asyncIterator("companyStaffSoftDeleted");
  }

  @Subscription("companyStaffUpdated", {
    filter: (payload: any, variables: any) =>
      payload.companyStaffUpdated.companyId === variables.companyId,
  })
  companyStaffUpdated() {
    return pubsub.asyncIterator("companyStaffUpdated");
  }
}
