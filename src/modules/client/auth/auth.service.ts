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
      const refresh_token = await this.signRefreshToken(
        result,
        this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRE') || '30d',
      );
      // Update user in database with refresh token
      await this.usersService.updateUser(result.id, { refresh_token });
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async validateOrCreateUser(googleUser: any) {
    const { first_name, email, picture, provider_id } = googleUser;
    let user = await this.usersService.findOneByEmail(googleUser.email);
    if (!user) {
      user = await this.usersService.createUser({
        email: email,
        password: '',
        username: first_name.givenName + first_name.familyName,
        image: picture,
        code: 1111,
        first_name: first_name.givenName,
        last_name: first_name.familyName,
        is_verified: true,
        provider_type: 'google',
        provider_id: provider_id,
        language: 1,
      });
      const refresh_token = await this.signRefreshToken(
        user,
        this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRE') || '30d',
      );
      await this.usersService.updateUser(user.id, { refresh_token });
    } else if (!user.provider_id) {
      user = await this.usersService.updateUser(user.id, {
        provider_id: provider_id,
      });
    }

    return this.login(user);
  }

  async signRefreshToken(
    payload: { username: string; id: number },
    expiresIn: string,
  ) {
    let payloads = { username: payload.username, sub: payload.id };
    let jwtOptions = {
      expiresIn,
    };
    const refresh_token = await this.jwtService.signAsync(payloads, jwtOptions);
    return refresh_token;
  }
}
