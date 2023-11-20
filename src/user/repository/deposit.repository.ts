import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from 'src/shared';
import { DepositEntity } from '../entity/deposit.entity';
import { DepositRepositoryInterface } from '../interface/deposit.repository.interface';

export class DepositRepository
  extends BaseAbstractRepository<DepositEntity>
  implements DepositRepositoryInterface
{
  constructor(
    @InjectRepository(DepositEntity)
    private readonly DepositRepository: Repository<DepositEntity>,
  ) {
    super(DepositRepository);
  }
}
