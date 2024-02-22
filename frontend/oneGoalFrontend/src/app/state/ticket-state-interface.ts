import { TicketType } from '../types/ticket.type';

export interface TicketStateInterface{
  isLoading : boolean;
  ticket: TicketType | null;
  ticketsArray: TicketType[];
  error: string | null;
}
