import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':email')
  async getUser(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }
}
