import {
  SmsSenderIdEnum,
  SMSOptionsEnum,
  CompanyEnums,
} from "./../../common/emums/string-constants.enums";
import { JwtPayload } from "./../../common/auth/interfaces/jwt-payload.interface";
import { Company } from "./../company/company.entity";
import { SmsResult } from "./sms-result.entity";
import { UrlsEnum } from "./../../common/emums/urls.enum";
import { USER_ROLES } from "./../../common/emums/user-roles.enums";
import { monthNames } from "./../../common/emums/months.enums";
import { SmsTypeEnum } from "./enums/sms.enums";
import { SmsValidationResult } from "./sms-result-validation.entity";
import { ISmsResponse } from "./interface/sms.interface";
import { CompanyStaffData } from "./../company-staff/interface/company-staff-interface";
import { TokenResponseDto } from "./dto/sms-response.dto";
import { SendSmsDto, SendLoginSmsDto } from "./dto/send-sms-token.dto";
import { Injectable, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { validate } from "class-validator";
import { MoreThan } from "typeorm";
import { HttpException, HttpService } from "@nestjs/common";
import * as crypto from "crypto";
import * as moment from "moment";
import { addDays, format, startOfMonth } from "date-fns";
import { Customer } from "../customer/customer.entity";
import { CompanyStaff } from "../company-staff/company-staff.entity";
let options = {};
options["apiKey"] = SMSOptionsEnum.API_KEY;
options["username"] = SMSOptionsEnum.USER_NAME;
let AfricasTalking = require("africastalking")(options);
console.log(options);
let sms = AfricasTalking.SMS;
@Injectable()
export class SmsService {
  plus = `+`;
  constructor(
    @InjectRepository(SmsValidationResult)
    public readonly smsValidationResultRepository: Repository<
      SmsValidationResult
    >,
    @InjectRepository(SmsResult)
    public readonly smsResultRepository: Repository<SmsResult>
  ) {}

  private getMd5Hash(input: string) {
    if (input == null) {
      return null;
    }
    return crypto.createHash("md5").update(input).digest("hex");
  }

  private getTimeStamp(): number {
    console.log(new Date().getTime());
    return new Date().getTime();
  }

  async getUnits(mpesaData) {
    //get company rates
    mpesaData;
  }

  async sendCustomerPasswordChangeSms(smsData: CompanyStaff | Customer) {
    AfricasTalking = require("africastalking")(options);
    sms = AfricasTalking.SMS;

    let opts = {
      message: this.constructPasswordMessage(smsData),
      to: smsData.phone,
      from: SmsSenderIdEnum.SmsSenderId,
      enqueue: false,
    };

    // all methods return a promise
    return await sms
      .send(opts)
      .then((success) => {
        console.log(success, "this is me");
        return success;
      })
      .catch((error) => {
        console.log(error, "this is me");
      });
  }

  async requestPasswordChangeSms(smsData: CompanyStaff | Customer) {
    AfricasTalking = require("africastalking")(options);
    sms = AfricasTalking.SMS;

    let opts = {
      message: this.constructOtpMessage(smsData),
      to: smsData.phone,
      from: SmsSenderIdEnum.SmsSenderId,
      enqueue: false,
    };

    // all methods return a promise
    return await sms
      .send(opts)
      .then((success) => {
        console.log(success, "this is me");
        return success;
      })
      .catch((error) => {
        console.log(error, "this is me");
      });
  }

  async sendPasswordChangeSms(smsData: CompanyStaff | Customer) {
    AfricasTalking = require("africastalking")(options);
    sms = AfricasTalking.SMS;

    let opts = {
      message: this.constructPasswordMessage(smsData),
      to: smsData.phone,
      from: SmsSenderIdEnum.SmsSenderId,
      enqueue: false,
    };

    // all methods return a promise
    return await sms
      .send(opts)
      .then((success) => {
        console.log(success, "this is me");
        return success;
      })
      .catch((error) => {
        console.log(error, "this is me");
      });
  }

  async sendUserCreatedSms(
    smsData: CompanyStaffData | Customer,
    company?: Company
  ) {
    if (company?.smsApiKey != null && company?.smsUserName != null) {
      options = {
        apiKey: company.smsApiKey,
        username: company.smsUserName,
      };
      AfricasTalking = require("africastalking")(options);
      sms = AfricasTalking.SMS;
    }

    let opts = {
      message: this.constructUserCreatedMessage(smsData, company),
      to: smsData.phone,
      from:
        company?.senderId != null
          ? company?.senderId
          : SmsSenderIdEnum.SmsSenderId,
      enqueue: false,
    };

    return await sms
      .send(opts)
      .then((success) => {
        console.log(success, "this is me");
        return success;
      })
      .catch((error) => {
        console.log(error, "this is me");
      });
  }

  constructOtpMessage(smsData: CompanyStaff | Customer) {
    let siteLink = UrlsEnum.prodServerBaseUrl;
    let smsString = ` Your ${CompanyEnums.name} code is #${smsData.otpCode}`;
    return smsString;
  }

  constructPasswordMessage(smsData: CompanyStaff | Customer) {
    let siteLink = UrlsEnum.prodServerBaseUrl;
    let smsString = `Hi ${smsData?.firstName} you successfully changed your password
  . Your login email is ${smsData.email}.`;
    return smsString;
  }

  constructUserCreatedMessage(
    smsData: CompanyStaffData | Customer,
    company?: Company
  ) {
    let siteLink = UrlsEnum.prodServerBaseUrl;
    let smsString = ``;
    if (smsData.role === USER_ROLES.Customer) {
      smsString = `Hi ${smsData.firstName} , Welcome to ${CompanyEnums.name}. 
    Your login email is ${smsData.email} . 
    Download the app at ${UrlsEnum.clientAppPlaystoreUrl} `;
    } else {
      smsString = `Hi ${smsData.firstName} of ${company.name},you have been added as ${smsData.role} of ${company.name}. 
    Your login email is ${smsData.email} . 
    Log in at ${siteLink} to manage ${CompanyEnums.name}`;
    }
    return smsString;
  }

  async saveSmsResult(
    smsResult: ISmsResponse,

    smsType: SmsTypeEnum

    /*   mpesaC2B?: MpesaC2bConfirmation */
  ) {
    if (
      smsResult &&
      smsResult.SMSMessageData &&
      smsResult.SMSMessageData.Recipients &&
      Array.isArray(smsResult.SMSMessageData.Recipients)
    ) {
      return await smsResult.SMSMessageData.Recipients.map(async (el) => {
        let newSmsResult = new SmsResult();

        newSmsResult.smsType = smsType;

        newSmsResult = Object.assign(newSmsResult, el);
        let savedSmsResult = await this.smsResultRepository.save(newSmsResult);
      });
    }
  }
}
