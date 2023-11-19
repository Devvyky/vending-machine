import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from 'src/shared';
import { UserEntity } from 'src/user/entity/user.entity';

@Entity('product')
export class ProductEntity extends BaseEntity {
  @Column()
  amountAvailable: number;

  @Column({
    type: 'numeric',
  })
  cost: number;

  @Column()
  productName: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  seller: UserEntity;

  @Column()
  sellerId: string;
}
