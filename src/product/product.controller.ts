import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CreateProductDTO, UpdateProductDTO } from './product.dtos';
import { Request, Response } from 'express';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { UserEntity } from 'src/user/entity/user.entity';

@Controller('product')
export class ProductController {
  constructor(
    @Inject(ProductService)
    private readonly productService: ProductService,
  ) {}

  @Roles(Role.Seller)
  @UseGuards(AuthGuard, RolesGuard)
  @Post('')
  async createProduct(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: CreateProductDTO,
  ) {
    try {
      const user = req.user as UserEntity;

      const payload: CreateProductDTO = {
        ...body,
        seller: user,
        sellerId: user.id,
      };

      console.log(payload);

      const data = await this.productService.create(payload);

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

  @Roles(Role.Seller, Role.Buyer)
  @UseGuards(AuthGuard, RolesGuard)
  @Get('')
  async getProducts(@Req() req: Request, @Res() res: Response): Promise<void> {
    try {
      const data = await this.productService.getProducts();

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

  @Roles(Role.Seller)
  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id')
  async updateProduct(
    @Req() req: Request,
    @Res() res: Response,
    @Body() payload: UpdateProductDTO,
    @Param('id') id: string,
  ): Promise<void> {
    const user = req.user as UserEntity;

    try {
      const data = await this.productService.updateProduct(user, id, payload);

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

  @Roles(Role.Seller)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  async deleteProduct(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
  ): Promise<void> {
    const user = req.user as UserEntity;

    try {
      await this.productService.deleteProduct(user, id);

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
