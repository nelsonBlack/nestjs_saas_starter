import { GqlExecutionContext } from "@nestjs/graphql";
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import * as jwt from "jsonwebtoken";
import { SECRET } from "./../../config";

@Injectable()
export class JwtAuthGuard extends AuthGuard("bearer") {
  canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().request;

    let token = request.headers.authorization;
    console.log(token);
    if (!token) {
      return false;
    }
    (token = jwt.verify(token.slice(7), SECRET, (err, decoded) => {
      console.log(decoded); // bar
      if (decoded) {
        return true;
      } else {
        return false;
      }
    })),
      (err) => {
        console.log(err);
        return false;
      };
    return token;
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
