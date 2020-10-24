import { CompanyDepartmentStats } from "./../../graphql.schema";
import { CompanyDepartment } from "./company-department.entity";
import { CreateCompanyDepartmentDto } from "./dto/create-company-department.dto";
import { CompanyDepartmentService } from "./company-department.service";
import { UpdateCompanyDepartmentDto } from "./dto/update-company-department.dto";
import { AllCompanyDepartmentsDto } from "./dto/query-all-company-department.dto";
import { JwtAuthGuard } from "./../../common/auth/jwt-auth.guard";
import { USER_ROLES } from "./../../common/emums/user-roles.enums";
import { RolesGuard } from "./../../common/guards/roles.guard";
import { Roles } from "./../../common/guards/roles.decorator";
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
@Resolver("companyDepartments")
export class CompanyDepartmentResolvers {
  constructor(
    private readonly companyDepartmentService: CompanyDepartmentService
  ) {}

  @Query("allCompanyDepartments")
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
  async allCompanyDepartments(
    obj,
    @Args("allCompanyDepartments") args: AllCompanyDepartmentsDto,
    @Context() @Context() context,
    info
  ) {
    args.userRequestData = jwtDecode(context.request.headers.authorization);
    return await this.companyDepartmentService.findAll(args);
  }

  @Query("allCompanyDepartmentStats")
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
  async allCompanyDepartmentStats(
    obj,
    @Args() args,
    @Context() context,
    info
  ): Promise<CompanyDepartmentStats> {
    args.userRequestData = jwtDecode(context.request.headers.authorization);
    const { userRequestData } = args;
    return await this.companyDepartmentService.findCompanyDepartmentStats(
      userRequestData
    );
  }

  @Query("companyDepartment")
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
  ): Promise<CompanyDepartment> {
    return await this.companyDepartmentService.findOneById(
      args.companyDepartmentId
    );
  }

  @Mutation("createCompanyDepartment")
  /*   @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard) */
  @Roles(
    USER_ROLES.Accountant,
    USER_ROLES.ItManager,
    USER_ROLES.CEO,
    USER_ROLES.Manager,
    USER_ROLES.SuperAdmin
  )
  async create(
    obj,
    @Args("createCompanyDepartmentInput") args: CreateCompanyDepartmentDto,
    @Context() context,
    info
  ) {
    const createdcompanyDepartment = await this.companyDepartmentService.create(
      args
    );
    pubsub.publish("companyDepartmentCreated", {
      companyDepartmentCreated: createdcompanyDepartment,
    });
    return createdcompanyDepartment;
  }

  @Mutation("updateCompanyDepartment")
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Roles(
    USER_ROLES.Accountant,
    USER_ROLES.ItManager,
    USER_ROLES.CEO,
    USER_ROLES.Manager,
    USER_ROLES.SuperAdmin
  )
  async updateCompanyDepartment(
    obj,
    @Args("updateCompanyDepartmentInput") args: UpdateCompanyDepartmentDto,
    @Context() context,
    info
  ) {
    args.userRequestData = jwtDecode(context.request.headers.authorization);
    const updatedCompanyDepartment = await this.companyDepartmentService.updateOne(
      args
    );
    pubsub.publish("companyDepartmentUpdated", {
      companyDepartmentUpdated: updatedCompanyDepartment,
    });
    return updatedCompanyDepartment;
  }

  @Mutation("softDeleteCompanyDepartment")
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Roles(
    USER_ROLES.Accountant,
    USER_ROLES.ItManager,
    USER_ROLES.CEO,
    USER_ROLES.Manager,
    USER_ROLES.SuperAdmin
  )
  async softDeleteCompanyDepartment(
    obj,
    @Args() args,
    @Context() context,
    info
  ) {
    const { companyDepartmentId } = args;
    const softDeletedCompanyDepartment = await this.companyDepartmentService.softDeleteOne(
      companyDepartmentId
    );
    pubsub.publish("companyDepartmentSoftDeleted", {
      companyDepartmentSoftDeleted: softDeletedCompanyDepartment,
    });
    return softDeletedCompanyDepartment;
  }

  @Mutation("hardDeleteCompanyDepartment")
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Roles(
    USER_ROLES.Accountant,
    USER_ROLES.ItManager,
    USER_ROLES.CEO,
    USER_ROLES.Manager,
    USER_ROLES.SuperAdmin
  )
  async hardDelete(obj, @Args() args, @Context() context, info) {
    const { companyDepartmentId } = args;
    const hardDeletedCompanyDepartment = await this.companyDepartmentService.hardDeleteOne(
      companyDepartmentId
    );
    pubsub.publish("companyDepartmentHardDeleted", {
      companyDepartmentHardDeleted: hardDeletedCompanyDepartment,
    });
    return hardDeletedCompanyDepartment;
  }

  @Subscription("companyDepartmentCreated", {
    filter: (payload: any, variables: any) =>
      payload.companyDepartmentCreated.companyId === variables.companyId,
  })
  companyDepartmentCreated() {
    return pubsub.asyncIterator("companyDepartmentCreated");
  }

  @Subscription("companyDepartmentSoftDeleted", {
    filter: (payload: any, variables: any) =>
      payload.companyDepartmentSoftDeleted.companyId === variables.companyId,
  })
  companyDepartmentSoftDeleted() {
    return pubsub.asyncIterator("companyDepartmentSoftDeleted");
  }

  @Subscription("companyDepartmentHardDeleted", {
    filter: (payload: any, variables: any) =>
      payload.companyDepartmentHardDeleted.companyId === variables.companyId,
  })
  companyDepartmentHardDeleted() {
    return pubsub.asyncIterator("companyDepartmentHardDeleted");
  }

  @Subscription("companyDepartmentUpdated", {
    filter: (payload: any, variables: any) =>
      payload.companyDepartmentUpdated.companyId === variables.companyId,
  })
  companyDepartmentUpdated() {
    return pubsub.asyncIterator("companyDepartmentUpdated");
  }
}
