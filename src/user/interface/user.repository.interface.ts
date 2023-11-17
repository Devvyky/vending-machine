import { BaseInterfaceRepository } from 'src/shared';
import { UserEntity } from '../user.entity';

export interface UserRepositoryInterface
  extends BaseInterfaceRepository<UserEntity> {}
