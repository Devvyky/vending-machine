import { BaseInterfaceRepository } from 'src/shared';
import { DepositEntity } from '../entity/deposit.entity';

export interface DepositRepositoryInterface
  extends BaseInterfaceRepository<DepositEntity> {}
