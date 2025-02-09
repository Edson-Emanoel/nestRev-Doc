import * as path from "node:path";
import * as fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Body, Controller, Delete, Get, HttpStatus, Param, ParseFilePipeBuilder, ParseIntPipe, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService){}

    @Get()
    findAllUsers(){
        return this.usersService.findAll()
    }

    @Get(":id")
    findOneUser(@Param('id', ParseIntPipe) id: number){
        return this.usersService.findOne(id)
    }

    @Post()
    createUser(@Body() createTaskDto: CreateUserDto){
        console.log(createTaskDto);
        return this.usersService.create(createTaskDto)
    }

    @Patch(":id")
    updateUsers(@Param('id', ParseIntPipe) id: number, @Body() updateTaskDto: UpdateUserDto){
        return this.usersService.update(id, updateTaskDto)
    }

    @Delete(":id")
    deleteUsers(@Param('id', ParseIntPipe) id: number){
        return this.usersService.delete(id)
    }
    
    // Upload Único
    @Post("upload/:id")
    @UseInterceptors(FileInterceptor('file'))
    async uploadAvatar(@UploadedFile(
        new ParseFilePipeBuilder()
        .addFileTypeValidator({
            fileType: /jpeg|jpg|png/g,
        })
        .addMaxSizeValidator({
            maxSize: 1 * (1024 * 1024) // Tamanho maximo de 1 MB
        })
        .build({
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
        })
    ) file: Express.Multer.File, @Param('id', ParseIntPipe) id: number, @Body() updateTaskDto: UpdateUserDto){
        return this.usersService.uploadAvatarImage(id, file, updateTaskDto)
    }

    // Upload Múltiplo
    // @Post("upload")
    // @UseInterceptors(FilesInterceptor('file'))
    // async uploadAvatar(@UploadedFiles() files: Array<Express.Multer.File>){

    //     files.forEach( async files => {
    //         const fileExtension = path.extname(files.originalname.toLowerCase().substring(1))
    //         const fileName = `${randomUUID()}.${fileExtension}`
    //         const fileLocale = path.resolve(process.cwd(), 'files', fileName)

    //         await fs.writeFile(fileLocale, files.buffer)

    //     })

    //     return true
    // }
}