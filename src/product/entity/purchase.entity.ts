import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from 'src/shared';
import { UserEntity } from 'src/user/entity/user.entity';
import { ProductEntity } from './product.entity';

@Entity('purchase')
export class PurchaseEntity extends BaseEntity {
  @Column({
    type: 'numeric',
  })
  totalCost: number;

  @Column()
  quantity: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;

  @Column()
  userId: string;

  @ManyToOne(() => ProductEntity)
  @JoinColumn()
  product: ProductEntity;

  @Column()
  productId: string;
}
