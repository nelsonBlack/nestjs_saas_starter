import { AllCustomersDto } from "./dto/all-customers.input.dto";
import { LoginCustomerDto } from "./dto/login-company-staff-dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";
import { CustomersSevice } from "./customer.service";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { Customer } from "./customer.entity";
import {
  ResetPassword,
  ChangePassword,
} from "./../company-staff/dto/reset-password.dto";
import { CustomerStats } from "./../../graphql.schema";
import { JwtAuthGuard } from "./../../common/auth/jwt-auth.guard";
import { USER_ROLES } from "./../../common/emums/user-roles.enums";
import { PaginateCompanyStaffParams } from "./../../common/paginate/paginate";
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

@Resolver("Customer")
export class CustomerResolvers {
  constructor(private readonly customerService: CustomersSevice) {}

  @Query("allCustomers")
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
  async getAllCustomers(
    obj,
    @Args("allCustomersInput") args: AllCustomersDto,
    @Context() context,
    info
  ): Promise<Customer[]> {
    args.userRequestData = jwtDecode(context.request.headers.authorization);
    const { companyId, customerId, limit, userRequestData } = args;
    return await this.customerService.findAll(args);
  }

  @Query("customer")
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
  ): Promise<Customer> {
    args.userRequestData = jwtDecode(context.request.headers.authorization);
    const { customerId, userRequestData } = args;
    return await this.customerService.findCustomerById(
      customerId,
      userRequestData
    );
  }

  @Query("customerStats")
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
  async customerStats(
    obj,
    @Args() args,
    @Context() context,
    info
  ): Promise<CustomerStats> {
    args.userRequestData = jwtDecode(context.request.headers.authorization);
    const { userRequestData } = args;
    return await this.customerService.findCustomerStats(userRequestData);
  }

  @Mutation("loginCustomer")
  async login(obj, @Args() args: LoginCustomerDto, @Context() context, info) {
    const _user = await this.customerService.loginUser(args);
    return _user.customer;
  }

  @Mutation("createCustomer")
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(
    USER_ROLES.CEO,
    USER_ROLES.Manager,
    USER_ROLES.SuperAdmin,
    USER_ROLES.ItManager
  )
  async create(
    obj,
    @Args("createCustomerInput") args: CreateCustomerDto,
    @Context() @Context() context,
    @Info() info
  ) {
    args.userRequestData = jwtDecode(context.request.headers.authorization);
    const createdCustomer = await this.customerService.create(args);
    pubsub.publish("customerCreated", {
      customerCreated: createdCustomer.customer,
    });

    return createdCustomer.customer;
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
    const updatedUserPass = await this.customerService.changePassword(args);
    return updatedUserPass;
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
    const updatedUserPass = await this.customerService.requestResetPassword(
      args
    );
    return updatedUserPass;
  }

  @Mutation("updateCustomer")
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
    @Args("updateCustomerInput") args: UpdateCustomerDto,
    @Context() context,
    info
  ) {
    args.userRequestData = jwtDecode(context.request.headers.authorization);
    const updatedCustomer = await this.customerService.updateOne(args);
    pubsub.publish("customerUpdated", {
      customerUpdated: updatedCustomer,
    });
    return updatedCustomer;
  }

  @Mutation("softDeleteCustomer")
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(
    USER_ROLES.CEO,
    USER_ROLES.Manager,
    USER_ROLES.SuperAdmin,
    USER_ROLES.ItManager
  )
  async delete(obj, @Args() args, @Context() context, info): Promise<Customer> {
    args.userRequestData = jwtDecode(context.request.headers.authorization);
    const { customerId, userRequestData } = args;
    const softDeletedCustomer = await this.customerService.softDeleteOne(
      customerId,
      userRequestData
    );
    pubsub.publish("customerSoftDeleted", {
      customerSoftDeleted: softDeletedCustomer,
    });
    return softDeletedCustomer;
  }

  @Mutation("hardDeleteCustomer")
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
  ): Promise<Customer> {
    args.userRequestData = jwtDecode(context.request.headers.authorization);
    const { customerId, userRequestData } = args;
    const hardDeletedCustomer = await this.customerService.hardDeleteOne(
      customerId,
      userRequestData
    );
    pubsub.publish("customerHardDeleted", {
      customerHardDeleted: hardDeletedCustomer,
    });
    return hardDeletedCustomer;
  }

  @Subscription("customerCreated", {
    filter: (payload: any, variables: any) =>
      payload.customerCreated.companyId === variables.companyId,
  })
  customerCreated() {
    return pubsub.asyncIterator("customerCreated");
  }

  @Subscription("customerHardDeleted", {
    filter: (payload: any, variables: any) =>
      payload.customerHardDeleted.companyId === variables.companyId,
  })
  customerHardDeleted() {
    return pubsub.asyncIterator("customerHardDeleted");
  }

  @Subscription("customerSoftDeleted", {
    filter: (payload: any, variables: any) =>
      payload.customerSoftDeleted.companyId === variables.companyId,
  })
  customerSoftDeleted() {
    return pubsub.asyncIterator("customerSoftDeleted");
  }

  @Subscription("customerUpdated", {
    filter: (payload: any, variables: any) =>
      payload.customerUpdated.companyId === variables.companyId,
  })
  customerUpdated() {
    return pubsub.asyncIterator("customerUpdated");
  }
}
