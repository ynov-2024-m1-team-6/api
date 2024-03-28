import { Module, MiddlewareConsumer } from '@nestjs/common';
import { CommandService } from './command.service';
import { CommandController } from './command.controller';
import { MailService } from 'src/mail/mail.service';
import { ProductsMiddleware } from 'src/products/products.middleware';

@Module({
  providers: [CommandService, MailService],
  controllers: [CommandController],
})
export class CommandModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ProductsMiddleware)
      .exclude(
        '/getCommandByFilter',
        '/getCommand',
        '/create',
        '/reimbursement',
      )
      .forRoutes('command');
  }
}
