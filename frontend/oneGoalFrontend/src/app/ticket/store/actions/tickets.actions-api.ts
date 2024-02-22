import { createActionGroup, props } from '@ngrx/store';
import { TicketType } from '../../../types/ticket.type';

export const TicketsActionsApi = createActionGroup({
  source: 'Tickets/Api',
  events: {
    'Load Tickets From Project Success': props<{ tickets: TicketType[]}>(),
    'Load Tickets From Project Failure': props<{ error: string }>(),

    'Load Success': props<{ ticket: TicketType }>(),
    'Load Failure': props<{ error: string }>(),

    'Update Success': props<{ ticket: TicketType }>(),
    'Update Failure': props<{ error: string }>(),
  }
});
