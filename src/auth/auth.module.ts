import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { jwtConstants } from './auth.constants';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '20h' },
    }),
  ],
  providers: [AuthService, MailService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
