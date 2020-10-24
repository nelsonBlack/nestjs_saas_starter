import { NestFactory } from "@nestjs/core";
import { ApplicationModule } from "./app.module";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import { MyLogger } from "./common/logger/logger.service";
async function bootstrap() {
  // server
  const fs = require("fs");
  const keyFile = fs.readFileSync(
    "/etc/letsencrypt/live/e-billapi.test.majipay.co.ke/privkey.pem"
  );
  const certFile = fs.readFileSync(
    "/etc/letsencrypt/live/e-billapi.test.majipay.co.ke/fullchain.pem"
  );
  const app = await NestFactory.create(ApplicationModule, {
    httpsOptions: {
      key: keyFile,
      cert: certFile
    }
  });
   app.useLogger(app.get(MyLogger));
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true })); 

app.useLogger(app.get(MyLogger));
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

  // app.enableCors();
  // app.use(cors());
  await app.listen(3035);
  console.log('Application has started');
}
bootstrap();
