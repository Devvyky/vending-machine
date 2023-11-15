import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [forwardRef(() => UserModule)],
  providers: [AuthService, JwtService],
  exports: [AuthService],
})
export class AuthModule {}
