import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserEntity } from './entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { UserRepository } from './repository/user.repository';
import { DepositRepository } from './repository/deposit.repository';
import { DepositEntity } from './entity/deposit.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, DepositEntity]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    JwtService,
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
    {
      provide: 'DepositRepositoryInterface',
      useClass: DepositRepository,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
