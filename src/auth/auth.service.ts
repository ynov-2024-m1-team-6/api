import { Injectable, HttpException } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  async register(data) {
    try {
      const user: User = await prisma.user.findUnique({
        where: { mail: data.mail },
      });
      if (user) {
        throw new HttpException('User already exists', 400);
      }
      const hashedPassword = await bcrypt.hash(data.password, 10);
      data.password = hashedPassword;

      await prisma.user.create({ data });
      const accessToken = this.generateToken({
        id: data.id,
        isAdmin: data.isAdmin,
      });

      return { message: 'success', data: accessToken };
    } catch (error) {
      return error;
    }
  }

  async login(data) {
    try {
      const user: User = await prisma.user.findUnique({
        where: { mail: data.mail },
      });
      if (!user) {
        throw new HttpException('User not found', 404);
      }
      const goodPassword = await bcrypt.compare(data.password, user.password);
      if (goodPassword === true) {
        const accessToken = this.generateToken({
          id: user.id,
          isAdmin: user.isAdmin,
        });
        return { message: 'success', data: accessToken };
      }
      return 'Invalid password';
    } catch (error) {
      return error;
    }
  }
  private generateToken(payload: { id: number; isAdmin: boolean }): string {
    return this.jwtService.sign(payload);
  }
}
