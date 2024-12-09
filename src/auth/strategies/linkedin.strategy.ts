import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import { linkedinConfig } from '../../config/linkedin.config';
import { AuthService } from '../services/auth.service';

@Injectable()
export class LinkedInOAuthStrategy extends PassportStrategy(LinkedInStrategy, 'linkedin') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: linkedinConfig.clientID,
      clientSecret: linkedinConfig.clientSecret,
      callbackURL: linkedinConfig.callbackURL,
      scope: ['r_emailaddress', 'r_liteprofile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const user = await this.authService.validateOAuthUser(profile, 'linkedin');
    return user;
  }
}
