import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { CommandModule } from './command/command.module';
import { StripeModule } from './stripe/stripe.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    WishlistModule,
    CommandModule,
    StripeModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
