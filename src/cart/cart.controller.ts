import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
  Delete,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from '../auth/auth.guard';
import { User, Product } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

class AddItemDto {
  @IsNumber({}, { message: 'id must be a number' })
  @ApiProperty({ description: 'ID of the product to add to the cart' })
  id: number;
}

@Controller('cart')
@ApiBearerAuth()
export class CartController {
  constructor(private cartService: CartService) {}

  @UseGuards(AuthGuard)
  @Post('/addItem')
  @ApiTags('Cart')
  @ApiBody({ type: AddItemDto })
  @ApiOperation({ summary: 'Add a product to the cart' })
  addItem(
    @Request() req,
    @Body('id') productId: number,
  ): Promise<{ message: string; data: User['cart'] | null }> {
    const userId = req['user']?.id; // Récupérer l'ID du token depuis la requête

    return this.cartService.addItemToCart(productId, userId);
  }

  @UseGuards(AuthGuard)
  @Get('/getCart')
  @ApiTags('Cart')
  @ApiOperation({ summary: 'Get the cart' })
  getCart(@Request() req): Promise<Product[]> {
    const userId = req['user']?.id; // Récupérer l'ID du token depuis la requête

    return this.cartService.getCartProducts(userId);
  }

  @UseGuards(AuthGuard)
  @Delete('/removeItem')
  @ApiTags('Cart')
  @ApiOperation({ summary: 'Remove a product from the cart' })
  @ApiBody({ type: AddItemDto })
  removeItem(
    @Request() req,
    @Body('id') productId: number,
  ): Promise<{ message: string; data: User['cart'] | null }> {
    const userId = req['user']?.id; // Récupérer l'ID du token depuis la requête

    return this.cartService.removeItemFromCart(productId, userId);
  }
}
