import { Component, OnInit } from '@angular/core';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { select, Store } from '@ngrx/store';

import { TicketsActions } from '../../store/actions/tickets.actions';
import { AppStateInterface } from '../../../types/app-state-interface';
import { TicketsFeature } from '../../store/reducer/ticket.reducer';
import { UsersFeature } from '../../../user/store/reducer/user.reducer';
import { Statuses } from '../../../enums/statuses.enum';
import { Types } from '../../../enums/type.enum';
import { TicketModel } from '../../../models/ticket.model';

@Component({
  selector: 'app-ticket-details-page',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './ticket-details-page.component.html',
  styleUrl: './ticket-details-page.component.scss'
})
export class TicketDetailsPageComponent implements OnInit{

  protected readonly Object = Object;
  protected readonly Statuses = Statuses;
  protected readonly Types = Types;
  public ticketId!: number;
  public projectId!: number;
  public ticket$ = this.store.pipe(select(TicketsFeature.selectTicket));
  public employees$ = this.store.pipe(select(UsersFeature.selectUsersArray));

  public constructor(private route: ActivatedRoute, private router: Router, private store: Store<AppStateInterface>){}

  ngOnInit(): void {
    if(this.route.snapshot.paramMap.get('ticketId') != null && this.route.snapshot.paramMap.get('projectId') != null) {
      this.ticketId = parseInt(<string>this.route.snapshot.paramMap.get('ticketId'), 10);
      this.projectId = parseInt(<string>this.route.snapshot.paramMap.get('projectId'), 10);
      this.store.dispatch(TicketsActions.load({projectId: this.projectId, ticketId: this.ticketId}));
    }
  }

  public backToProject(ticket: TicketModel){
    this.router.navigate(['tickets/', ticket.project.id]);
  }
}
