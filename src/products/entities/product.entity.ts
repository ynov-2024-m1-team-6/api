import 'reflect-metadata';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
} from 'class-validator';

export const requiredFields: string[] = [];

// Utilisez une fonction décorateur pour marquer les champs requis
function Required(target: any, propertyKey: string) {
  requiredFields.push(propertyKey);
}

export class Product {
  @ApiProperty({ required: false })
  id?: number;

  @ApiProperty({ description: 'Username of the product owner' })
  @IsNotEmpty()
  @IsString()
  @Required
  username: string; // EnormeZboubDu92

  @ApiProperty({ description: 'Description of the product' })
  @IsNotEmpty()
  @IsString()
  @Required
  description: string; // Daghestanais d'origine, je me suis entraîné avec Khabib Nurmagomedov.

  @ApiProperty({ description: 'Price of the product' })
  @IsNotEmpty()
  @IsNumber()
  @Required
  price: number; // 299.99

  @ApiProperty({ description: 'Height of the product' })
  @IsNotEmpty()
  @IsNumber()
  @Required
  height: number; // 185

  @ApiProperty({ description: 'Weight of the product' })
  @IsNotEmpty()
  @IsNumber()
  @Required
  weight: number; // 105

  @ApiProperty({ description: 'Win-loss ratio of the product' })
  @IsNotEmpty()
  @IsString()
  @Required
  ratio: string; // '10-0'

  @ApiProperty({ description: "URL of the product's thumbnail image" })
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  @Required
  thumbnail: string; // https://images.unsplash.com/photo-1491756975177-a13d74ed1e2f

  @ApiProperty({ required: false })
  @IsBoolean()
  active: boolean;
}

export class CreateProduct extends OmitType(Product, [
  'id',
  'active',
] as const) {}

export class UpdateProduct extends OmitType(Product, [
  'id',
  'active',
] as const) {}
