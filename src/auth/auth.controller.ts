/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
//import { HttpCode, HttpStatus} from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() user: User) {
    return this.authService.register(user);
  }

  @Post('login')
  login(@Body() user: User) {
    return this.authService.login(user);
  }

  /*
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() user: User) {
    return this.authService.login(user);
  }

  @Post('verify-jwt')
  @HttpCode(HttpStatus.OK)
  verifyJwt(@Body() payload: { jwt: string }) {
    return this.authService.verifyJwt(payload.jwt);
  }*/
}
