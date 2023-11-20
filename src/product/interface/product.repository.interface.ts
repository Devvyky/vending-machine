import { BaseInterfaceRepository } from 'src/shared';
import { ProductEntity } from '../entity/product.entity';

export interface ProductRepositoryInterface
  extends BaseInterfaceRepository<ProductEntity> {}
