import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './products.constants';
import { ProductsMiddleware } from './products.middleware';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '20h' },
    }),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ProductsMiddleware)
      .exclude('products/getProducts', 'products/getProduct', 'products/getSpecificProduct') //ne pas appliquer le middleware sur les routes de recherche de produits
      .forRoutes('products');
  }
}
