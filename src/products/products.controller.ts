import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  CreateProduct,
  Product,
  UpdateProduct,
} from './entities/product.entity';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(private productService: ProductsService) {}

  @Get('getProducts')
  @ApiOperation({ summary: 'Get all products' })
  @ApiQuery({ name: 'filterInactive', required: true, type: 'boolean' })
  @ApiTags('products')
  async findAll(@Query('filterInactive') filterInactive: string) {
    return this.productService.findAll(filterInactive);
  }

  @Get('getProduct')
  @ApiOperation({ summary: 'Get product' })
  @ApiQuery({ name: 'id', required: true })
  @ApiTags('products')
  findOne(@Query('id') id: string) {
    return this.productService.findOne(parseInt(id));
  }

  @Get('getSpecificProduct')
  @ApiOperation({ summary: 'Get specific product in a list of id' })
  @ApiQuery({ name: 'id', type: 'number', isArray: true })
  @ApiTags('products')
  getSpecificProduct(@Query('id') id: number[]) {
    return this.productService.GetSpecificProduct(id);
  }

  @Post('create')
  @ApiOperation({ summary: 'Create product' })
  @ApiBody({ type: () => CreateProduct })
  @ApiTags('products')
  create(@Body() data: Product) {
    return this.productService.create(data);
  }

  @Put('update')
  @ApiOperation({ summary: 'Update product' })
  @ApiQuery({ name: 'id', required: true })
  @ApiBody({ type: () => UpdateProduct })
  @ApiTags('products')
  update(@Body() data: Product, @Query('id') id: string) {
    return this.productService.update(parseInt(id), data);
  }

  @Delete('delete')
  @ApiOperation({ summary: 'Delete product' })
  @ApiQuery({ name: 'id', required: true })
  @ApiTags('products')
  delete(@Query('id') id: string) {
    return this.productService.delete(parseInt(id));
  }

  @Put('updateActivity')
  @ApiOperation({ summary: 'inverse active in product' })
  @ApiQuery({ name: 'id', required: true })
  @ApiTags('products')
  updateActivity(@Query('id') id: string) {
    return this.productService.updateActivity(parseInt(id));
  }
}
