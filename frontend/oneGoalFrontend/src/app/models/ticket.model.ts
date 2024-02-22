import { TicketType } from '../types/ticket.type';
import { UserType } from '../types/user.type';
import { Priorities } from '../enums/priorities.enum';
import { ProjectType } from '../types/project.type';
import { Statuses } from '../enums/statuses.enum';
import { Types } from '../enums/type.enum';

export class TicketModel implements TicketType {
  assignedTo: UserType;
  createdBy: UserType;
  description: string;
  priority: Priorities;
  project: ProjectType;
  status: Statuses;
  id: number;
  title: string;
  type: Types;

  constructor(ticketId: number, projectId: ProjectType, title: string, description: string,  assignedTo: UserType, createdBy: UserType, type: Types, priority: Priorities, status: Statuses) {
    this.assignedTo = assignedTo;
    this.createdBy = createdBy;
    this.description = description;
    this.priority = priority;
    this.project = projectId;
    this.status = status;
    this.id = ticketId;
    this.title = title;
    this.type = type;
  }
}
