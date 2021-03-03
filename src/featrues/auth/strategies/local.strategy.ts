import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { validateOrReject } from 'class-validator';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { AuthLoginDto } from '../dto/auth-login.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string) {
    const authUser = new AuthLoginDto();
    authUser.username = username;
    authUser.password = password;

    await validateOrReject(authUser).catch(() => {
      throw new BadRequestException();
    });

    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
