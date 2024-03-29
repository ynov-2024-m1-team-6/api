import { Injectable, HttpException } from '@nestjs/common';
import { PrismaClient, User, Product } from '@prisma/client';

const prisma = new PrismaClient();
@Injectable()
export class WishlistService {
  async addItemToWishlist(
    productId: number,
    userId: number,
  ): Promise<{ message: string; data: User['wishlist'] | null }> {
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
    const isProductInWishlist = user.wishlist.includes(productIdAsString);
    if (!isProductInWishlist) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          wishlist: {
            push: productIdAsString,
          },
        },
      });
      const updatedUser = await prisma.user.findUnique({
        where: { id: userId },
      });
      return { message: 'success', data: updatedUser?.wishlist || null };
    } else {
      throw new HttpException('Product already in wishlist', 400);
    }
  }

  async getWishlistProducts(userId: number): Promise<Product[]> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpException(`User with id ${userId} not found`, 404);
    }
    const wishlist = user.wishlist;
    const wishlistProducts = await prisma.product.findMany({
      where: {
        id: {
          in: wishlist.map((id) => parseInt(id)),
        },
      },
    });
    return wishlistProducts;
  }

  async removeItemFromWishlist(
    productId: number,
    userId: number,
  ): Promise<{ message: string; data: User['wishlist'] | null }> {
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
    const isProductInWishlist = user.wishlist.includes(productIdAsString);
    if (isProductInWishlist) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          wishlist: {
            set: user.wishlist.filter((id) => id !== productIdAsString),
          },
        },
      });
      const updatedUser = await prisma.user.findUnique({
        where: { id: userId },
      });
      return { message: 'success', data: updatedUser?.wishlist || null };
    } else {
      throw new HttpException('Product not in wishlist', 400);
    }
  }
}
