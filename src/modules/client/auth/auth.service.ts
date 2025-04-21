// Main Imports
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

// User Imports
import { UsersService } from '../users/users.service';

// Auth types
import type { CreateUserDto } from '../users/dtos/create.user.dto';
import type {
  SignInResponse,
  SignUpResponse,
  ValidateUserResponse,
} from './types/auth.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<ValidateUserResponse | null> {
    const user = await this.usersService.findOne(username);
    const decodedPassword = await bcrypt.compare(pass, user.password);
    if (!decodedPassword)
      throw new HttpException(
        'Invalid Passowrd is Wrong',
        HttpStatus.UNAUTHORIZED,
      );
    if (!user) return null;
    const { password, refresh_token, ...result } = user;
    return result;
  }

  async login(user: ValidateUserResponse): Promise<SignInResponse> {
    const payload = { username: user.username, sub: user.id };
    const token = this.jwtService.sign(payload);
    return {
      token,
      ...user,
    };
  }

  async signup(user: CreateUserDto): Promise<SignUpResponse> {
    try {
      // Check if user is Local or Google
      let password_hash = await bcrypt.hash(user.password, 10);

      // Create user in database
      const { password, ...result } = await this.usersService.createUser({
        ...user,
        password: password_hash,
      });

      // Create refresh token for user
      const payload = { username: result.username, sub: result.id };
      const jwtOptions = {
        expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRE'),
      };
      //const token = await this.jwtService.signAsync(payload);
      const refresh_token = await this.jwtService.signAsync(
        payload,
        jwtOptions,
      );
      // Update user in database with refresh token
      await this.usersService.updateUser(result.id, { refresh_token });
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async validateOrCreateUser(googleUser: any) {
    let user = await this.usersService.findOneByEmail(googleUser.email);
    if (!user) {
      user = await this.usersService.createUser({
        email: googleUser.email,
        password: '',
        username: googleUser.first_name + googleUser.last_name,
        code: 1111
      });
    } else if (!user.provider_id) {
      user = await this.usersService.updateUser(user.id, {
        google_id: googleUser.googleId,
      });
    }

    return this.login(user);
  }
}
