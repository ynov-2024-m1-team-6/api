/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { WishlistModule } from './wishlist/wishlist.module';
@Module({
  imports: [AuthModule, UserModule, WishlistModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
