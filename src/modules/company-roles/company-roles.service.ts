import { CompanyStaffRoleStats } from "./../../graphql.schema";
import { QueryAllCompanyStaffRolesDto } from "./dto/query-all-company-roles.dto";
import { Company } from "../company/company.entity";
import { CompanyStaffRole } from "./company-roles.entity";
import { UpdateCompanyStaffRoleDto } from "./dto/update-company-roles.dto";
import { CreateCompanyStaffRoleDto } from "./dto/create-company-roles.dto";
import { ExistsException } from "./../../common/exceptions/exists-data-exception";
import { InvalidDataException } from "./../../common/exceptions/invalid-data-exception";
import { NotExistsException } from "./../../common/exceptions/not-exsist-exception";
import { USER_ROLES } from "./../../common/emums/user-roles.enums";
import { ROLES_EXCEPTIONS } from "./../../common/errors/errors-constants";
import { JwtPayload } from "./../../common/auth/interfaces/jwt-payload.interface";
import { Injectable, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { validate } from "class-validator";
import { MoreThan, Not, IsNull, Equal } from "typeorm";
import * as crypto from "crypto";

@Injectable()
export class CompanyStaffRoleService {
  constructor(
    @InjectRepository(CompanyStaffRole)
    public readonly companyStaffRoleRepository: Repository<CompanyStaffRole>,
    @InjectRepository(Company)
    public readonly companyRepository: Repository<Company>
  ) {}

  async findCompanyStaffRoleStats(
    userRequestData?: JwtPayload
  ): Promise<CompanyStaffRoleStats> {
    let total = await this.companyStaffRoleRepository.count({
      companyId: Equal(userRequestData.companyStaff.companyId),
    });

    let newCompanyStaffRoleStats = new CompanyStaffRoleStats();
    newCompanyStaffRoleStats.total = total;

    return await newCompanyStaffRoleStats;
  }

  async findAll(
    entry: QueryAllCompanyStaffRolesDto
  ): Promise<CompanyStaffRole[]> {
    const { companyStaffRoleId, companyId, limit, userRequestData } = entry;
    return await this.companyStaffRoleRepository.find({
      relations: ["company"],
      where: {
        companyId: userRequestData.companyStaff.companyId,
      },
    });
  }

  async findOneById(
    companyStaffRoleId: number,
    userRequestData?: JwtPayload
  ): Promise<CompanyStaffRole> {
    let foundTariff = await this.companyStaffRoleRepository.findOne(
      companyStaffRoleId,
      {
        where: { companyId: userRequestData.companyStaff.companyId },
        relations: ["company"],
      }
    );
    if (foundTariff == undefined) {
      throw new ExistsException(ROLES_EXCEPTIONS.notExist);
    }
    return foundTariff;
  }

  async create(entry: CreateCompanyStaffRoleDto): Promise<CompanyStaffRole> {
    entry.companyId = entry.userRequestData.companyStaff.companyId;

    let nameCount = await this.companyStaffRoleRepository.count({
      name: entry.name,
      companyId: entry.companyId,
    });
    let displayNameCount = await this.companyStaffRoleRepository.count({
      displayName: entry.displayName,
      companyId: entry.companyId,
    });
    if (nameCount > 0) {
      throw new ExistsException(ROLES_EXCEPTIONS.existsName);
    }
    if (displayNameCount > 0) {
      throw new ExistsException(ROLES_EXCEPTIONS.existsDisplayName);
    }

    let newCompanyStaffRole = new CompanyStaffRole();
    newCompanyStaffRole = Object.assign(newCompanyStaffRole, entry);

    const errors = await validate(newCompanyStaffRole);
    if (errors.length > 0) {
      throw new InvalidDataException(errors);
    }
    const savedCompanyStaffRole = await this.companyStaffRoleRepository.save(
      newCompanyStaffRole
    );

    return savedCompanyStaffRole;
  }

  async updateOne(entry: UpdateCompanyStaffRoleDto): Promise<CompanyStaffRole> {
    let toUpdate = await this.companyStaffRoleRepository.findOne(
      entry.companyStaffRoleId
    );
    if (toUpdate == undefined) {
      throw new ExistsException(ROLES_EXCEPTIONS.notExistUpdate);
    }
    let updated = Object.assign(toUpdate, entry);
    let updatedCompanyStaffRole = await this.companyStaffRoleRepository.save(
      updated
    );

    return await updatedCompanyStaffRole;
  }

  async softDeleteOne(
    companyStaffRoleId: number,
    userRequestData?: JwtPayload
  ): Promise<CompanyStaffRole> {
    let toDelete = await this.companyStaffRoleRepository.findOne(
      companyStaffRoleId,
      {
        where: { companyId: userRequestData.companyStaff.companyId },
      }
    );
    if (toDelete == undefined) {
      throw new NotExistsException(ROLES_EXCEPTIONS.notExist);
    }

    let softDeleted = await this.companyStaffRoleRepository.save(toDelete);
    return softDeleted;
  }

  async hardDeleteOne(
    companyStaffRoleId: number,
    userRequestData?: JwtPayload
  ): Promise<CompanyStaffRole> {
    let toDelete = await this.companyStaffRoleRepository.findOne(
      companyStaffRoleId,
      {
        where: { companyId: userRequestData.companyStaff.companyId },
      }
    );
    if (toDelete == undefined) {
      throw new NotExistsException(ROLES_EXCEPTIONS.notExist);
    }

    await this.companyStaffRoleRepository.delete({
      companyStaffRoleId: companyStaffRoleId,
    });
    return toDelete;
  }
}
