import { createFeature, createReducer, on } from '@ngrx/store';

import { TicketStateInterface } from '../../../state/ticket-state-interface';
import { TicketsActions } from '../actions/tickets.actions';
import { TicketsActionsApi } from '../actions/tickets.actions-api';

export const initialTicketState: TicketStateInterface = {
  isLoading : false,
  ticket: null,
  ticketsArray: [],
  error: null
}

export const TicketsFeature = createFeature({
  name: 'tickets',
  reducer: createReducer(
    initialTicketState,

    on(TicketsActions.loadTicketsFromProject, (state) =>
      ({...state, isLoading:true})),
    on(TicketsActionsApi.loadTicketsFromProjectSuccess, (state, {tickets}) => ({
      ... state,
      ticketsArray: tickets,
    })),
    on(TicketsActionsApi.loadTicketsFromProjectFailure, (state, {error}) => ({
      ... state,
      error
    })),

    on(TicketsActions.load, (state) => ({...state, isLoading: true})),
    on(TicketsActionsApi.loadSuccess, (state, {ticket}) => ({
      ...state,
      ticket
    })),
    on(TicketsActionsApi.loadFailure, (state, {error}) => ({
      ...state
      , error
    })),

    on(TicketsActions.update, (state) => ({...state, isLoading: true})),
    on(TicketsActionsApi.updateSuccess, (state, {ticket}) => ({
      ...state,
      ticket
    })),
    on(TicketsActionsApi.updateFailure, (state, {error}) => ({
      ...state,
      error
    })),
  )
});

export const {
  name,
  reducer,
  selectTicketsState,
  selectIsLoading,
  selectTicket,
  selectTicketsArray,
  selectError
} = TicketsFeature;
