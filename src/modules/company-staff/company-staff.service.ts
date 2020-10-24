import { UrlsEnum } from "./../../common/emums/urls.enum";
import { NotExistsException } from "./../../common/exceptions/not-exsist-exception";
import { InvalidDataException } from "./../../common/exceptions/invalid-data-exception";
import { ExistsException } from "./../../common/exceptions/exists-data-exception";
import { LoginFailException } from "./../../common/exceptions/login-fail.exception";
import { CompanyEnums } from "./../../common/emums/string-constants.enums";
import { CompanyStaffCreatedEmailTemplateService } from "./../../common/email-templates/company-staff-created-email.service";
import { SmsTypeEnum } from "../sms/enums/sms.enums";
import {
  CompanyStaffStatusEnum,
  CompanyStaffRoleEnum,
} from "./enums/company-staff.enum";
import { SmsService } from "../sms/sms.service";
import { SendLoginSmsDto } from "../sms/dto/send-sms-token.dto";
import { USER_ROLES } from "./../../common/emums/user-roles.enums";
import {
  COMPANY_EXCEPTIONS,
  COMPANY_STAFF_EXCEPTIONS,
} from "./../../common/errors/errors-constants";
import { JwtPayload } from "./../../common/auth/interfaces/jwt-payload.interface";
import { SECRET } from "./../../config";
import { LoginCompanyStaffDto } from "./dto/login-company-staff-dto";
import { ResetPassword, ChangePassword } from "./dto/reset-password.dto";
import { CompanyStaff } from "./company-staff.entity";
import { CreateCompanyStaffDto } from "./dto/create-company-staff-dto";
import { UpdateCompanyStaffDto } from "./dto/update-company-staff-dto";
import {
  CompanyStaffRO,
  CompanyStaffData,
} from "./interface/company-staff-interface";
import { getConnection, getRepository } from "typeorm";
import { Company } from "../company/company.entity";
import { Injectable, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { validate } from "class-validator";
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
import { Photo } from "../photo/photos.entity";
import { PhotoTypeEnum } from "../photo/enums/photo.enum";
import { OtpResetPassword } from "../customer/dto/reset-password.dto";
@Injectable()
export class CompanyStaffService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectRepository(CompanyStaff)
    public readonly companyStaffRepository: Repository<CompanyStaff>,
    @InjectRepository(Company)
    public readonly companyRepository: Repository<Company>,
    @InjectRepository(Photo)
    public readonly photoRepository: Repository<Photo>,
    public smsService: SmsService,
    public companyStaffCreatedEmailTemplateService: CompanyStaffCreatedEmailTemplateService
  ) {}

  async findCompanyStaffStats(
    userRequestData?: JwtPayload
  ): Promise<CompanyStaffStats> {
    let total = await this.companyStaffRepository.count({
      companyId: Equal(userRequestData.companyStaff.companyId),
    });

    let totalMeterReader = await this.companyStaffRepository.count({
      companyId: Equal(userRequestData.companyStaff.companyId),
      deletedAt: null,
      role: CompanyStaffRoleEnum.meterReader,
    });

    let totalItManager = await this.companyStaffRepository.count({
      companyId: Equal(userRequestData.companyStaff.companyId),
      deletedAt: null,
      role: Equal(CompanyStaffRoleEnum.ItManager),
    });

    let totalAccountant = await this.companyStaffRepository.count({
      companyId: Equal(userRequestData.companyStaff.companyId),
      deletedAt: null,
      role: Equal(CompanyStaffRoleEnum.Accountant),
    });

    let totalManager = await this.companyStaffRepository.count({
      companyId: Equal(userRequestData.companyStaff.companyId),
      deletedAt: null,
      role: Equal(CompanyStaffRoleEnum.Manager),
    });

    let totalStaff = await this.companyStaffRepository.count({
      companyId: Equal(userRequestData.companyStaff.companyId),
      deletedAt: null,
      role: Equal(CompanyStaffRoleEnum.Staff),
    });

    let totalSecretary = await this.companyStaffRepository.count({
      companyId: Equal(userRequestData.companyStaff.companyId),
      deletedAt: null,
      role: Equal(CompanyStaffRoleEnum.Secretary),
    });

    let totalSoftDeleted = await this.companyStaffRepository.count({
      companyId: Equal(userRequestData.companyStaff.companyId),
      deletedAt: Not(null),
    });

    let newCompanyStaffStats = new CompanyStaffStats();
    newCompanyStaffStats.total = total;

    newCompanyStaffStats.totalSoftDeleted = totalSoftDeleted;
    newCompanyStaffStats.totalMeterReader = totalMeterReader;
    newCompanyStaffStats.totalItManager = totalItManager;
    newCompanyStaffStats.totalAccountant = totalAccountant;
    newCompanyStaffStats.totalManager = totalManager;
    newCompanyStaffStats.totalStaff = totalStaff;
    newCompanyStaffStats.totalSecretary = totalSecretary;

    return await newCompanyStaffStats;
  }

  async sendCompanyStaffCreatedEmail(companyStaff: CompanyStaff) {
    let ccEmail: string;
    if (companyStaff?.company) {
      ccEmail = companyStaff?.company.email;
    }

    await this.mailerService
      .sendMail({
        to: `${companyStaff?.email}`,
        cc: [ccEmail],
        from: "info@majipay.co.ke",
        subject: `Welcome to ${CompanyEnums.name} `,
        html: this.companyStaffCreatedEmailTemplateService.createCompanyStaffEmailTemplate(
          companyStaff
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
        console.log(success, "emial success ");
        return success;
      })
      .catch((error) => {
        console.log(error, "email fail");
      });
  }

  async sendMailPasswordChange(mailData: CompanyStaffData) {
    if (mailData && mailData.email) {
      this.mailerService
        .sendMail({
          to: `${mailData.email}`, // list of receivers
          from: "info@saharasoft.co.ke", // sender address
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

  async findAll(
    companyStaffId?: number,
    companyId?: number,
    limit?: any,
    userRequestData?: JwtPayload
  ): Promise<CompanyStaff[]> {
    if (!companyStaffId) {
      return await this.companyStaffRepository.find({
        relations: ["company"],
        where: {
          companyId: companyId,
        },
      });
    }
    if (companyStaffId) {
      return await this.companyStaffRepository.find({
        relations: ["company"],
        where: {
          companyStaffId: MoreThan(companyStaffId),
          companyId: companyId,
        },
      });
    }
  }

  async findCompanyStaffByRoles(roles: CompanyStaffRoleEnum): Promise<any> {
    let companyStaffs = await this.companyStaffRepository.find({
      where: [
        { role: CompanyStaffRoleEnum.Accountant },
        { role: CompanyStaffRoleEnum.ItManager },
        { role: CompanyStaffRoleEnum.Manager },
      ],
      select: ["email"],
    });

    return companyStaffs;
  }

  async changePassword(entry: ChangePassword): Promise<any> {
    const { newPassword, companyId, email, oldPassword } = entry;

    let foundCompanyStaff = await getRepository(CompanyStaff)
      .createQueryBuilder("companyStaff")
      .leftJoinAndSelect("companyStaff.company", "company")
      .addSelect("companyStaff.password")
      .where("companyStaff.email = :email", { email: email })
      .getOne();
    if (!foundCompanyStaff) {
      throw new LoginFailException(COMPANY_STAFF_EXCEPTIONS.userNotFound);
    }
    const valid = await bcrypt.compare(oldPassword, foundCompanyStaff.password);
    if (!valid) {
      throw new LoginFailException(COMPANY_STAFF_EXCEPTIONS.passwordMisMatch);
    }

    foundCompanyStaff.password = newPassword;
    let updatedCompanyStaff = await this.companyStaffRepository.save(
      foundCompanyStaff
    );
    let sentMail = await this.sendMailPasswordChange(updatedCompanyStaff);
    let sentSms = await this.smsService.sendPasswordChangeSms(
      updatedCompanyStaff
    );
    let savedSmsToDb = await this.smsService.saveSmsResult(sentSms, null);
    return updatedCompanyStaff;
  }

  async requestResetPassword(entry: ResetPassword): Promise<any> {
    const { phoneNo, companyId } = entry;
    let foundCompanyStaff = await getRepository(CompanyStaff)
      .createQueryBuilder("companyStaff")
      .leftJoinAndSelect("companyStaff.company", "company")
      .addSelect("companyStaff.password")
      .where("companyStaff.phoneNo = :phoneNo", { phoneNo: phoneNo })
      .getOne();

    if (!foundCompanyStaff) {
      throw new LoginFailException(COMPANY_STAFF_EXCEPTIONS.userNotFound);
    }
    let otp = Math.floor(100000 + Math.random() * 900000).toString();
    foundCompanyStaff.otpCode = otp;

    let updatedCompanyStaff = await this.companyStaffRepository.save(
      foundCompanyStaff
    );
    let sentMail = await this.sendMailPasswordChange(updatedCompanyStaff);
    let sentSms = await this.smsService.sendPasswordChangeSms(
      updatedCompanyStaff
    );
    let savedSmsToDb = await this.smsService.saveSmsResult(sentSms, null);
    return foundCompanyStaff;
  }

  async otpResetPassword(entry: OtpResetPassword): Promise<any> {
    const { phoneNo, otpCode, password } = entry;

    let foundCompanyStaff = await getRepository(CompanyStaff)
      .createQueryBuilder("companyStaff")
      .addSelect("companyStaff.password")
      .where("companyStaff.otpCode = :otpCode", { otpCode: otpCode })
      .andWhere("companyStaff.phoneNo = :phoneNo", { phoneNo: phoneNo })
      .getOne();

    if (!foundCompanyStaff) {
      throw new LoginFailException(COMPANY_STAFF_EXCEPTIONS.otpMismatch);
    }

    foundCompanyStaff.password = password;

    let updatedCustomer = await this.companyStaffRepository.save(
      foundCompanyStaff
    );
    let sentMail = await this.sendMailPasswordChange(updatedCustomer);

    return updatedCustomer;
  }

  async create(entry: CreateCompanyStaffDto): Promise<CompanyStaffRO> {
    const { email, phone, companyId, base64Image } = entry;
    const errors = await validate(entry);
    if (errors.length > 0) {
      throw new InvalidDataException(errors[0]);
    }
    const companyStaffExists = await this.companyStaffRepository.count({
      email: email,
      companyId: companyId,
    });

    const companyPhoneExists = await this.companyStaffRepository.count({
      phone: entry.phone,
      companyId: companyId,
    });
    if (companyStaffExists > 0) {
      throw new ExistsException(COMPANY_STAFF_EXCEPTIONS.existsEmail);
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
    let imageName = `${companyId}-${Date.now()}${imageType}`;
    imageName = imageName.replace(/\s+/g, "");
    imageName = imageName.replace(/:/g, "");

    let savedImage = await this.saveImageToFile(base64Image, imageName);
    delete entry.base64Image;
    // create new staff
    let newCompanyStaff = new CompanyStaff();
    newCompanyStaff = Object.assign(newCompanyStaff, entry);
    newCompanyStaff.profilePhoto = baseImageUrlName + imageName;

    const savedCompanyStaff = await this.companyStaffRepository.save(
      newCompanyStaff
    );

    let newPhoto = new Photo();
    newPhoto.companyStaffId = savedCompanyStaff.companyStaffId;
    newPhoto.url = savedCompanyStaff.profilePhoto;
    newPhoto.photoType = PhotoTypeEnum.ProfilePhoto;
    let savedPhoto = await this.photoRepository.save(newPhoto);

    const savedCompany = await this.companyRepository.findOne(companyId);

    let foundStaffCompany = await this.companyStaffRepository.findOne(
      savedCompanyStaff.companyStaffId,
      {
        relations: ["company", "photos"],
      }
    );

    if (foundStaffCompany && savedCompany) {
      let sentEmail = await this.sendCompanyStaffCreatedEmail(
        foundStaffCompany
      );
      let sentSms = await this.smsService.sendUserCreatedSms(
        foundStaffCompany,
        savedCompany
      );
      let savedSmsToDb = await this.smsService.saveSmsResult(sentSms, null);
      console.log("sent sms", sentSms);
    }
    return await this.buildCompanyStaffRO(foundStaffCompany, savedCompany);
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

  async findCompanyStaffById(
    comapnyStaffId: number,
    userRequestData?: JwtPayload
  ): Promise<CompanyStaff> {
    let foundStaffCompany = userRequestData
      ? await this.companyStaffRepository.findOne(comapnyStaffId, {
          where: { companyId: userRequestData.companyStaff.companyId },
          relations: ["company", "photos"],
        })
      : await this.companyStaffRepository.findOne(comapnyStaffId, {
          relations: ["company", "photos"],
        });
    if (foundStaffCompany == undefined) {
      throw new NotExistsException(COMPANY_STAFF_EXCEPTIONS.notExist);
    }
    return foundStaffCompany;
  }

  async updateOne(entry: UpdateCompanyStaffDto) {
    entry.companyId = entry.userRequestData.companyStaff.companyId;

    let finalUpdatedCompany = new Company();
    let updatedCompanyStaff = new CompanyStaff();
    let toUpdate = await this.companyStaffRepository.findOne(
      entry.companyStaffId
    );

    if (toUpdate == undefined) {
      throw new NotExistsException(COMPANY_STAFF_EXCEPTIONS.notExistUpdate);
    }
    delete toUpdate.password;
    delete entry.userRequestData;
    let updated = Object.assign(toUpdate, entry);

    try {
      updatedCompanyStaff = await this.companyStaffRepository.save(updated);
    } catch (error) {
      return error;
    }

    //get comapany
    try {
      updatedCompanyStaff = await this.findCompanyStaffById(
        updatedCompanyStaff.companyStaffId
      );
    } catch (error) {
      return error;
    }

    return await updatedCompanyStaff;
  }

  async softDeleteOne(companyStaffId: number, userRequestData?: JwtPayload) {
    let toDelete = await this.companyStaffRepository.findOne(companyStaffId, {
      where: { companyId: userRequestData.companyStaff.companyId },
    });
    if (toDelete == undefined) {
      throw new NotExistsException(COMPANY_STAFF_EXCEPTIONS.userNotFound);
    }
    //softDelete

    let softDeleted = await this.companyStaffRepository.softDelete(toDelete);
    return toDelete;
  }

  async hardDeleteOne(
    companyStaffId: number,
    userRequestData?: JwtPayload
  ): Promise<CompanyStaff> {
    let toDelete = await this.companyStaffRepository.findOne(companyStaffId, {
      where: { companyId: userRequestData.companyStaff.companyId },
    });
    if (toDelete == undefined) {
      throw new NotExistsException(COMPANY_STAFF_EXCEPTIONS.userNotFound);
    }
    //softDelete
    await this.companyStaffRepository.delete({
      companyStaffId: companyStaffId,
    });
    return toDelete;
  }

  async loginUser(loginUserDto: LoginCompanyStaffDto): Promise<CompanyStaffRO> {
    let userFound = await getRepository(CompanyStaff)
      .createQueryBuilder("companyStaff")
      .leftJoinAndSelect("companyStaff.company", "company")
      .addSelect("companyStaff.password")
      .where("companyStaff.email = :email", { email: loginUserDto.email })
      .getOne();

    if (!userFound) {
      throw new LoginFailException(COMPANY_STAFF_EXCEPTIONS.incorrectLoginData);
    }
    const valid = await bcrypt.compare(
      loginUserDto.password,
      userFound.password
    );
    if (!valid) {
      throw new LoginFailException(COMPANY_STAFF_EXCEPTIONS.userNotFound);
    }

    return await this.buildCompanyStaffRO(userFound);
  }

  async generateSuperAdminJWT(companyStaffId: number, companyId: number) {
    let today = new Date();
    let exp = new Date(today);
    exp.setDate(today.getDate() + 60);
    let expSeconds = exp.getTime() / 1000;

    let companyStaff = await this.companyStaffRepository.findOne(
      companyStaffId
    );
    let company = await this.companyRepository.findOne(companyId);
    const companyStaffData: JwtPayload = {
      companyStaff: companyStaff,
    };
    let token: string = jwt.sign(companyStaffData, SECRET, {
      expiresIn: 3600000,
    });
    return token;
  }

  public generateJWT(savedCompanyStaff: CompanyStaff, company?: Company) {
    let today = new Date();
    let exp = new Date(today);
    exp.setDate(today.getDate() + 60);
    let expSeconds = exp.getTime() / 1000;

    const companyStaff: JwtPayload = {
      companyStaff: savedCompanyStaff,
      role: savedCompanyStaff?.role,
      email: savedCompanyStaff?.email,
    };
    return jwt.sign(companyStaff, SECRET, { expiresIn: 3600000 });
  }

  private buildCompanyStaffRO(
    savedCompanyStaff: CompanyStaff,
    company?: Company
  ) {
    const companyStaffRO = {
      companyStaff: savedCompanyStaff,
      token: this.generateJWT(savedCompanyStaff, company),
    };

    return { companyStaff: companyStaffRO };
  }
}
