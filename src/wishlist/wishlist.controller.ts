import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
  Delete,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { AuthGuard } from '../auth/auth.guard';
import { User, Product } from '@prisma/client';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

class AddItemDto {
  @IsNumber({}, { message: 'id must be a number' })
  @ApiProperty({ description: 'ID of the product to add to the wishlist' })
  id: number;
}

@Controller('wishlist')
@ApiBearerAuth()
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}

  @UseGuards(AuthGuard)
  @Post('/addItem')
  @ApiTags('Wishlist')
  @ApiBody({ type: AddItemDto })
  @ApiOperation({ summary: 'Add a product to the wishlist' })
  addItem(
    @Request() req,
    @Body('id') productId: number,
  ): Promise<{ message: string; data: User['wishlist'] | null }> {
    const userId = req['user']?.id; // Récupérer l'ID du token depuis la requête

    return this.wishlistService.addItemToWishlist(productId, userId);
  }

  @UseGuards(AuthGuard)
  @Get('/getWishlist')
  @ApiTags('Wishlist')
  @ApiOperation({ summary: 'Get the wishlist' })
  getWishlist(@Request() req): Promise<Product[]> {
    const userId = req['user']?.id; // Récupérer l'ID du token depuis la requête

    return this.wishlistService.getWishlistProducts(userId);
  }

  @UseGuards(AuthGuard)
  @Delete('/removeItem')
  @ApiTags('Wishlist')
  @ApiOperation({ summary: 'Remove a product from the wishlist' })
  @ApiBody({ type: AddItemDto })
  removeItem(
    @Request() req,
    @Body('id') productId: number,
  ): Promise<{ message: string; data: User['wishlist'] | null }> {
    const userId = req['user']?.id; // Récupérer l'ID du token depuis la requête

    return this.wishlistService.removeItemFromWishlist(productId, userId);
  }
}
