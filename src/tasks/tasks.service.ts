/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TaskStatus } from './task.model';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository) private taskRepository: TaskRepository,
  ) {}

  getTasks(filteredData: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filteredData, user);
  }

  async getTaskById(id: string, user?: User): Promise<Task> {
    const found = await this.taskRepository.findOne({ where: { id, user } });

    if (!found) {
      throw new NotFoundException(`The task ${id} is not found!`);
    }
    return found;
  }

  createTask(createTask: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTask, user);
  }

  async deleteTaskById(id: string, user: User): Promise<void> {
    const check = await this.taskRepository.delete({ id, user });
    // console.log(check, 'check');
    if (check?.affected === 0) {
      throw new NotFoundException(`The task ${id} is not found!`);
    }
  }

  async updateTask(id: string, status: TaskStatus, user: User): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await this.taskRepository.save(task);
    console.log(task, 'task');
    return task;
  }
}
