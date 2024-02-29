import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { AuthGuard } from '../auth/auth.guard';
import { User, Product } from '@prisma/client';

@Controller('wishlist')
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}

  @UseGuards(AuthGuard)
  @Post('/addItem')
  addItem(
    @Request() req,
    @Body('id') productId: number,
  ): Promise<{ message: string; data: User['wishlist'] | null }> {
    const userId = req['user']?.id; // Récupérer l'ID du token depuis la requête

    return this.wishlistService.addItemToWishlist(productId, userId);
  }

  @UseGuards(AuthGuard)
  @Get('/getWishlist')
  getWishlist(@Request() req): Promise<Product[]> {
    const userId = req['user']?.id; // Récupérer l'ID du token depuis la requête

    return this.wishlistService.getWishlistProducts(userId);
  }
}
