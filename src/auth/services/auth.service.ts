import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { OAuthUserDto } from '../dto/oauth-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && user.password === pass) {
      return user;
    }
    return null;
  }

  async validateOAuthUser(profile: OAuthUserDto, provider: string): Promise<any> {
    let user = await this.usersService.findByOAuthId(profile.email, provider);
    if (!user) {
      user = await this.usersService.create({
        email: profile.email,
        name: profile.name,
        [`${provider}Id`]: profile.email, // You may adjust this if your OAuth profile contains a different identifier
      });
    }
    return user;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    return this.usersService.create(registerDto);
  }
}
