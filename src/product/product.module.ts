import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductRepository } from './repository/product.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entity/product.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserRepository } from 'src/user/repository/user.repository';
import { UserEntity } from 'src/user/entity/user.entity';
import { PurchaseRepository } from './repository/purchase.repository';
import { PurchaseEntity } from './entity/purchase.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([ProductEntity, UserEntity, PurchaseEntity]),
  ],
  providers: [
    ProductService,
    {
      provide: 'ProductRepositoryInterface',
      useClass: ProductRepository,
    },
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
    {
      provide: 'PurchaseRepositoryInterface',
      useClass: PurchaseRepository,
    },
  ],
  controllers: [ProductController],
})
export class ProductModule {}
