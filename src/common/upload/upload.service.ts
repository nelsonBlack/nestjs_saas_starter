import { Company } from "./../../modules/company/company.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";

const excelToJson = require("convert-excel-to-json");
@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(Company)
    public readonly companyRepository: Repository<Company>
  ) {
    //this.readXlsOne();
    // this.readXlsTwo();
  }
  //create customer
  //create accoun
  //create create water meter
  //create installation
  async readXlsOne() {
    const result = excelToJson({
      sourceFile: `${__dirname}/../../../src/common/upload/xls-uploads/easy_water_data.xlsx`,
      header: {
        rows: 5, // 2, 3, 4, etc.
      },
      sheets: [
        {
          name: "internalClients",
          columnToKey: {
            A: "number",
            B: "customerName",
            C: "meterNumber",
            D: "phone",
            E: "email",
            F: "previous",
            G: "current",
            H: "consumption",
            I: "rate",
            J: "amount",
            K: "meterRent",
            L: "BF",
            M: "Total",
            N: "Received",
            O: "CF",
            P: "date",
          },
        },
      ],
    });

    //  console.log(result);
    result.internalClients.pop();
  }

  async readXlsTwo() {
    const result = excelToJson({
      sourceFile: `${__dirname}/../../../src/common/upload/xls-uploads/easy_water_data.xlsx`,
      header: {
        rows: 5, // 2, 3, 4, etc.
      },
      sheets: [
        {
          name: "externalClients",
          columnToKey: {
            A: "meterNumber",
            B: "customerName",
            C: "phone",
            D: "email",
            E: "previous",
            F: "current",
            G: "consumption",
            H: "rate",
            I: "amount",
            J: "BF",
            K: "charges",
            L: "Total",
            M: "Received",
            N: "CF",
            O: "date",
            P: "number",
          },
        },
      ],
    });
  }
}
