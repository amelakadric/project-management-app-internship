import { UserStateInterface } from '../state/user-state-interface';
import { ProjectStateInterface } from '../state/project-state-interface';
import { TicketStateInterface } from '../state/ticket-state-interface';

export interface AppStateInterface{
  users: UserStateInterface;
  tickets: TicketStateInterface;
  projects: ProjectStateInterface;
}
