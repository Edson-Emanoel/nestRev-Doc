/*
* DTO - Data Transfer Object (Objeto de Tranferência de Dados, um padrão de projeto)
*     - Valida dados, transforma dados.
*     - Ele representa quais dados e em que formatos de uma determinada camada aceita e trabalha 
*/

import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {

    @IsString()
    @IsOptional()
    @MinLength(5, { message: "O Nome precisa ter no minímo 5 carácteres" })
    readonly name: string;
    
    @IsString()
    @IsOptional()
    readonly password: string;
    
    @IsString()
    @IsOptional()
    readonly email: string;
    
    @IsString()
    @IsOptional()
    readonly avatar: string;
}