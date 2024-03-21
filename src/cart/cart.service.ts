import { Injectable, HttpException } from '@nestjs/common';
import { PrismaClient, User, Product } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class CartService {
  async addItemToCart(
    productId: number,
    userId: number,
  ): Promise<{ message: string; data: User['cart'] | null }> {
    if (typeof productId !== 'number') {
      throw new HttpException('Invalid productId. Must be a number.', 400);
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new HttpException(`User with id ${userId} not found`, 404);
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new HttpException(`Product with id ${productId} not found`, 404);
    }
    const productIdAsString = productId.toString();
    const isProductInCart = user.cart.includes(productIdAsString);
    if (!isProductInCart) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          cart: {
            push: productIdAsString,
          },
        },
      });
      const updatedUser = await prisma.user.findUnique({
        where: { id: userId },
      });
      return { message: 'success', data: updatedUser?.cart || null };
    } else {
      throw new HttpException('Product already in cart', 400);
    }
  }

  async getCartProducts(userId: number): Promise<Product[]> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpException(`User with id ${userId} not found`, 404);
    }
    const cart = user.cart;
    const cartProducts = await prisma.product.findMany({
      where: {
        id: {
          in: cart.map((id) => parseInt(id)),
        },
      },
    });
    return cartProducts;
  }

  async removeItemFromCart(
    productId: number,
    userId: number,
  ): Promise<{ message: string; data: User['cart'] | null }> {
    if (typeof productId !== 'number') {
      throw new HttpException('Invalid productId. Must be a number.', 400);
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new HttpException(`User with id ${userId} not found`, 404);
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new HttpException(`Product with id ${productId} not found`, 404);
    }
    const productIdAsString = productId.toString();
    const isProductInCart = user.cart.includes(productIdAsString);
    if (isProductInCart) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          cart: {
            set: user.cart.filter((id) => id !== productIdAsString),
          },
        },
      });
      const updatedUser = await prisma.user.findUnique({
        where: { id: userId },
      });
      return { message: 'success', data: updatedUser?.cart || null };
    } else {
      throw new HttpException('Product not in cart', 400);
    }
  }
}
