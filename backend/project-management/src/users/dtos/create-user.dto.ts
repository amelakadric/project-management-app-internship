import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { Gender } from '../enums/genders.enum';
import { Role } from '../enums/roles.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  firstname: string;

  @IsNotEmpty()
  lastname: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;

  @IsNotEmpty()
  phoneNumber: string;
}
