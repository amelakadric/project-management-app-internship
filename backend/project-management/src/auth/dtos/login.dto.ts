import { IsEmail, IsEnum, IsString } from 'class-validator';
import { Role } from '../../users/enums/roles.enum';

export class LogInDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEnum(Role)
  role: Role;
}
