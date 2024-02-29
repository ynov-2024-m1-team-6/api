import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard)
  @Put('/')
  async updateUser(
    @Request() req,
    @Body() user: User,
  ): Promise<{ message: string; data: User }> {
    const userId = req['user']?.id; // Récupérer l'ID du token depuis la requête
    return this.userService.updateUser(parseInt(userId, 10), user);
  }

  @UseGuards(AuthGuard)
  @Get('/')
  async getMeInfo(
    @Request() req,
  ): Promise<{ message: string; data: User | null }> {
    const userId = req['user']?.id; // Récupérer l'ID du token depuis la requête
    if (!userId) {
      return { message: 'User ID not found in the token', data: null };
    }
    const userInfo = await this.userService.getMeInfo(userId);
    return {
      message: 'User information retrieved successfully',
      data: userInfo.data,
    };
  }
}
