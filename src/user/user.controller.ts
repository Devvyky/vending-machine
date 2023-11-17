import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO, LoginUserDTO, UpdateUserDTO } from './user.dtos';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { Request, Response } from 'express';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { UserEntity } from './user.entity';

@Controller('user')
export class UserController {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: CreateUserDTO,
  ) {
    try {
      const data = this.userService.register(body);

      res.status(201).json({
        status: 'success',
        data,
      });
    } catch (error) {
      res.status(error?.statusCode || 500).json({
        error: error.message,
      });
    }
  }

  @Post('login')
  async login(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: LoginUserDTO,
  ) {
    const { username, password } = body;
    try {
      const data = this.userService.login(username, password);
      res.status(201).json({
        status: 'success',
        data,
      });
    } catch (error) {
      res.status(error?.statusCode || 500).json({
        error: error.message,
      });
    }
  }

  @Roles(Role.Seller)
  @UseGuards(AuthGuard, RolesGuard)
  @Get('/list')
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

  @UseGuards(AuthGuard)
  @Get('')
  async getUser(@Req() req: Request, @Res() res: Response) {
    try {
      const user = req.user as UserEntity;

      console.log(user);
      const data = await this.userService.getUserDetails(user.id);

      res.status(200).json({
        status: 'success',
        data,
      });
    } catch (error) {
      res.status(error?.statusCode || 500).json({
        status: 'fail',
        error: error.message,
      });
    }
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateUser(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id', new ParseIntPipe()) userId: number,
    @Body() payload: UpdateUserDTO,
  ) {
    try {
      const data = await this.userService.updateUser(userId, payload);

      res.status(200).json({
        status: 'success',
        data,
      });
    } catch (error) {
      res.status(error?.statusCode || 500).json({
        status: 'fail',
        error: error.message,
      });
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteUser(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id', new ParseIntPipe()) userId: number,
  ) {
    try {
      await this.userService.deleteUser(userId);

      res.status(204).json({
        status: 'success',
      });
    } catch (error) {
      res.status(error?.statusCode || 500).json({
        status: 'fail',
        error: error.message,
      });
    }
  }
}
