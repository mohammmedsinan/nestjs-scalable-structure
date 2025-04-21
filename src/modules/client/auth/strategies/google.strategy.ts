// google.strategy.ts
import { Profile, Strategy } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID:
        '808833697851-0qugmedqn8clrna8crspfjspr2ean279.apps.googleusercontent.com',
      clientSecret: '4vYt7vqby8k9UOHmVzTfotYg',
      callbackURL: 'http://localhost:3000/api/v1/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { username, emails, photos, name, displayName } = profile;
    console.log(profile);
    const user = {
      email: emails && emails[0].value,
      first_name: name,
      last_name: username,
      picture: photos && photos[0].value,
      provider_id: profile.id,
      accessToken,
    };

    return this.authService.validateOrCreateUser(user);
  }
}
