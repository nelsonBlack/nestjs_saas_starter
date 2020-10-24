import { JwtAuthGuard } from './jwt-auth.guard';
import { CompanyStaffModule } from './../../modules/company-staff/company-staff.module';
import { HttpStrategy  } from './http.strategy'; 
import { AuthService } from './auth.service';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
@Module({
  imports: [CompanyStaffModule,JwtAuthGuard],
  providers: [AuthService,HttpStrategy ],
  exports:[AuthService]
})
export class AuthModule {}