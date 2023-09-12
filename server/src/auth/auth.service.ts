import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { SignInResponse } from './dto/signIn-response';
import { SignInInput } from './dto/signIn.input';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

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
      accessToken: this.jwtService.sign({
        sub: user.id,
      }),
      user,
    };
  }
}
