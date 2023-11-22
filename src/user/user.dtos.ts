import { IsIn, IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';
import { Role, Roles } from 'src/auth/enums/role.enum';
import { UserEntity } from './entity/user.entity';

export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9]+$/, {
    message:
      'username must contain only alphanumeric characters without spaces.',
  })
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(Roles)
  role: Role;
}

export class LoginUserDTO {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class UpdateUserDTO {
  @Matches(/^[a-zA-Z0-9]+$/, {
    message:
      'username must contain only alphanumeric characters without spaces.',
  })
  username: string;
}

export class DepositDTO {
  @IsNotEmpty()
  @IsNumber()
  @IsIn([5, 10, 20, 50, 100])
  amount: number;

  user: UserEntity;

  userId: string;
}
