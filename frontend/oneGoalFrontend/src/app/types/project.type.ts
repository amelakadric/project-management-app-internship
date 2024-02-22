import { UserType } from './user.type';
import { TicketType } from './ticket.type';

export interface ProjectType {
  id: number;
  manager: UserType;
  employees: UserType[];
  tickets: TicketType[];
  name: string;
}
