import { UserType } from '../types/user.type';
import { Roles } from '../enums/roles.enum';

export interface UserStateInterface{
  isLoading : boolean;
  user: UserType | null;
  usersArray: UserType[];
  employeesArray: UserType[];
  managersArray: UserType[];
  error: string | null;
  currentUserRole: Roles | null;
  currentUser: UserType | null;
}
