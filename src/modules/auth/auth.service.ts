import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.password) {
      return null;
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }
    
    const { password: _, ...result } = user;
    return result;
  }

  async register(registerDto: RegisterDto) {
    // Check if user exists
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    
    // Create new user
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
      is_email_verified: false,
    });
    
    return this.generateToken(user);
  }

  async login(user: any) {
    return this.generateToken(user);
  }

  async validateOAuthUser(oauthUser: any) {
    // Check if user exists by email or googleId
    let user = await this.usersService.findByGoogleId(oauthUser.googleId);
    
    if (!user) {
      // Try to find by email
      user = await this.usersService.findByEmail(oauthUser.email);
      
      if (user) {
        // Link Google account to existing user
        user = await this.usersService.update(user.id, {
          provider_id: oauthUser.googleId,
          is_email_verified: true,
        });
      } else {
        // Create new user with Google data
        user = await this.usersService.create({
          email: oauthUser.email,
          first_name: oauthUser.firstName,
          last_name: oauthUser.lastName,
          provider_id: oauthUser.googleId,
          is_email_verified: true,
        });
      }
    }
    
    return user;
  }

  private generateToken(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }
}
