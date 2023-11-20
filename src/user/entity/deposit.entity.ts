import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from 'src/shared';
import { UserEntity } from './user.entity';

@Entity('deposit')
export class DepositEntity extends BaseEntity {
  @Column({ type: 'numeric' })
  amount: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;

  @Column()
  userId: string;
}
