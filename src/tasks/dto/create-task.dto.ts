/*
* DTO - Data Transfer Object (Objeto de Tranferência de Dados, um padrão de projeto)
*     - Valida dados, transforma dados.
*     - Ele representa quais dados e em que formatos de uma determinada camada aceita e trabalha 
*/

import { IsBoolean, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateTaskDto {

    @IsNotEmpty()
    @IsString({ message: "O Nome precisa ser um texto" })
    @MinLength(5, { message: "O Nome precisa ter no minímo 5 carácteres" })
    readonly name: string;
    
    @IsNotEmpty()
    @IsString({ message: "O Nome precisa ser um texto" })
    readonly description: string;
    
    @IsNotEmpty()
    readonly completed: boolean;
}