import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'JWT_SECRET',
    });
  }

  async validate(payload: any) {
    console.log(payload);

    const unix_date = Math.floor(+new Date() / 1000); // Get the current Unix timestamp
    if (payload.exp < unix_date) {
      // FIX : fix the issue where you should automatically refresh the token, check from the database if the token is valid or not
      throw new Error('Token has expired');
    }
    return { userId: payload.sub, username: payload.username };
  }
}
