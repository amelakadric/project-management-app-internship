import { ProjectType } from '../types/project.type';
import { UserType } from '../types/user.type';
import { TicketType } from '../types/ticket.type';

export class ProjectModel implements ProjectType {
  employees: UserType[];
  manager: UserType;
  id: number;
  tickets: TicketType[];
  name: string;

  constructor(id: number, name: string,  manager: UserType, employees: UserType[], tickets: TicketType[]) {
    this.employees = employees;
    this.manager = manager;
    this.id = id;
    this.tickets = tickets;
    this.name = name;
  }
}
