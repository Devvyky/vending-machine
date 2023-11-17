import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO, LoginUserDTO } from './user.dtos';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { Request, Response } from 'express';
import { RolesGuard } from 'src/auth/guards/role.guard';

@Controller('user')
export class UserController {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  @Post('')
  async register(@Body() body: CreateUserDTO) {
    return this.userService.register(body);
  }

  @Post('login')
  async login(@Body() body: LoginUserDTO) {
    const { username, password } = body;
    return this.userService.login(username, password);
  }

  @Roles(Role.Seller)
  @UseGuards(AuthGuard, RolesGuard)
  @Get('')
  async getUsers(@Req() req: Request, @Res() res: Response) {
    try {
      const data = await this.userService.getUsers();

      res.status(200).json({
        status: 'success',
        data,
      });
    } catch (error) {
      res.status(error?.statusCode || 500).json({
        error: error.message,
      });
    }
  }
}
