import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from './user.dtos';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(username: string, password: string): Promise<UserEntity> {
    const user = await this.findByUsername(username);
    const doesUserExist = !!user;

    if (!doesUserExist) return null;

    const doesPasswordMatch = await this.doesPasswordMatch(
      password,
      user.password,
    );

    if (!doesPasswordMatch) return null;

    delete user.password;
    return user;
  }

  async doesPasswordMatch(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async findByUsername(username: string): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: { username },
      select: ['id', 'username', 'password'],
    });
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async register(payload: CreateUserDTO): Promise<UserEntity> {
    const { username, password, role } = payload;

    const existingUser = await this.findByUsername(username);
    if (existingUser) {
      throw new ConflictException(
        'An account with that username already exists',
      );
    }

    const hashedPassword = await this.hashPassword(password);

    const newUser = await this.userRepository.save({
      username,
      password: hashedPassword,
      role,
    });

    delete newUser.password;
    return newUser;
  }

  async login(email: string, password: string): Promise<{ token: string }> {
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.jwtService.signAsync(
      { user },
      { secret: this.configService.get('JWT_SECRET') },
    );
    return { token };
  }
}
