/* eslint-disable prettier/prettier */
import { IsEnum } from 'class-validator';
import { TaskStatus } from '../task.model';

export class updateTaskDto {
  // id: TaskStatus;
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
