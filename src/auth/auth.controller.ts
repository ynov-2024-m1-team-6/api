import { Body, Controller, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() user: User): Promise<{ message: string; data: string }> {
    return this.authService.register(user);
  }

  @Post('login')
  login(@Body() user: User): Promise<{ message: string; data: string }> {
    return this.authService.login(user);
  }
}
