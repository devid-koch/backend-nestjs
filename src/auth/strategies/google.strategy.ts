import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { googleConfig } from '../../config/google.config';
import { AuthService } from '../services/auth.service';

@Injectable()
export class GoogleOAuthStrategy extends PassportStrategy(GoogleStrategy, 'google') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: googleConfig.clientID,
      clientSecret: googleConfig.clientSecret,
      callbackURL: googleConfig.callbackURL,
      scope: ['email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const user = await this.authService.validateOAuthUser(profile, 'google');
    return user;
  }
}
