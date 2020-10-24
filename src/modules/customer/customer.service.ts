import { UrlsEnum } from "./../../common/emums/urls.enum";
import { NotExistsException } from "./../../common/exceptions/not-exsist-exception";
import { InvalidDataException } from "./../../common/exceptions/invalid-data-exception";
import { CustomerData, CustomerRO } from "./interface/customer.interface";
import { UpdateCustomerDto } from "./dto/update-customer.dto";
import { CustomerCreatedEmailTemplateService } from "./../../common/email-templates/customer-created-email.service";
import { PersonStatusEnum } from "./../../common/emums/person-status.enum";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { Customer } from "./customer.entity";
import { CustomerStats } from "./../../graphql.schema";
import { ExistsException } from "./../../common/exceptions/exists-data-exception";
import { LoginFailException } from "./../../common/exceptions/login-fail.exception";
import { CompanyEnums } from "./../../common/emums/string-constants.enums";
import { CompanyStaffCreatedEmailTemplateService } from "./../../common/email-templates/company-staff-created-email.service";
import { SmsTypeEnum } from "../sms/enums/sms.enums";
import { plainToClass, plainToClassFromExist } from "class-transformer";
import { SmsService } from "../sms/sms.service";
import { SendLoginSmsDto } from "../sms/dto/send-sms-token.dto";
import { USER_ROLES } from "./../../common/emums/user-roles.enums";
import {
  COMPANY_EXCEPTIONS,
  CUSTOMER_EXCEPTIONS,
} from "./../../common/errors/errors-constants";
import { JwtPayload } from "./../../common/auth/interfaces/jwt-payload.interface";
import { SECRET } from "./../../config";
import { LoginCustomerDto } from "./dto/login-company-staff-dto";
import {
  ResetPassword,
  ChangePassword,
  OtpResetPassword,
} from "./dto/reset-password.dto";
import { getConnection, getRepository } from "typeorm";
import { Company } from "../company/company.entity";
import { Injectable, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Equals, validate } from "class-validator";
import { MoreThan } from "typeorm";
import * as crypto from "crypto";
import { Equal } from "typeorm";
import { Not } from "typeorm";
const jwt = require("jsonwebtoken");
import * as bcrypt from "bcryptjs";
const uniqueRandom = require("unique-random");
const rand = uniqueRandom(1, 10);
import { MailerService } from "@nestjs-modules/mailer";
import { CompanyStaffStats } from "../../graphql.schema";

import * as os from "os";
import * as fs from "file-system";
import { AllCustomersDto } from "./dto/all-customers.input.dto";
import { MailConfigEnum } from "../../common/email-configs/email-enums";
import { Photo } from "../photo/photos.entity";
import { PhotoTypeEnum } from "../photo/enums/photo.enum";
@Injectable()
export class CustomersSevice {
  constructor(
    private readonly mailerService: MailerService,
    @InjectRepository(Customer)
    public readonly customerRepository: Repository<Customer>,
    @InjectRepository(Company)
    public readonly companyRepository: Repository<Company>,
    @InjectRepository(Photo)
    public readonly photoRepository: Repository<Photo>,
    public smsService: SmsService,
    public customerCreatedEmailTemplateService: CustomerCreatedEmailTemplateService
  ) {}

  async findCustomerStats(
    userRequestData?: JwtPayload
  ): Promise<CustomerStats> {
    let total = await this.customerRepository.count();

    let totalActive = await this.customerRepository.count({
      status: PersonStatusEnum.Active,
    });

    let totalInactive = await this.customerRepository.count({
      status: PersonStatusEnum.Deactivated,
    });

    let newCustomerStats = new CustomerStats();
    newCustomerStats.total = total;
    newCustomerStats.totalActive = totalActive;
    newCustomerStats.totalInactive = totalInactive;

    return newCustomerStats;
  }

  async sendCustomerCreatedEmail(customer: Customer) {
    await this.mailerService
      .sendMail({
        to: `${customer?.email}`,
        from: MailConfigEnum.authUserMail as string,
        subject: `Welcome to ${CompanyEnums.name} `,
        html: this.customerCreatedEmailTemplateService.createCustomerEmailTemplate(
          customer
        ),
        attachments: [
          {
            filename: "logo.jpeg",
            path: `${__dirname}/../../../src/common/email-templates/logo.jpeg`,

            cid: "logo",
          },
        ],
      })
      .then((success) => {
        console.log(success, "email success ");
        return success;
      })
      .catch((error) => {
        console.log(error, "email fail");
      });
  }

  async sendMailPasswordChange(mailData: Customer) {
    if (mailData && mailData.email) {
      this.mailerService
        .sendMail({
          to: `${mailData.email}`, // list of receivers
          from: MailConfigEnum.authUserMail as string, // sender address
          subject: `${CompanyEnums.name} Password Change`, // Subject line
          //text: 'welcome', // plaintext body
          html: `<b>Hi ${mailData.firstName} ${mailData.lastName}</b><br>
                Your ${CompanyEnums.name} credentials have been changed. <br>
                You may login to the system at ${UrlsEnum.productionServerBaseUrl}, <br>
                Login Email:${mailData.email}<br> 
               `, // HTML body content
        })
        .then(() => {})
        .catch((e) => {
          console.log(e);
        });
    }
  }

  async findAll(allCustomersDto?: AllCustomersDto): Promise<Customer[]> {
    return await this.customerRepository.find({
      relations: ["company"],
    });
  }

  async changePassword(entry: ChangePassword): Promise<any> {
    const { newPassword, companyId, email, oldPassword } = entry;

    let foundCustomer = await getRepository(Customer)
      .createQueryBuilder("customer")
      .addSelect("customer.password")
      .where("customer.email = :email", { email: email })
      .getOne();
    if (!foundCustomer) {
      throw new LoginFailException(CUSTOMER_EXCEPTIONS.userNotFound);
    }
    const valid = await bcrypt.compare(oldPassword, foundCustomer.password);
    if (!valid) {
      throw new LoginFailException(CUSTOMER_EXCEPTIONS.passwordMisMatch);
    }
    /*  let password = Math.floor(100000 + Math.random() * 900000).toString(); */
    foundCustomer.password = newPassword;
    let updatedCustomer = await this.customerRepository.save(foundCustomer);
    let sentMail = await this.sendMailPasswordChange(updatedCustomer);
    let sentSms = await this.smsService.sendPasswordChangeSms(updatedCustomer);
    let savedSmsToDb = await this.smsService.saveSmsResult(sentSms, null);
    return updatedCustomer;
  }

  async requestResetPassword(entry: ResetPassword): Promise<any> {
    const { phoneNo, email } = entry;

    let foundCustomer = await getRepository(Customer)
      .createQueryBuilder("customer")
      .addSelect("customer.password")
      .where("customer.phoneNo = :phoneNo", { phoneNo: phoneNo })
      .getOne();

    if (!foundCustomer) {
      throw new LoginFailException(CUSTOMER_EXCEPTIONS.userNotFound);
    }
    let otp = Math.floor(100000 + Math.random() * 900000).toString();
    foundCustomer.otpCode = otp;

    let updatedCustomer = await this.customerRepository.save(foundCustomer);
    let sentMail = await this.sendMailPasswordChange(updatedCustomer);
    let sentSms = await this.smsService.requestPasswordChangeSms(
      updatedCustomer
    );
    let savedSmsToDb = await this.smsService.saveSmsResult(sentSms, null);
    return updatedCustomer;
  }

  async otpResetPassword(entry: OtpResetPassword): Promise<any> {
    const { phoneNo, otpCode, password } = entry;

    let foundCustomer = await getRepository(Customer)
      .createQueryBuilder("customer")
      .addSelect("customer.password")
      .where("customer.otpCode = :otpCode", { otpCode: otpCode })
      .andWhere("customer.phoneNo = :phoneNo", { phoneNo: phoneNo })
      .getOne();

    if (!foundCustomer) {
      throw new LoginFailException(CUSTOMER_EXCEPTIONS.otpMismatch);
    }

    foundCustomer.password = password;

    let updatedCustomer = await this.customerRepository.save(foundCustomer);
    let sentMail = await this.sendMailPasswordChange(updatedCustomer);

    return updatedCustomer;
  }

  async create(entry: CreateCustomerDto): Promise<CustomerRO> {
    // let userPassword = Math.floor(100000 + Math.random() * 900000).toString();

    const { email, phone, base64Image } = entry;

    const errors = await validate(entry);
    if (errors.length > 0) {
      throw new InvalidDataException(errors[0]);
    }
    const companyStaffExists = await this.customerRepository.count({
      email: email,
    });
    if (companyStaffExists > 0) {
      throw new ExistsException(CUSTOMER_EXCEPTIONS.existsEmail);
    }
    let imageType = `.jpeg`;
    let baseImageUrlName;
    if (os.type() == "Windows_NT") {
      baseImageUrlName = UrlsEnum.localHostBaseUrl;
    } else {
      baseImageUrlName = UrlsEnum.prodServerBaseUrl;
    }
    // to declare some path to store your converted image
    //let path = `./../../../reading-images/`;
    let imageName = `${Date.now()}${imageType}`;
    imageName = imageName.replace(/\s+/g, "");
    imageName = imageName.replace(/:/g, "");
    //  path = path.replace(/\s+/g, "");
    let savedImage = await this.saveImageToFile(base64Image, imageName);
    delete entry.base64Image;

    // create new staff
    let newCustomer = new Customer();
    newCustomer = Object.assign(newCustomer, entry);
    newCustomer.profilePhoto = baseImageUrlName + imageName;

    const savedCustomer = await this.customerRepository.save(newCustomer);

    let newPhoto = new Photo();
    newPhoto.customerId = savedCustomer.customerId;
    newPhoto.url = savedCustomer.profilePhoto;
    newPhoto.photoType = PhotoTypeEnum.ProfilePhoto;
    let savedPhoto = await this.photoRepository.save(newPhoto);
    //send sms
    if (savedCustomer) {
      let sentEmail = await this.sendCustomerCreatedEmail(savedCustomer);
      let sentSms = await this.smsService.sendUserCreatedSms(savedCustomer);
      let savedSmsToDb = await this.smsService.saveSmsResult(sentSms, null);
      console.log("sent sms", sentSms);
    }

    return await this.buildCustomerRO(savedCustomer);
  }

  async saveImageToFile(base64: string, imageName: string) {
    base64 = base64.replace(/^data:image\/\w+;base64,/, "");

    let data = fs.writeFileSync(
      __dirname + "/../../../uploads/images/" + imageName,
      base64,
      "base64",
      (err) => {
        console.log(err);
      }
    );
    return data;
  }

  async findCustomerById(
    customerId: number,
    userRequestData?: JwtPayload
  ): Promise<Customer> {
    let foundCustomer = await this.customerRepository.findOne(customerId);
    if (foundCustomer == undefined) {
      throw new NotExistsException(CUSTOMER_EXCEPTIONS.notExist);
    }
    return foundCustomer;
  }

  async updateOne(entry: UpdateCustomerDto): Promise<Customer> {
    let updatedCustomer = new Customer();
    let toUpdate = await this.customerRepository.findOne(entry.customerId);

    if (toUpdate == undefined) {
      throw new NotExistsException(CUSTOMER_EXCEPTIONS.notExistUpdate);
    }
    delete toUpdate.password;
    delete entry.userRequestData;
    let updated = plainToClassFromExist(toUpdate, entry);

    try {
      updatedCustomer = await this.customerRepository.save(updated);
    } catch (error) {
      return error;
    }

    return updatedCustomer;
  }

  async softDeleteOne(customerId: number, userRequestData?: JwtPayload) {
    let toDelete = await this.customerRepository.findOne(customerId);
    if (toDelete == undefined) {
      throw new NotExistsException(CUSTOMER_EXCEPTIONS.userNotFound);
    }
    //softDelete

    let softDeleted = await this.customerRepository.softDelete(toDelete);
    return toDelete;
  }

  async hardDeleteOne(
    customerId: number,
    userRequestData?: JwtPayload
  ): Promise<Customer> {
    let toDelete = await this.customerRepository.findOne(customerId);
    if (toDelete == undefined) {
      throw new NotExistsException(CUSTOMER_EXCEPTIONS.userNotFound);
    }
    //softDelete
    await this.customerRepository.delete({
      customerId: customerId,
    });
    return toDelete;
  }

  async loginUser(loginUserDto: LoginCustomerDto): Promise<CustomerRO> {
    let userFound = await getRepository(Customer)
      .createQueryBuilder("customer")
      .leftJoinAndSelect("customer.company", "company")
      .addSelect("customer.password")
      .where("customer.email = :email", { email: loginUserDto.email })
      .getOne();

    if (!userFound) {
      throw new LoginFailException(CUSTOMER_EXCEPTIONS.incorrectLoginData);
    }
    const valid = await bcrypt.compare(
      loginUserDto.password,
      userFound.password
    );
    if (!valid) {
      throw new LoginFailException(CUSTOMER_EXCEPTIONS.userNotFound);
    }

    return await this.buildCustomerRO(userFound);
  }

  public generateJWT(savedCustomer: Customer) {
    let today = new Date();
    let exp = new Date(today);
    exp.setDate(today.getDate() + 60);
    let expSeconds = exp.getTime() / 1000;

    const companyStaff: JwtPayload = {
      customer: savedCustomer,
      role: savedCustomer?.role,
      email: savedCustomer?.email,
    };
    return jwt.sign(companyStaff, SECRET, { expiresIn: 3600000 });
  }

  private buildCustomerRO(savedCustomer: Customer) {
    const customerRO = {
      customer: savedCustomer,

      token: this.generateJWT(savedCustomer),
    };

    return { customer: customerRO };
  }
}
