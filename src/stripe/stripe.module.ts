import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { CommandService } from 'src/command/command.service';
import { ProductsService } from 'src/products/products.service';

@Module({
  controllers: [StripeController],
  providers: [StripeService, CommandService, ProductsService],
})
export class StripeModule {}
