import { BaseInterfaceRepository } from 'src/shared';
import { ProductEntity } from '../product.entity';

export interface ProductRepositoryInterface
  extends BaseInterfaceRepository<ProductEntity> {}
