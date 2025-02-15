import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../prisma/prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class TasksService {
    constructor(private prisma:PrismaService){}

    private tasks: Task[] = [
        { 
            id: 1,
            name: "Task01",
            description: "Task01 Desc", 
            completed: true
        }
    ]

    async findAll(){
        try {
            const allTasks = await this.prisma.task.findMany();

            return allTasks;
        } catch (error) {
            throw new HttpException("Falha ao listar todas tarefa!", HttpStatus.BAD_REQUEST)
        }
    }

    async findOne(id: number){
        

        try {
            const task = await this.prisma.task.findFirst({
                where: {
                    id: id
                }
            })  
            
            if(task?.name) return task
            
            throw new HttpException("Essa tarefa não existe :O Tente outra ^_^", HttpStatus.NOT_FOUND)

        } catch (error) {   
            throw new HttpException("Falha ao listar essa tarefa!", HttpStatus.BAD_REQUEST)
        }
    }

    async create(createTaskDto: CreateTaskDto){
        try {
            const newTask = await this.prisma.task.create({
                data: {
                    name: createTaskDto.name,
                    description: createTaskDto.description,
                    completed: false
                }
            })
    
            return newTask;
    
        } catch (error) {
            throw new HttpException("Falha ao deletar essa tarefa!", HttpStatus.BAD_REQUEST)
        }
    }

    async update(id: number, updateTaskDto: UpdateTaskDto){
        try {
            const findTask = await this.prisma.task.findFirst({
                where: {
                    id
                }
            })
    
            if(!findTask){
                throw new HttpException("Essa tarefa não existe!", HttpStatus.NOT_FOUND)
            }
    
    
            const task = await this.prisma.task.update({
                where: { id: findTask.id },
                data: updateTaskDto
            })
    
            return task;
        } catch (err) {
            throw new HttpException("Falha ao deletar essa tarefa!", HttpStatus.BAD_REQUEST)
        }
    }


    async delete(id: number){
        try {
            const findTask = await this.prisma.task.findFirst({
                where: {
                    id
                }
            })
    
            if(!findTask){
                throw new HttpException("Essa tarefa não existe!", HttpStatus.NOT_FOUND)
            }
            
            await this.prisma.task.delete({
                where: {
                    id: findTask.id
                }
            })
    
            return {
                message: "Tarefa deletada com sucesso!"
            };
        } catch (err) {
            throw new HttpException("Falha ao deletar essa tarefa!", HttpStatus.BAD_REQUEST)
        }
    }

}