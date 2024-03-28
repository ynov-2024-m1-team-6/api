import { Injectable, HttpException } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';
const prisma = new PrismaClient();
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private mailerService: MailService,
  ) {}

  async register(data: User) {
    const requiredFields = [
      'mail',
      'name',
      'password',
      'firstName',
      'adress',
      'phoneNumber',
      'zipCode',
      'city',
      'phoneNumber',
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        throw new HttpException(`Missing required field: ${field}`, 400);
      }
    }

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

      try {
        await this.mailerService.sendWelcomeEmail({
          firstName: data.firstName,
          lastName: data.name,
          email: data.mail,
        });
      } catch (error) {
        return error;
      }
      try {
        await this.mailerService.sendRegistrationEmailToAdmin({
          firstName: data.firstName,
          lastName: data.name,
          email: data.mail,
        });
      } catch (error) {
        return error;
      }

      return { message: 'success', data: accessToken };
    } catch (error) {
      return error;
    }
  }

  async login(data) {
    const requiredFields = ['mail', 'password'];

    for (const field of requiredFields) {
      if (!data[field]) {
        throw new HttpException(`Missing required field: ${field}`, 400);
      }
    }

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
