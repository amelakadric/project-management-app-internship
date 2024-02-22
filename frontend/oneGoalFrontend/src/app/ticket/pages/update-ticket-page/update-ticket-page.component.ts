import { Component, OnInit } from '@angular/core';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { UserModel } from '../../../models/user.model';
import { AppStateInterface } from '../../../types/app-state-interface';
import { TicketModel } from '../../../models/ticket.model';
import { Statuses } from '../../../enums/statuses.enum';
import { TicketsActions } from '../../store/actions/tickets.actions';
import { Types } from '../../../enums/type.enum';
import { Priorities } from '../../../enums/priorities.enum';
import { TicketsFeature } from '../../store/reducer/ticket.reducer';
import { ProjectFeature } from '../../../project/store/reducer/project.reducer';

@Component({
  selector: 'app-update-ticket-page',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './update-ticket-page.component.html',
  styleUrl: './update-ticket-page.component.scss'
})
export class UpdateTicketPageComponent implements OnInit{

  protected readonly Object = Object;
  protected readonly Priorities = Priorities;
  protected readonly Statuses = Statuses;
  protected readonly Types = Types;
  public ticketId!: number;
  public projectId!: number;
  public priority=['low', 'medium', 'high'];
  public types = Object.values(Types);
  public priorities = Object.values(Priorities);
  public employees: UserModel[];
  subscriptions: Array<Subscription> = [];
  public ticket: TicketModel = <TicketModel>{};
  public updateTicketForm;
  public ticket$ = this.store.pipe(select(TicketsFeature.selectTicket));

  public constructor(private store: Store<AppStateInterface>, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    if(this.route.snapshot.paramMap.get('ticketId') != null && this.route.snapshot.paramMap.get('projectId') != null) {
      this.ticketId = parseInt(<string>this.route.snapshot.paramMap.get('ticketId'), 10);
      this.projectId = parseInt(<string>this.route.snapshot.paramMap.get('projectId'), 10);
      this.store.dispatch(TicketsActions.load({projectId:this.projectId, ticketId:this.ticketId}));
      this.subscriptions.push(this.store.select(ProjectFeature.selectProject).subscribe((project) => {
        this.employees = project.employees
      }))
      this.subscriptions.push(this.store.pipe(select(TicketsFeature.selectTicket)).subscribe((ticket)=>{
        this.ticket = ticket;
        this.updateTicketForm = new FormGroup({
          title: new FormControl(this.ticket.title, Validators.required),
          description: new FormControl(this.ticket.description, Validators.required),
          assignedTo: new FormControl(this.ticket.assignedTo.id, Validators.required),
          type: new FormControl(this.ticket.type, Validators.required),
          priority: new FormControl('low', Validators.required),
          status: new FormControl(this.ticket.status, Validators.required)
        });
      }))
    }
  }

  public updateTicket(employees: UserModel[], ticketModel: TicketModel){
    let userId = parseInt(<string>this.updateTicketForm.value.assignedTo);
    let assigned: UserModel = employees.find((userModel: UserModel) => userModel.id === userId)!;

    const ticket = new TicketModel(
      ticketModel.id,
      ticketModel.project,
      this.updateTicketForm.value.title as string,
      this.updateTicketForm.value.description as string,
      assigned,
      assigned,
      this.updateTicketForm.value.type as Types,
      this.makeEnum(this.updateTicketForm.value.priority as string),
      this.updateTicketForm.value.status as Statuses
    )
    this.store.dispatch(TicketsActions.update({ticket}));
    this.router.navigate(['tickets/',ticket.project.id]);
  }

  public makeEnum(priority: string){
    switch(priority){
      case 'low': return Priorities.LOW;
      case 'medium': return Priorities.MEDIUM;
      case 'high': return Priorities.HIGH;

      default: return Priorities.LOW;
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }
}
