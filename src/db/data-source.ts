import { ProductEntity } from 'src/product/entity/product.entity';
import { PurchaseEntity } from 'src/product/entity/purchase.entity';
import { DepositEntity } from 'src/user/entity/deposit.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.POSTGRES_URI,
  entities: [UserEntity, ProductEntity, DepositEntity, PurchaseEntity],
  migrations: ['dist/db/migrations/*.js'],
};

export const dataSource = new DataSource(dataSourceOptions);
