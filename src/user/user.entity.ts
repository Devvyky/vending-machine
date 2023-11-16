import { Role } from 'src/auth/enums/role.enum';
import { BaseEntity } from 'src/shared/entity/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('user')
export class UserEntity extends BaseEntity {
  @Column({ unique: true })
  username: string;

  @Column({ select: false })
  password: string;

  @Column({
    default: 0,
  })
  deposit: number;

  @Column({ type: 'enum', enum: Role, default: Role.Buyer })
  role: Role;
}
