import { createActionGroup, props } from '@ngrx/store';

import { TicketType } from '../../../types/ticket.type';
import { Types } from '../../../enums/type.enum';

export const TicketsActions = createActionGroup({
  source: 'Tickets',
  events: {
    'Load Tickets From Project': props<{id: number, options:{title?: string, userId?: number, ticketType?: Types} }>(),
    'Load': props<{ projectId: number, ticketId: number }>(),
    'Update': props<{ ticket: TicketType }>(),
  }
});
