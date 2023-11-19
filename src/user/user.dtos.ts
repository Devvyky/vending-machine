import { IsIn, IsNotEmpty, IsString, Matches } from 'class-validator';
import { Role, Roles } from 'src/auth/enums/role.enum';

export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9]+$/, {
    message:
      'Username must contain only alphanumeric characters without spaces.',
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
  username: string;
  password: string;
}
