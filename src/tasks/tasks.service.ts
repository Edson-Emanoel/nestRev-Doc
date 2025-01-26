import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { NotFoundError } from 'rxjs';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {

    private tasks: Task[] = [
        { 
            id: 1,
            name: "Task01",
            description: "Task01 Desc", 
            completed: true
        },
        { 
            id: 2,
            name: "Task02",
            description: "Task02 Desc", 
            completed: true
        },
        { 
            id: 3,
            name: "Task03",
            description: "Task03 Desc", 
            completed: true
        }
    ]

    findAll(){
        return this.tasks;
    }

    findOne(id: string){
        const task = this.tasks.find(task => task.id === Number(id))
        
        if(task) return task
        
        throw new HttpException("Essa tarefa não existe :O Tente outra ^_^", HttpStatus.NOT_FOUND)
    }

    create(createTaskDto: CreateTaskDto){
        const newId = this.tasks.length + 1

        const newTask = {
            id: newId,
            ...createTaskDto
        }

        this.tasks.push(newTask)

        return newTask;
    }

    update(id: string, updateTaskDto: UpdateTaskDto){
        const taskIndex = this.tasks.findIndex(task => task.id === Number(id));

        if(taskIndex < 0){
            throw new HttpException("Essa tarefa não existe :O Tente outra ^_^", HttpStatus.NOT_FOUND)         
        }

        if(taskIndex >= 0){
            const taskItem = this.tasks[taskIndex]

            this.tasks[taskIndex] = {
                ...taskItem,
                ...updateTaskDto
            }
        }

        return "Tarefa Editada com Sucesso!"

    }

    delete(id: string){
        const taskIndex = this.tasks.findIndex(task => task.id === Number(id));

        if(taskIndex < 0){
            throw new HttpException("Essa tarefa não existe :O Tente outra ^_^", HttpStatus.NOT_FOUND)         
        }

        if(taskIndex >= 0){
            this.tasks.splice(taskIndex, 1)
        }

        return {
            message: "Tarefa Excluida com sucesso!"
        }
    }

}