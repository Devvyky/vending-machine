import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO, LoginUserDTO } from './user.dtos';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('')
  async register(@Body() body: CreateUserDTO) {
    return this.userService.register(body);
  }

  @Post('login')
  async login(@Body() body: LoginUserDTO) {
    const { username, password } = body;
    return this.userService.login(username, password);
  }
}
