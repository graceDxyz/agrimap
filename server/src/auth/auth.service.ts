import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { SignInInput } from './dto/signIn.input';
import { SignInResponse } from './dto/signIn-response';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      return user;
    }

    return null;
  }

  async signIn({ email }: SignInInput): Promise<SignInResponse> {
    const user = await this.usersService.findByEmail(email);

    return {
      accessToken: 'jwt',
      user,
    };
  }
}
