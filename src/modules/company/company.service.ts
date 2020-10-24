import { NotExistsException } from "./../../common/exceptions/not-exsist-exception";
import { InvalidDataException } from "./../../common/exceptions/invalid-data-exception";
import { ExistsException } from "./../../common/exceptions/exists-data-exception";
import { CompanyStats } from "../../graphql.schema";
import { CompanyStatus } from "./enums/company-enums";
import { USER_ROLES } from "../../common/emums/user-roles.enums";
import { JwtPayload } from "../../common/auth/interfaces/jwt-payload.interface";
import { COMPANY_EXCEPTIONS } from "../../common/errors/errors-constants";
import { Company } from "./company.entity";
import { UpdateCompanyDto } from "./dto/update-company-dto";
import { CreateCompanyDto } from "./dto/create-company-dto";
import { Injectable } from "@nestjs/common";
import * as wkx from "wkx";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { validate } from "class-validator";
import { MailerService } from "@nestjs-modules/mailer";
import { Not } from "typeorm";
import { AllCompanysDto } from "./dto/query-all-company.dto";
@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    public readonly companyRepository: Repository<Company>,
    private readonly mailerService: MailerService
  ) {}

  async findCompanyStats(userRequestData: JwtPayload): Promise<CompanyStats> {
    if (userRequestData.companyStaff.role === USER_ROLES.SuperAdmin) {
      let total = await this.companyRepository.count();
      let totalActive = await this.companyRepository.count({
        status: CompanyStatus.Active,
      });
      let totalInactive = await this.companyRepository.count({
        status: CompanyStatus.Deactivated,
      });

      let newCompanyStats = new CompanyStats();
      newCompanyStats.total = total;
      newCompanyStats.totalActive = totalActive;
      newCompanyStats.totalInactive = totalInactive;

      return await newCompanyStats;
    }
  }

  async findAll(entry?: AllCompanysDto): Promise<Company[]> {
    let companys = await this.companyRepository.find();
    return companys;
  }

  async findOneById(id: number): Promise<Company> {
    let foundCompany = await this.companyRepository.findOne(id, {
      relations: ["companyStaff"],
    });
    return foundCompany;
  }

  async create(entry: CreateCompanyDto): Promise<Company> {
    const { latitude, longitude } = entry;

    /* check company name uniqueness */
    const companyNameExists = await this.companyRepository.count({
      name: entry.name,
    });

    const companyEmailExists = await this.companyRepository.count({
      name: entry.email,
    });

    if (companyEmailExists && companyNameExists > 0) {
      throw new ExistsException(COMPANY_EXCEPTIONS.existsNameEmail);
    }

    if (companyEmailExists > 0) {
      throw new ExistsException(COMPANY_EXCEPTIONS.existsEmail);
    }
    if (companyNameExists > 0) {
      throw new ExistsException(COMPANY_EXCEPTIONS.existsName);
    }

    let newCompany = new Company();
    if (latitude && longitude) {
      entry.position = `POINT(${latitude} ${longitude})`;
    }

    newCompany = Object.assign(newCompany, entry);

    const errors = await validate(newCompany);
    if (errors.length > 0) {
      throw new InvalidDataException(COMPANY_EXCEPTIONS.invalidData);
    } else {
      const savedCompany = await this.companyRepository.save(newCompany);
      const sentEmail = await this.sendMail(newCompany);
      // let geometry = wkx.Geometry.parse(savedCompany.position);
      // console.log(geometry);
      return savedCompany;
    }
  }

  async sendMail(company: Company) {
    this.mailerService.sendMail({
      to: `${company.email}`, // sender address
      from: "info@majipay.co.ke", // list of receivers
      subject: "WELCOME TO SAFECABS✔", // Subject line
      //text: 'welcome', // plaintext body
      html: `<b>Hi ${company.name} </b><br>
              Welcome to sAFECABS Meter Reading Application. Eassy , Efficient and Secure.<br>
             For any queries, please contact us on <strong>info@majipay.co.ke</strong> or call us on <strong>+254721137000</strong>`, // HTML body content
    });
  }

  async findCompanyById(id: number) {
    let foundCompany = await this.companyRepository.findOne(id, {
      relations: ["companyStaff"],
    });
    if (foundCompany == undefined) {
      throw new NotExistsException(COMPANY_EXCEPTIONS.notExist);
    }
    return foundCompany;
  }

  async getCompanyWithMpesaBusinessShortCode(businessShortCode: string) {
    let foundCompany = await this.companyRepository.findOne({
      where: { payBillNumber: businessShortCode },
    });
    return foundCompany;
  }
  async updateOne(dto: UpdateCompanyDto): Promise<Company> {
    let toUpdate = await this.companyRepository.findOne(dto.companyId);
    if (toUpdate == undefined) {
      throw new NotExistsException(COMPANY_EXCEPTIONS.notExist);
    }
    if (dto.latitude && dto.longitude) {
      dto.position = `POINT(${dto.latitude} ${dto.longitude})`;
    }

    let updated = Object.assign(toUpdate, dto);
    return await this.companyRepository.save(updated);
  }

  async hardDeleteOne(companyId: number) {
    let toDelete = await this.companyRepository.findOne(companyId);
    if (toDelete == undefined) {
      throw new NotExistsException(COMPANY_EXCEPTIONS.notExist);
    }
    //HARDDelete
    await this.companyRepository.delete({ companyId: companyId });
    return toDelete;
  }

  async softDeleteOne(companyId: number) {
    let toDelete = await this.companyRepository.findOne(companyId);
    if (toDelete == undefined) {
      throw new NotExistsException(COMPANY_EXCEPTIONS.notExist);
    }
    //softDelete
    toDelete.deletedAt = new Date().toISOString();
    await this.companyRepository.softDelete(companyId);
    return toDelete;
  }
}
