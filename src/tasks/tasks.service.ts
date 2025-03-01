import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ResponseTaskDto } from './dto/response-task.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll(paginationDto?: PaginationDto): Promise<ResponseTaskDto[]> {
    const { limit = 10, offset = 0 } = paginationDto || {};

    const allTasks = await this.prisma.task.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return allTasks;
  }

  async findOne(id: number): Promise<ResponseTaskDto> {
    try {
      const task = await this.prisma.task.findFirst({
        where: {
          id: id,
        },
      });

      if (task?.name) return task;

      throw new HttpException(
        'Essa tarefa não existe :O Tente outra ^_^',
        HttpStatus.NOT_FOUND,
      );
    } catch (error) {
      throw new HttpException(
        'Falha ao listar essa tarefa!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async create(createTaskDto: CreateTaskDto): Promise<ResponseTaskDto> {
    try {
      const newTask = await this.prisma.task.create({
        data: {
          name: createTaskDto.name,
          description: createTaskDto.description,
          completed: false,
        },
      });

      return newTask;
    } catch (error) {
      throw new HttpException(
        'Falha ao deletar essa tarefa!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(
    id: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<ResponseTaskDto> {
    try {
      const findTask = await this.prisma.task.findFirst({
        where: {
          id,
        },
      });

      if (!findTask) {
        throw new HttpException(
          'Essa tarefa não existe!',
          HttpStatus.NOT_FOUND,
        );
      }

      const task = await this.prisma.task.update({
        where: { id: findTask.id },
        data: updateTaskDto,
      });

      return task;
    } catch (err) {
      throw new HttpException(
        'Falha ao deletar essa tarefa!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async delete(id: number) {
    try {
      const findTask = await this.prisma.task.findFirst({
        where: {
          id,
        },
      });

      if (!findTask) {
        throw new HttpException(
          'Essa tarefa não existe!',
          HttpStatus.NOT_FOUND,
        );
      }

      await this.prisma.task.delete({
        where: {
          id: findTask.id,
        },
      });

      return {
        message: 'Tarefa deletada com sucesso!',
      };
    } catch (err) {
      throw new HttpException(
        'Falha ao deletar essa tarefa!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
