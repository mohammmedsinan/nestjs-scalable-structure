// google.strategy.ts
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    const clientID = configService.get<string>('auth.google.clientID');
    const clientSecret = configService.get<string>('auth.google.clientSecret');
    const callbackURL = configService.get<string>('auth.google.callbackURL');
    
    if (!clientID || !clientSecret || !callbackURL) {
      throw new Error('Google OAuth configuration is incomplete');
    }
    
    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['email', 'profile'],
      passReqToCallback: false // Explicitly setting this to false
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails } = profile;
    
    try {
      const user = await this.authService.validateOAuthUser({
        googleId: id,
        email: emails[0].value,
        firstName: name.givenName,
        lastName: name.familyName,
      });
      
      // Explicitly handle the null case
      if (!user) {
        return done(null, false);
      }
      
      // User exists, authentication successful
      return done(null, user);
    } catch (error) {
      // Handle any errors in the authentication process
      return done(error, false);
    }
  }
}
