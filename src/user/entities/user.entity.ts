import { ApiProperty, OmitType } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class User {
    @ApiProperty({required: false})
    id: number;

    @ApiProperty({description: "Username of the user"})
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({description: "First name of the user"})
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @ApiProperty({description: "Email of the user"})
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    mail: string;

    @ApiProperty({description: "Password of the user"})
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty({description: "Address of the user"})
    @IsNotEmpty()
    @IsString()
    adress: string;

    @ApiProperty({description: "Zip code of the user"})
    @IsNotEmpty()
    @IsNumber()
    zipCode: number;
    
    @ApiProperty({description: "City of the user"})
    @IsNotEmpty()
    @IsString()
    city: string;

    @ApiProperty({description: "Phone number of the user"})
    @IsNotEmpty()
    @IsNumber()
    phoneNumber: number;

    @ApiProperty({required: false})
    isAdmin: boolean;

    @ApiProperty({required: false})
    wishlist: string[];
}

export class UserRegister extends OmitType(User, ['id', 'isAdmin', 'wishlist'] as const) {}

export class UserLogin extends OmitType(User, ['id', "name", 'firstName', 'adress', 'zipCode', 'city', 'phoneNumber', 'isAdmin', 'wishlist'] as const) {}

export class UserUpdate extends OmitType(User, ['id', 'isAdmin', 'wishlist'] as const) {}