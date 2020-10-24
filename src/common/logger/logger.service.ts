import { ErrorLogger } from "./logger.entity";
import { LoggerService } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MailerService } from "@nestjs-modules/mailer";
import { getMaxListeners } from "cluster";
export class MyLogger implements LoggerService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectRepository(ErrorLogger)
    public readonly errorLoggerRepository: Repository<ErrorLogger>
  ) {}
  log(message: string) {}
 async error(message: string, trace: string) {
    console.log(message, trace, "the error occuered");
    let newErrorLogger = new ErrorLogger();
    newErrorLogger.message = message;
    newErrorLogger.trace = trace;
    newErrorLogger.appName= `meterReading`;
    let savedError= await this.errorLoggerRepository.save(newErrorLogger);
    let sentErrorMail= await this.sendMail(savedError);
  }

  async sendMail(
    mailData: ErrorLogger,
   
  ) {
      let email= `vbwogora@gmail.com`;
    this.mailerService.sendMail({
      to: `${email}`, // sender address
      from: "info@majipay.co.ke", // list of receivers
      subject: `${mailData.appName} ${mailData.message}`, // Subject line
      //text: 'welcome', // plaintext body
      html: `<b>${mailData.appName} ${mailData.message}</b><br>
             Trace: ${mailData.trace} .<br>
            ${mailData.createdAt}<br> 
            ` // HTML body content
    });
  }
  warn(message: string) {}
  debug(message: string) {}
  verbose(message: string) {}
}
