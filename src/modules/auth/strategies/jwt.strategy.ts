import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
	private configService: ConfigService,
	private usersService: UsersService,
	private jwtService: JwtService,
  ) {
	const secret = configService.get<string>('auth.jwt.secret');
	if (!secret) {
	  throw new Error('JWT secret is not defined');
	}
	
	super({
	  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	  ignoreExpiration: false,
	  secretOrKey: secret,
	});
  }

  async validate(payload: any) {
	const user = await this.usersService.findById(payload.sub);
	if (!user) {
	  throw new UnauthorizedException();
	}
	// TODO: check if user is active
	const token = await this.jwtService.signAsync(payload);
	return {token , ...user};
  }
}
