import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { CommandModule } from './command/command.module';
import { StripeModule } from './stripe/stripe.module';
import { CartModule } from './cart/cart.module';
import { ProductsModule } from './products/products.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    MailModule,
    AuthModule,
    UserModule,
    WishlistModule,
    CommandModule,
    StripeModule,
    CartModule,
    ProductsModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'uberbagarreynov@gmail.com',
          pass: process.env.MAIL_PASSWORD,
        },
      },
      defaults: {
        from: 'uberbagarreynov@gmail.com',
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
