import { Module, MiddlewareConsumer } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ProductsMiddleware } from 'src/products/products.middleware';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProductsMiddleware).exclude('/user').forRoutes('user');
  }
}
