import { AuthGuard } from "@nestjs/passport";
import { JwtPayload } from "./../auth/interfaces/jwt-payload.interface";
import { SECRET } from "./../../config";
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { Reflector } from "@nestjs/core";
import * as jwt from "jsonwebtoken";
import { GqlExecutionContext } from "@nestjs/graphql";
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().request;
    const roles = this.reflector.get<string[]>("roles", context.getHandler());
    console.log(roles);
    if (!roles) {
      return true;
    }

    let token = request.headers.authorization;
    console.log(token);
    if (!token) {
      return false;
    }
    (token = jwt.verify(token.slice(7), SECRET, (err, decoded) => {
      console.log(decoded); // bar
      if (decoded) {
        return decoded;
      } else {
        return false;
      }

      if (err) {
        return false;
      }
    })),
      err => {
        console.log(err);
        return false;
      };

    const user: JwtPayload = { role: token.role, email: token.email };

    // const hasRole = () => user.role.some((role) => roles.includes(role));
    const hasRole = () => roles.includes(user.role);
    return user && user.role && hasRole();
  }
}
