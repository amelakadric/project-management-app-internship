import { ProjectType } from '../types/project.type';
import { UserType } from '../types/user.type';
import { TicketType } from '../types/ticket.type';

export interface ProjectStateInterface{
  isLoading: boolean;
  project: ProjectType | null;
  projectArray: ProjectType[];
  error: string | null;
  usersArray: UserType[];
  ticketsArray: TicketType[];
}
