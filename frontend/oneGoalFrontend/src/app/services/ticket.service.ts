import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError, map, mergeMap, of, switchMap, throwError } from 'rxjs';

import { TicketModel } from '../models/ticket.model';
import { environment } from '../../environment/environment';
import { Types } from '../enums/type.enum';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  baseUrl = environment.backendServerUrl + '/tickets';

  constructor(private http: HttpClient) {
  }


  public getTicketsFromProject(id: number, options?:{title?: string, userId?: number, ticketType?: Types}){
    let path = environment.backendServerUrl + '/projects/' + id + '/tickets';
    if(options) {
      if (options.title !== undefined && options.title && options.title.length > 0) {
        path += `?title=${(options.title)}`;
      }
      if (options.userId !== undefined && options.userId !== -1) {
        path += `${path.includes('?') ? '&' : '?'}userId=${options.userId}`;
      }
      if (options.ticketType !== undefined && options.ticketType !== null) {
        path += `${path.includes('?') ? '&' : '?'}ticketType=${options.ticketType}`;
      }
    }

    return this.http.get(path, {withCredentials: true}).pipe(
      map((data: {tickets: TicketModel[]}) =>  data.tickets ),
      catchError((error) => throwError(() => error))
    )

  }

  public getTicket(projectId: number, ticketId: number){
    return this.http.get(environment.backendServerUrl + '/projects/' + projectId + '/tickets/'+ ticketId, {withCredentials: true}).pipe(
      map((data: {ticket: TicketModel}) => data.ticket),
      catchError((error) => throwError(() => error))
    );
  }

  public updateTicket(ticket: TicketModel){
    return this.http.patch(environment.backendServerUrl + '/projects/' + ticket.project.id + '/tickets/' + ticket.id,
      {title: ticket.title, description: ticket.description, status: ticket.status, priority: ticket.priority, type: ticket.type, assignedTo: ticket.assignedTo.id},
      {withCredentials: true}).pipe(
      map((data: {ticket: TicketModel}) => data.ticket),
      catchError((error) => throwError(() => error))
    );
  }
}
