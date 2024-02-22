import { Statuses } from '../enums/statuses.enum';
import { Types } from '../enums/type.enum';
import { Priorities } from '../enums/priorities.enum';
import { UserType } from './user.type';
import { ProjectType } from './project.type';

export interface TicketType {
  id: number;
  status: Statuses;
  title: string;
  description: string;
  type: Types;
  priority: Priorities;
  createdBy: UserType;
  assignedTo: UserType;
  project: ProjectType;
}
