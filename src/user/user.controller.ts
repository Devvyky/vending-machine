import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO, LoginUserDTO } from './user.dtos';
import { AuthGuard } from 'src/auth/guards/auth.guard';

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

  @UseGuards(AuthGuard)
  @Get('')
  async getUsers() {
    return this.userService.getUsers();
  }
}
