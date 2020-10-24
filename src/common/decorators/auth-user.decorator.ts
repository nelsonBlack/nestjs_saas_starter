import { JwtPayload } from "./../auth/interfaces/jwt-payload.interface";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import * as jwtDecode from "jwt-decode";
export const GetUser = createParamDecorator(
  (data, context: ExecutionContext) => {
    const jwt = GqlExecutionContext.create(context).getContext().request.headers
      .authorization;
    let userData: JwtPayload = jwtDecode(jwt);
    return userData;
  }
);
