import { createActionGroup, props } from '@ngrx/store';

import { ProjectType } from '../../../types/project.type';
import { TicketType } from '../../../types/ticket.type';

export const ProjectsActionsApi = createActionGroup({
  source: 'Projects/Api',
  events:{
    'Load All Success': props<{ projects: ProjectType[] }>(),
    'Load All Failure': props<{ error: string }>(),

    'Load Users Success': props<{ projects: ProjectType[] }>(),
    'Load Users Failure': props<{ error: string }>(),

    'Load Managers Success': props<{ projects: ProjectType[] }>(),
    'Load Managers Failure': props<{ error: string }>(),

    'Load Success': props<{ project: ProjectType }>(),
    'Load Failure': props<{ error: string }>(),

    'Create Success': props<{ project: ProjectType }>(),
    'Create Failure': props<{ error: string }>(),

    'Update Manager Success': props<{ project: ProjectType }>(),
    'Update Manager Failure': props<{ error: string }>(),

    'Update Name Success': props<{ project: ProjectType }>(),
    'Update Name Failure': props<{ error: string }>(),

    'Remove Success': props<{ isRemoved: boolean }>(),
    'Remove Failure': props<{ error: string }>(),

    'Add Ticket Success': props<{ ticket: TicketType }>(),
    'Add Ticket Failure': props<{ error: string }>(),

    'Remove Ticket Success': props<{ isRemoved: boolean }>(),
    'Remove Ticket Failure': props<{ error: string }>(),

    'Add Employee Success': props<{ project: ProjectType }>(),
    'Add Employee Failure': props<{ error: string }>(),

    'Remove Employee Success': props<{ project: ProjectType }>(),
    'Remove Employee Failure': props<{ error: string }>()
  }
})
