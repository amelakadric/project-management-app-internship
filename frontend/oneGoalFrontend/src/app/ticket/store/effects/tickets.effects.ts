import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, mergeMap, of, switchMap } from 'rxjs';

import { TicketService } from '../../../services/ticket.service';
import { TicketsActions } from '../actions/tickets.actions';
import { TicketsActionsApi } from '../actions/tickets.actions-api';

@Injectable()
export class TicketsEffects {

  constructor(private actions$: Actions, private ticketService: TicketService){}

  getTicketsFromProject$ = createEffect(()=>
    this.actions$.pipe(
      ofType(TicketsActions.loadTicketsFromProject),
      switchMap(({id, options})=>{
        return this.ticketService.getTicketsFromProject(id, options).
        pipe(map(tickets =>
            TicketsActionsApi.loadTicketsFromProjectSuccess({tickets})),
          catchError((error) => of(TicketsActionsApi.loadTicketsFromProjectFailure({error: error.message}))));
      })
    )
  );

  getTicket$ = createEffect(()=>
    this.actions$.pipe(
      ofType(TicketsActions.load),
      switchMap(({projectId, ticketId})=>{
        return  this.ticketService.getTicket(projectId, ticketId).
        pipe(map(ticket =>
            TicketsActionsApi.loadSuccess({ticket})),
          catchError((error) => of(TicketsActionsApi.loadFailure({error:error.message}))));
      })
    )
  );

  updateTicket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TicketsActions.update),
      mergeMap(({ ticket }) =>
        this.ticketService.updateTicket(ticket).pipe(
          switchMap((ticket) => [
            TicketsActionsApi.updateSuccess({ ticket }),
            TicketsActions.loadTicketsFromProject({id: ticket.project.id, options: {}})
          ])
        )
      )
    )
  );


}
