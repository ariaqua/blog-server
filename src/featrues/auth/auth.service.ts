import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(username: string, password: string) {
    const user = await this.userService.findOneByUsername(username);
    if (user && bcrypt.compareSync(password, user.password)) {
      const { id, username } = user;
      return { id, username };
    }
    return null;
  }
  async login(user: any) {
    const { username, id } = user;
    const payload = { username, id };
    return { token: this.jwtService.sign(payload) };
  }
}
