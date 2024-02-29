import { Injectable, HttpException } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();
@Injectable()
export class UserService {
  async getAllUsers(): Promise<{ message: string; data: User[] }> {
    try {
      const users = await prisma.user.findMany();
      return {
        message: 'success',
        data: users,
      };
    } catch (error) {
      throw error; // You may want to handle errors in a more sophisticated way
    }
  }

  async getUserById(id: number): Promise<{ message: string; data: User }> {
    const requiredFields = ['id'];

    for (const field of requiredFields) {
      if (!id) {
        throw new HttpException(`Missing required field: ${field}`, 400);
      }
    }
    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new HttpException('User not found', 404);
      }
      return { message: 'success', data: user };
    } catch (error) {
      throw error;
    }
  }

  async updateUser(
    id: number,
    data: User,
  ): Promise<{ message: string; data: User }> {
    const requiredFields = ['mail', 'name', 'password'];

    for (const field of requiredFields) {
      if (!data[field]) {
        throw new HttpException(`Missing required field: ${field}`, 400);
      }
    }

    try {
      const existingUser = await prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        throw new HttpException('User not found for updating', 404);
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data,
      });

      return { message: 'User updated successfully', data: updatedUser };
    } catch (error) {
      throw error;
    }
  }

  async getMeInfo(userId: number): Promise<{ data: User }> {
    const requiredFields = ['userId'];

    for (const field of requiredFields) {
      if (!userId) {
        throw new HttpException(`Missing required field: ${field}`, 400);
      }
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new HttpException('User not found', 404);
      }

      return { data: user };
    } catch (error) {
      throw error;
    }
  }
}
