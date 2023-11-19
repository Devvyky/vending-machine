import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from 'src/shared';
import { ProductEntity } from '../product.entity';
import { ProductRepositoryInterface } from '../interface/product.repository.interface';

export class ProductRepository
  extends BaseAbstractRepository<ProductEntity>
  implements ProductRepositoryInterface
{
  constructor(
    @InjectRepository(ProductEntity)
    private readonly ProductRepository: Repository<ProductEntity>,
  ) {
    super(ProductRepository);
  }
}
