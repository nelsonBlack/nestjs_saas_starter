import { NestFactory } from "@nestjs/core";
import { ApplicationModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import { MyLogger } from "./common/logger/logger.service";
import * as express from "express";
import * as path from "path";
async function bootstrap() {
  // localhost
  const app = await NestFactory.create<NestExpressApplication>(
    ApplicationModule,
    {
      cors: {
        origin: true,
        preflightContinue: true,
      },
    }
  );
  //remove comented out in server
  // app.useLogger(app.get(MyLogger));
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

  app.useStaticAssets(path.join(__dirname, "/../uploads/images/"));

  app.enableCors();
  app.use(cors());
  app.useLogger(app.get(MyLogger));
  await app.listen(3031);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
