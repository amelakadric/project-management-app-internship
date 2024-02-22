import { UserType } from '../types/user.type';
import { Genders } from '../enums/genders.enum';
import { Roles } from '../enums/roles.enum';

export class UserModel implements UserType {
  email: string;
  firstname: string;
  gender: Genders;
  id: number;
  lastname: string;
  password: string;
  phoneNumber: string;
  role: Roles;

  constructor(id: number, firstName: string, lastName: string, phoneNumber:string, gender: Genders, email:string, password: string, role: Roles) {
    this.id = id;
    this.firstname = firstName;
    this.lastname = lastName;
    this.phoneNumber = phoneNumber;
    this.gender = gender;
    this.email = email;
    this.password = password;
    this.role = role;
  }

}
