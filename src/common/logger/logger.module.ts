import { TypeOrmModule } from "@nestjs/typeorm";
import { ErrorLogger } from "./logger.entity";
import { MyLogger } from "./logger.service";
import { Module } from "@nestjs/common";
@Module({
  imports: [TypeOrmModule.forFeature([ErrorLogger])],
  providers: [MyLogger],
  exports: [MyLogger]
})
export class LoggerModule {}
