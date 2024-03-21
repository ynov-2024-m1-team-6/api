import 'reflect-metadata';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Product } from 'src/products/entities/product.entity';


export const requiredFields: string[] = [];

// Utilisez une fonction décorateur pour marquer les champs requis
function Required(target: any, propertyKey: string) {
    requiredFields.push(propertyKey);
}

export class Command {
    @ApiProperty({ required: false })
    id?: number;

    @ApiProperty({ description: "Order command linked to stripe" })
    @IsString()
    orderNumber?: string;

    @ApiProperty({ description: "Date of the command"})
    date?: Date;

    @ApiProperty({ description: "Status of the command"})
    status?: CommandStatus;
    
    @ApiProperty({ type: () => [Product] }) // Spécifiez le type du tableau de produits
    // @IsNotEmpty()
    products?: Product[]; // Tableau de produits associés à cette commande
}

export class CreateCommand extends OmitType(Command, ['id', 'orderNumber', 'status', 'date'] as const) {}

export class UpdateCommand extends OmitType(Command, ['id', 'status', 'date'] as const) {}

export enum CommandStatus {
    PAID = 'PAID',
    REIMBURSEMENT = 'REIMBURSEMENT',
    REFUNDED = 'REFUNDED',
}