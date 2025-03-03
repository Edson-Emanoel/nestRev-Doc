import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { HashingServiceProtocol } from 'src/auth/hash/hashing.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    @Inject('HashingServiceProtocol')
    private readonly hashingService: HashingServiceProtocol,
  ) {}

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (user) return user;

    throw new HttpException(
      'Esse usuário não existe :O Tente outro ^_^',
      HttpStatus.NOT_FOUND,
    );
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const passwordHash = await this.hashingService.hash(
        createUserDto.password,
      );

      return await this.prisma.user.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          password: passwordHash,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Falha ao cadastrar usuário!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const findUser = await this.prisma.user.findFirst({
        where: { id },
      });

      if (!findUser) {
        throw new HttpException(
          'Esse usuário não existe!!',
          HttpStatus.NOT_FOUND,
        );
      }

      const user = await this.prisma.user.update({
        where: { id: findUser.id },
        data: UpdateUserDto,
      });

      return user;
    } catch (err) {
      throw new HttpException('Falha ao editar a tarefa', HttpStatus.NOT_FOUND);
    }
  }

  async delete(id: number) {
    try {
      const findUser = await this.prisma.user.findFirst({
        where: {
          id,
        },
      });

      if (!findUser) {
        throw new HttpException(
          'Esse usuário não existe',
          HttpStatus.NOT_FOUND,
        );
      }

      await this.prisma.user.delete({
        where: {
          id: findUser.id,
        },
      });

      return {
        message: 'Usuário deletado com sucesso!',
      };
    } catch (err) {
      throw new HttpException(
        'Falha ao Deletar o Usuário!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async uploadAvatarImage(
    id: number,
    file: Express.Multer.File,
    updateUserDto: UpdateUserDto,
  ) {
    try {
      const mimeType = file.mimetype;
      const fileExtension = path.extname(
        file.originalname.toLowerCase().substring(1),
      );

      const fileName = `${randomUUID()}${fileExtension}`;

      const fileLocale = path.resolve(process.cwd(), 'files', fileName);

      await fs.writeFile(fileLocale, file.buffer);

      const user = await this.findOne(id);

      if (!user) {
        throw new HttpException(
          'Deu errado ao Atualizar :o',
          HttpStatus.BAD_REQUEST,
        );
      }

      let fileNameSaved = (updateUserDto.avatar = fileName);

      const updatedUser = await this.update(id, {
        avatar: fileNameSaved,
      });

      return updatedUser;
    } catch (err) {
      console.log('Deu errado!   :o   Erro: ' + err);
      throw new HttpException(
        'Deu errado ao Atualizar :o',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
