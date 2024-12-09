import { Controller, Post, Body, Get, Query, UseGuards, Req, Request, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor (private readonly authService: AuthService) { }
  
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    // Initiates Google login flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Query('code') code: string) {
    return "Hii, Thank you for visiting";
  }


  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() body: { email: string; password: string; name: string }) {
    return this.authService.register(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  async getProfile(@Request() req) {
    return req.user;
  }

  @Get('linkedin')
  @UseGuards(AuthGuard('linkedin'))
  async linkedinLogin() {
    // This will redirect to LinkedIn's login page
  }

  @Get('linkedin/callback')
  @UseGuards(AuthGuard('linkedin'))
  async linkedinLoginCallback(@Req() req: any): Promise<string> {
    // LinkedIn redirects here after login
    const user = req.user;
    console.log('LinkedIn User:', user); // Log the user details
    return `Welcome, ${user.name}!`; // Send a response to the user
  }
}
