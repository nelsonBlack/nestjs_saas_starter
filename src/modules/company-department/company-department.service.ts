import { DepartmentStatus } from "./../../common/emums/department-status.enum";
import { NotExistsException } from "./../../common/exceptions/not-exsist-exception";
import { InvalidDataException } from "./../../common/exceptions/invalid-data-exception";
import { AllCompanyDepartmentsDto } from "./dto/query-all-company-department.dto";
import { CreateCompanyDepartmentDto } from "./dto/create-company-department.dto";
import { UpdateCompanyDepartmentDto } from "./dto/update-company-department.dto";
import { CompanyDepartment } from "./company-department.entity";
import { CompanyDepartmentStatus } from "./enums/company-company-department.enums";
import { CompanyStats, CompanyDepartmentStats } from "./../../graphql.schema";
import { JwtPayload } from "./../../common/auth/interfaces/jwt-payload.interface";
import { COMPANY_DEPARTMENT_EXCEPTIONS } from "./../../common/errors/errors-constants";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { validate } from "class-validator";
import { MailerService } from "@nestjs-modules/mailer";
import { Not } from "typeorm";
@Injectable()
export class CompanyDepartmentService {
  constructor(
    @InjectRepository(CompanyDepartment)
    public readonly companyDepartmentRepository: Repository<CompanyDepartment>,
    private readonly mailerService: MailerService
  ) {}

  async findCompanyDepartmentStats(
    userRequestData: JwtPayload
  ): Promise<CompanyDepartmentStats> {
    let total = await this.companyDepartmentRepository.count({
      where: {
        companyId: userRequestData.companyStaff.companyId,
      },
    });
    let totalActive = await this.companyDepartmentRepository.count({
      status: DepartmentStatus.Active,
      companyId: userRequestData.companyStaff.companyId,
    });
    let totalInactive = await this.companyDepartmentRepository.count({
      status: DepartmentStatus.Deactivated,
      companyId: userRequestData.companyStaff.companyId,
    });
    let totalSoftDeleted = await this.companyDepartmentRepository.count({
      companyId: userRequestData.companyStaff.companyId,
      deletedAt: Not(null),
    });
    let newCompanyDepartmentStats = new CompanyStats();
    newCompanyDepartmentStats.total = total;
    newCompanyDepartmentStats.totalActive = totalActive;
    newCompanyDepartmentStats.totalInactive = totalInactive;
    newCompanyDepartmentStats.totalSoftDeleted = totalSoftDeleted;

    return await newCompanyDepartmentStats;
  }

  async findAll(
    entry?: AllCompanyDepartmentsDto
  ): Promise<CompanyDepartment[]> {
    let companyDepartments = await this.companyDepartmentRepository.find({
      where: {
        companyId: entry.userRequestData.companyStaff.companyId,
      },
    });
    return companyDepartments;
  }

  async findOneById(id: number): Promise<CompanyDepartment> {
    let foundDepartmentCompany = await this.companyDepartmentRepository.findOne(
      id
    );
    if (foundDepartmentCompany == undefined) {
      throw new NotExistsException(COMPANY_DEPARTMENT_EXCEPTIONS.notExist);
    }
    return foundDepartmentCompany;
  }

  async create(entry: CreateCompanyDepartmentDto): Promise<CompanyDepartment> {
    let newComapanyDepartment = new CompanyDepartment();

    newComapanyDepartment = Object.assign(newComapanyDepartment, entry);

    const errors = await validate(newComapanyDepartment);
    if (errors.length > 0) {
      throw new InvalidDataException(errors[0]);
    } else {
      const savedCompanyDepartment = await this.companyDepartmentRepository.save(
        newComapanyDepartment
      );
      if (newComapanyDepartment.email) {
        const sentEmail = await this.sendMail(newComapanyDepartment);
      }

      return savedCompanyDepartment;
    }
  }

  async sendMail(companyDepartment: CompanyDepartment) {
    this.mailerService.sendMail({
      to: `${companyDepartment.email}`, // sender address
      from: "info@majipay.co.ke", // list of receivers
      subject: "WELCOME TO SAFECABS✔", // Subject line
      //text: 'welcome', // plaintext body
      html: `<b>Hi ${companyDepartment.name} </b><br>
              Welcome to sAFECABS Application. Eassy , Efficient and Secure.<br>
             For any queries, please contact us on <strong>info@majipay.co.ke</strong> or call us on <strong>+254721137000</strong>`, // HTML body content
    });
  }

  async updateOne(dto: UpdateCompanyDepartmentDto): Promise<CompanyDepartment> {
    let toUpdate = await this.companyDepartmentRepository.findOne(
      dto.companyDepartmentId
    );
    if (toUpdate == undefined) {
      throw new NotExistsException(
        COMPANY_DEPARTMENT_EXCEPTIONS.notExistUpdate
      );
    }

    let updated = Object.assign(toUpdate, dto);
    return await this.companyDepartmentRepository.save(updated);
  }

  async hardDeleteOne(companyDepartmentId: number) {
    let toDelete = await this.companyDepartmentRepository.findOne(
      companyDepartmentId
    );
    if (toDelete == undefined) {
      throw new NotExistsException(
        COMPANY_DEPARTMENT_EXCEPTIONS.notExistUpdate
      );
    }
    //HARDDelete
    await this.companyDepartmentRepository.delete(companyDepartmentId);
    return toDelete;
  }

  async softDeleteOne(companyDepartmentId: number) {
    let toDelete = await this.companyDepartmentRepository.findOne(
      companyDepartmentId
    );
    if (toDelete == undefined) {
      throw new NotExistsException(COMPANY_DEPARTMENT_EXCEPTIONS.notExist);
    }

    await this.companyDepartmentRepository.softDelete(companyDepartmentId);
    return toDelete;
  }
}
