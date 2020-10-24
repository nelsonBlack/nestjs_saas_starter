import { NestFactory } from "@nestjs/core";
import { ApplicationModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import { MyLogger } from "./common/logger/logger.service";
import * as path from "path";
async function bootstrap() {
  // server
  const fs = require("fs");
  const keyFile = fs.readFileSync(
    "/etc/letsencrypt/live/e-billapi.majipay.co.ke/privkey.pem"
  );
  const certFile = fs.readFileSync(
    "/etc/letsencrypt/live/e-billapi.majipay.co.ke/fullchain.pem"
  );
  const app = await NestFactory.create<NestExpressApplication>(
    ApplicationModule,
    {
      httpsOptions: {
        key: keyFile,
        cert: certFile,
      },
      cors: {
        origin: true,
        preflightContinue: true,
      },
    }
  );
  app.useLogger(app.get(MyLogger));
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
  app.useStaticAssets(path.join(__dirname, "/../meter-reading"));
  app.useLogger(app.get(MyLogger));
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

  app.enableCors();
  app.use(cors());
  await app.listen(3030);
  console.log("Application has started");
}
bootstrap();
