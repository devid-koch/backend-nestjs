import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { RegisterDto } from 'src/auth/dto/register.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(user: RegisterDto): Promise<User> {
    const newUser = this.usersRepository.create(user);
    return await this.usersRepository.save(newUser);
  }

  async findByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async findByOAuthId(id: string, provider: string): Promise<User> {
    return await this.usersRepository.findOne({ where: { [`${provider}Id`]: id } });
  }

  async validateOAuthUser(profile: any, provider: string): Promise<any> {
    let user = await this.findByOAuthId(profile.id, provider);
    if (!user) {
      user = await this.create({
        email: profile.emails[0].value,
        name: profile.displayName,
        [`${provider}Id`]: profile.id,
      });
    }
    return user;
  }
}
