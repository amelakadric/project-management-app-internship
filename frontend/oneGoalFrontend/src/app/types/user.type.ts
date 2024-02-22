import { Genders } from '../enums/genders.enum';
import { Roles } from '../enums/roles.enum';

export interface UserType {
  id: number;
  firstname: string;
  lastname: string;
  phoneNumber: string;
  gender: Genders;
  email: string;
  password: string;
  role: Roles;
}
