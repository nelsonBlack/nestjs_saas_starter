import { mailerConfig } from "./common/email-configs/mailerconfig";
import { CompanyDepartmentModule } from "./modules/company-department/company-department.module";
import { CompanyModule } from "./modules/company/company.module";
import { LoggerModule } from "./common/logger/logger.module";

import { CommonsModule } from "./common/common.module";
import { WEBSOCKET_EXCEPTIONS } from "./common/errors/errors-constants";
import { SECRET } from "./config";
import { AuthModule } from "./common/auth/auth.module";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { join } from "path";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SmsModule } from "./modules/sms/sms.module";
import { CompanyStaffModule } from "./modules/company-staff/company-staff.module";
import { MailerModule } from "@nestjs-modules/mailer";
import * as jwt from "jsonwebtoken";
@Module({
  imports: [
    CommonsModule,
    TypeOrmModule.forRoot(),
    LoggerModule,
    AuthModule,
    CompanyModule,
    CompanyStaffModule,
    CompanyDepartmentModule,
    SmsModule,
    MailerModule.forRoot(mailerConfig),
    GraphQLModule.forRoot({
      context: ({ req, res }) => ({
        request: req,
      }),

      subscriptions: {
        onConnect: (connectionParams: any, webSocket) => {
          if (connectionParams) {
            let token = connectionParams.Authorization;
            if (!token) {
              throw new Error("No auth token!");
            }

            return (
              (token = jwt.verify(token.slice(7), SECRET, (err, decoded) => {
                console.log(decoded, "decoded token"); // bar
                if (decoded) {
                  return true;
                }
                if (!decoded) {
                  throw new Error("Wrong auth token!");
                }
              })),
              (err) => {
                console.log(err);
                return false;
              }
            );
          }

          throw new Error("Missing auth token!");
        },
      },

      playground: {
        settings: {
          "editor.theme": "light",
        },
      },
      typePaths: ["./**/*.graphql"],
      installSubscriptionHandlers: true,
      definitions: {
        path: join(process.cwd(), "src/graphql.schema.d.ts"),
        outputAs: "class",
      },
    }),
  ],
})
export class ApplicationModule {}
