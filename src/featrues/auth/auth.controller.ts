import {
  Controller,
  Post,
  UseGuards,
  Req,
  Get,
  HttpCode,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { Public } from '../../common/decorators/public.decorator';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('/login')
  @HttpCode(200)
  async login(@Req() req: Request) {
    return this.authService.login(req.user);
  }

  @Get('info')
  getProfile(@Req() req: any) {
    return this.userService.findOne(req.user.userId);
  }

  @Post('/logout')
  @HttpCode(200)
  logout() {
    return null;
  }
}
