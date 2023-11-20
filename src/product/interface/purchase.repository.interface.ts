import { BaseInterfaceRepository } from 'src/shared';
import { PurchaseEntity } from '../entity/purchase.entity';

export interface PurchaseRepositoryInterface
  extends BaseInterfaceRepository<PurchaseEntity> {}
