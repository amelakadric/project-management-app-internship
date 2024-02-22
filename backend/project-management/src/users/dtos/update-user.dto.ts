import { IsOptional, IsEmail, IsString, IsEnum } from 'class-validator';
import { Gender } from '../enums/genders.enum';
import { Role } from '../enums/roles.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  firstname?: string;

  @IsOptional()
  @IsString()
  lastname?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
