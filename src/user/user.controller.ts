import { Controller, Get, Param, Put, Body } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/')
  async getAllUsers(): Promise<{ message: string; data: User[] }> {
    return this.userService.getAllUsers();
  }

  @Get('/:id')
  async getUser(
    @Param('id') id: string,
  ): Promise<{ message: string; data: User }> {
    return this.userService.getUserById(parseInt(id, 10));
  }

  @Put('/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() user: User,
  ): Promise<{ message: string; data: User }> {
    return this.userService.updateUser(parseInt(id, 10), user);
  }
}
