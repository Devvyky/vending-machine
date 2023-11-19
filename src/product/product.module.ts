import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductRepository } from './repository/product.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([ProductEntity])],
  providers: [
    ProductService,
    {
      provide: 'ProductRepositoryInterface',
      useClass: ProductRepository,
    },
  ],
  controllers: [ProductController],
})
export class ProductModule {}
