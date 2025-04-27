import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@client/users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || '',
    });
  }

  async validate(payload: {
    username: string;
    sub: number;
    exp: number;
    iat: number;
  }) {
    const currentUnixTime = Math.floor(Date.now() / 1000);

    // Check token expiration
    if (payload.exp > currentUnixTime) {
      try {
        const { refresh_token } = await this.userService.findUserRefreshToken(
          payload.username,
        );

        // Verify refresh token is not expired
        if (!refresh_token) return false;
        const refreshTokenPayload = this.jwtService.decode(refresh_token);
        if (!refreshTokenPayload || refreshTokenPayload.exp > currentUnixTime) {
          throw new UnauthorizedException(
            'Both access and refresh tokens expired',
          );
        }

        // Issue new access token
        const newAccessToken = this.jwtService.sign(
          { username: payload.username, sub: payload.sub },
          {
            expiresIn: this.configService.get<string>(
              'JWT_REFRESH_TOKEN_EXPIRE',
            ),
          },
        );

        return {
          id: payload.sub,
          username: payload.username,
          token: newAccessToken,
        };
      } catch (error) {
        throw new UnauthorizedException({message: error.message});
      }
    }

    return {
      id: payload.sub,
      username: payload.username,
      token: false,
    };
  }
}
