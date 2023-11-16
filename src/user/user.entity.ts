import { Role } from 'src/auth/enums/role.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ select: false })
  password: string;

  @Column({
    default: 0,
  })
  deposit: number;

  @Column({ type: 'enum', enum: Role, default: Role.Buyer })
  role: string;

  @Column({ default: false })
  isDeleted: false;
}
