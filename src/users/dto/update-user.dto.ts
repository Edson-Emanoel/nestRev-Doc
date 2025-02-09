import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";

import { IsOptional, IsString } from "class-validator";

// export class UpdateTaskDto {
//     @IsString()
//     @IsOptional()
//     readonly name?: string;

//     @IsString()
//     @IsOptional()
//     readonly description?: string;

//     @IsBoolean()
//     @IsOptional()
//     readonly completed?: boolean;
// }

export class UpdateUserDto extends PartialType(CreateUserDto) {

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    password?: string;

    @IsString()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    avatar?: string;

}