import { TestBed } from '@angular/core/testing';

import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { initialTicketState, TicketsFeature } from './ticket.reducer';
import { TicketsActions } from '../actions/tickets.actions';
import { TicketsActionsApi } from '../actions/tickets.actions-api';
import { TicketModel } from '../../../models/ticket.model';

describe('TicketReducer', () => {
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState: { tickets: initialTicketState } })],
    });

    store = TestBed.inject(MockStore);
  });

  it('sets isLoading to true on TicketsActions.loadTicketsFromProject', () => {
    const action = TicketsActions.loadTicketsFromProject({id:1, options:{}});
    const expectedState = {
      ...initialTicketState,
      isLoading: true,
    };
    const result = TicketsFeature.reducer(initialTicketState, action);
    expect(result).toEqual(expectedState);
  });

  it('loads tickets in ticketsArray on TicketsActions.loadTicketsFromProjectSuccess', () => {
    const tickets = <TicketModel[]>{};
    const action = TicketsActionsApi.loadTicketsFromProjectSuccess({tickets});
    const expectedState = {
      ...initialTicketState,
      ticketsArray: tickets
    };
    const result = TicketsFeature.reducer(initialTicketState, action);
    expect(result).toEqual(expectedState);
  });

  it('loads errors in error on TicketsActions.loadTicketsFromProjectFailure', () => {
    const error = <string>{};
    const action = TicketsActionsApi.loadTicketsFromProjectFailure({error});
    const expectedState = {
      ...initialTicketState,
      error: error
    };
    const result = TicketsFeature.reducer(initialTicketState, action);
    expect(result).toEqual(expectedState);
  });

  it('sets isLoading to true on TicketsActions.load', () => {
    const action = TicketsActions.load({projectId:1, ticketId: 1});
    const expectedState = {
      ...initialTicketState,
      isLoading: true,
    };
    const result = TicketsFeature.reducer(initialTicketState, action);
    expect(result).toEqual(expectedState);
  });

  it('loads ticket in ticket on TicketsActions.loadSuccess', () => {
    const ticket = <TicketModel>{};
    const action = TicketsActionsApi.loadSuccess({ticket});
    const expectedState = {
      ...initialTicketState,
      ticket: ticket
    };
    const result = TicketsFeature.reducer(initialTicketState, action);
    expect(result).toEqual(expectedState);
  });

  it('loads errors in error on TicketsActions.loadFailure', () => {
    const error = <string>{};
    const action = TicketsActionsApi.loadFailure({error});
    const expectedState = {
      ...initialTicketState,
      error: error
    };
    const result = TicketsFeature.reducer(initialTicketState, action);
    expect(result).toEqual(expectedState);
  });

  it('sets isLoading to true on TicketsActions.update', () => {
    const ticket = <TicketModel>{};
    const action = TicketsActions.update({ticket});
    const expectedState = {
      ...initialTicketState,
      isLoading: true,
    };
    const result = TicketsFeature.reducer(initialTicketState, action);
    expect(result).toEqual(expectedState);
  });

  it('loads ticket in ticket on TicketsActions.updateSuccess', () => {
    const ticket = <TicketModel>{};
    const action = TicketsActionsApi.updateSuccess({ticket});
    const expectedState = {
      ...initialTicketState,
      ticket: ticket
    };
    const result = TicketsFeature.reducer(initialTicketState, action);
    expect(result).toEqual(expectedState);
  });

  it('loads errors in error on TicketsActions.updateFailure', () => {
    const error = <string>{};
    const action = TicketsActionsApi.updateFailure({error});
    const expectedState = {
      ...initialTicketState,
      error: error
    };
    const result = TicketsFeature.reducer(initialTicketState, action);
    expect(result).toEqual(expectedState);
  });
})
