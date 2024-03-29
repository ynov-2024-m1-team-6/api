import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
  Param,
  Delete,
} from '@nestjs/common';
// import { User } from '@prisma/client';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { User, UserUpdate } from './entities/user.entity';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard)
  @Put('/')
  @ApiTags('User')
  @ApiOperation({ summary: 'Update user information' })
  @ApiBody({ type: UserUpdate })
  async updateUser(
    @Request() req,
    @Body() user: User,
  ): Promise<{ message: string; data: User }> {
    const userId = req['user']?.id; // Récupérer l'ID du token depuis la requête
    return this.userService.updateUser(parseInt(userId, 10), user);
  }

  @UseGuards(AuthGuard)
  @Get('/')
  @ApiTags('User')
  @ApiOperation({ summary: 'Get user information' })
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

  @Get('/admin')
  @ApiTags('User')
  @ApiOperation({ summary: 'Get all user' })
  async getAllUsers(): Promise<{ message: string; data: User[] }> {
    return this.userService.getAllUsers();
  }

  @Get('/admin/:id')
  @ApiTags('User')
  @ApiOperation({ summary: 'Get user by id' })
  async getUserById(
    @Param('id') id: string,
  ): Promise<{ message: string; data: User }> {
    return this.userService.getUserById(parseInt(id));
  }

  @Delete('/admin/:id')
  @ApiTags('User')
  @ApiOperation({ summary: 'delete user' })
  async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
    return this.userService.deleteUser(parseInt(id));
  }

  @Get('/getMyCommands')
  @ApiTags('User')
  @ApiOperation({ summary: 'Get all commands from user' })
  async getMyCommands(@Request() req): Promise<{ message: string; data: any }> {
    const userId = req['user']?.id; // Récupérer l'ID du token depuis la requête
    if (!userId) {
      return { message: 'User ID not found in the token', data: null };
    }
    return this.userService.getMyCommands(userId);
  }
}
