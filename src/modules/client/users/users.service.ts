// src/users/users.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Users from './users.entity';
import { CreateUserDto } from './dtos/create.user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async findOne(username: string): Promise<Users> {
    const user = await this.usersRepository.findOne({ where: { username } });
    if (!user) {
      throw new HttpException('Invalid username', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<Users | null> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user) return user;
	return null;
  }

  async createUser(createUserDto: CreateUserDto): Promise<Users> {
    const user = this.usersRepository.create(createUserDto);
    const saved_user = await this.usersRepository.save(user);
    if (!saved_user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return saved_user;
  }

  async updateUser(id: number, updateUserDto: any): Promise<Users> {
    const result = await this.usersRepository.update(id, updateUserDto);
    if (!result.affected) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return result.raw;
  }

  async findUserRefreshToken(username: string): Promise<Users> {
    const refresh_token = await this.usersRepository.findOne({
      where: { username },
      select: ['refresh_token'],
    });
    if (!refresh_token) {
      throw new HttpException('Invalid email', HttpStatus.UNAUTHORIZED);
    }
    return refresh_token;
  }
}
