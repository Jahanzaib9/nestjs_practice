/* eslint-disable prettier/prettier */
import { Task } from './task.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task.model';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';
import { InternalServerErrorException, Logger } from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TasksRepository');
  async createTask(createTask: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTask;
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user: user,
    });
    await this.save(task);
    return task;
  }

  async getTasks(filteredData: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filteredData;
    const query = this.createQueryBuilder('task');
    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status: status });
    }
    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user "${
          user.username
        } with Filters: "${JSON.stringify(filteredData)}"`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
