import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    
    const authorization = request.headers['authorization'];
    if (!authorization) {
      return false; // No authorization header, so no access
    }

    const bearerToken = authorization.split(' ')[1]; // Extract token after "Bearer "
    if (!bearerToken) {
      return false; // Invalid token format
    }

    try {
      // Verify JWT token using JwtService
      const user = this.jwtService.verify(bearerToken);
      request.user = user; // Attach user to request object
      return true;
    } catch (err) {
      return false; // Invalid token or any error during verification
    }
  }
}
