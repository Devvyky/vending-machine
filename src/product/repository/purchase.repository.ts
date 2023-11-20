import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from 'src/shared';
import { PurchaseEntity } from '../entity/purchase.entity';
import { PurchaseRepositoryInterface } from '../interface/purchase.repository.interface';

export class PurchaseRepository
  extends BaseAbstractRepository<PurchaseEntity>
  implements PurchaseRepositoryInterface
{
  constructor(
    @InjectRepository(PurchaseEntity)
    private readonly PurchaseRepository: Repository<PurchaseEntity>,
  ) {
    super(PurchaseRepository);
  }
}
