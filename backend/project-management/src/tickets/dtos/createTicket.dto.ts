import { Priority } from '../enums/priorities.enum';
import { Status } from '../enums/statuses.enum';
import { Type } from '../enums/types.enum';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateTicketDto {
  @IsNotEmpty()
  @IsEnum(Status)
  status: Status;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(Type)
  type: Type;

  @IsNotEmpty()
  @IsEnum(Priority)
  priority: Priority;

  @IsOptional()
  @IsPositive()
  assignedTo: number;
}
