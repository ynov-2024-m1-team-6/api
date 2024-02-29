import { Body, Controller, Post } from '@nestjs/common';
// import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User, UserLogin, UserRegister } from 'src/user/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiBody({ type: UserRegister })
  @ApiOperation({ summary: 'Register' })
  @ApiTags('auth')
  register(@Body() user: User): Promise<{ message: string; data: string }> {
    return this.authService.register(user);
  }

  @Post('login')
  @ApiBody({ type: UserLogin })
  @ApiOperation({ summary: 'Login' })
  @ApiTags('auth')
  login(@Body() user: User): Promise<{ message: string; data: string }> {
    return this.authService.login(user);
  }
}
