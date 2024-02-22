import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { TicketType } from '../../../types/ticket.type';

export const ProjectsActions = createActionGroup({
  source: 'Projects',
  events:{
    'Load All': emptyProps(),
    'Load Users': props<{ id: number }>(),
    'Load Managers': props<{ id: number }>(),
    'Load': props<{ id: number }>(),
    'Create': props<{ name: string, managerId: number, employees: number[] }>(),
    'Update Name': props<{ projectId: number, name: string }>(),
    'Update Manager': props<{ projectId: number, managerId: number }>(),
    'Remove': props<{ id: number }>(),
    'Add Ticket': props<{ ticket: TicketType }>(),
    'Remove Ticket': props<{ projectId: number, ticketId: number }>(),
    'Add Employee': props<{ projectId: number, employeeId: number }>(),
    'Remove Employee': props<{ projectId:number, employeeId: number }>(),
  }
})
