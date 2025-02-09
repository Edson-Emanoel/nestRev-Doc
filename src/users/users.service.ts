import * as path from "node:path";
import * as fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {

    private users: User[] = [
        { 
            id: 1,
            name: "Xavier Luis",
            password: "123567",
            email: "xavier@gmail.com",
            avatar: "",
        },
        { 
            id: 2,
            name: "Edson Luis",
            password: "123567",
            email: "edson123@gmail.com",
            avatar: "",
        },
        { 
            id: 3,
            name: "Valentina Sousa",
            password: "270229",
            email: "tina12@gmail.com",
            avatar: "",
        }
    ]

    findAll(){
        return this.users;
    }

    findOne(id: number){
        const user = this.users.find(user => user.id === id)
        
        if(user) return user
        
        throw new HttpException("Esse usuário não existe :O Tente outro ^_^", HttpStatus.NOT_FOUND)
    }

    create(createUserDto: CreateUserDto){
        const newId = this.users.length + 1

        const newUser = {
            id: newId,
            ...createUserDto
        }

        this.users.push(newUser)

        return newUser;
    }

    update(id: number, updateUserDto: UpdateUserDto){
        const userIndex = this.users.findIndex(user => user.id === id);

        if(userIndex < 0){
            throw new HttpException("Esse usuário não existe :O Tente outro ^_^", HttpStatus.NOT_FOUND)         
        }

        if(userIndex >= 0){
            const userItem = this.users[userIndex]

            this.users[userIndex] = {
                ...userItem,
                ...updateUserDto
            }
        }

        return "Usuário Editado com Sucesso!"

    }

    delete(id: number){
        const userIndex = this.users.findIndex(user => user.id === Number(id));

        if(userIndex < 0){
            throw new HttpException("Esse usuário não existe :O Tente outro ^_^", HttpStatus.NOT_FOUND)         
        }

        if(userIndex >= 0){
            this.users.splice(userIndex, 1)
        }

        return {
            message: "Usuário Excluído com sucesso!"
        }
    }

    async uploadAvatarImage(id: number, file: Express.Multer.File, updateUserDto: UpdateUserDto){
        try {
            const mimeType = file.mimetype;
            const fileExtension = path.extname(file.originalname.toLowerCase().substring(1))

            const fileName = `${randomUUID()}${fileExtension}`

            const fileLocale = path.resolve(process.cwd(), 'files', fileName)

            await fs.writeFile(fileLocale, file.buffer)

            const user = await this.findOne(id)

            if(!user){
                throw new HttpException("Deu errado ao Atualizar :o", HttpStatus.BAD_REQUEST);
            }

            let fileNameSaved = updateUserDto.avatar = fileName

            const updatedUser = await this.update(id, {
                avatar: fileNameSaved
            })

            return updatedUser;
        } catch (err) {
            console.log("Deu errado!   :o   Erro: " + err);
            throw new HttpException("Deu errado ao Atualizar :o", HttpStatus.BAD_REQUEST);
        }
    }

}