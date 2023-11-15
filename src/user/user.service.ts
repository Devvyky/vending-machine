import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './user.entity';
import { CreateUserDTO } from './user.dtos';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async findByUsername(username: string): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: { username },
      select: ['id', 'username', 'password'],
    });
  }

  async register(payload: CreateUserDTO): Promise<UserEntity> {
    const { username, password, role } = payload;

    const existingUser = await this.findByUsername(username);
    if (existingUser) {
      throw new ConflictException(
        'An account with that username already exists',
      );
    }

    const hashedPassword = await this.authService.hashPassword(password);

    const newUser = await this.userRepository.save({
      username,
      password: hashedPassword,
      role,
    });

    delete newUser.password;
    return newUser;
  }

  async login(email: string, password: string): Promise<{ token: string }> {
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.authService.signJwt({ user });
    return { token };
  }
}
