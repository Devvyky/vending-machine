import { BaseInterfaceRepository } from 'src/shared';
import { UserEntity } from '../entity/user.entity';

export interface UserRepositoryInterface
  extends BaseInterfaceRepository<UserEntity> {}
