import { Component, OnInit } from '@angular/core';
import {
  CdkDrag, CdkDropList,
  CdkDropListGroup,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, NgForOf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { select, Store } from '@ngrx/store';
import { map, Observable, Subscription } from 'rxjs';

import { TicketModel } from '../../../models/ticket.model';
import { Priorities } from '../../../enums/priorities.enum';
import { TicketCardComponent } from '../../components/ticket-card/ticket-card.component';
import { AppStateInterface } from '../../../types/app-state-interface';
import { TicketsFeature } from '../../store/reducer/ticket.reducer';
import { TicketsActions } from '../../store/actions/tickets.actions';
import { TicketsBoardComponent } from '../../components/tickets-board/tickets-board.component';
import { Types } from '../../../enums/type.enum';
import { UserModel } from '../../../models/user.model';
import { ProjectsActions } from '../../../project/store/actions/projects.actions';
import { ProjectFeature } from '../../../project/store/reducer/project.reducer';
import { ProjectModel } from '../../../models/project.model';

@Component({
  selector: 'app-tickets-page',
  standalone: true,
  imports: [
    NgForOf,
    TicketCardComponent,
    CommonModule,
    DragDropModule,
    CdkDropListGroup, CdkDropList, CdkDrag, TicketsBoardComponent, ReactiveFormsModule, FormsModule,
  ],
  templateUrl: './tickets-page.component.html',
  styleUrl: './tickets-page.component.scss'
})
export class TicketsPageComponent implements OnInit{

  protected readonly Types = Types;
  protected readonly Object = Object;
  protected Priorities = Priorities;
  public typeSelectedOption!: string | Types;
  public userSelectedOption!: number;
  public projectId!: number;
  public ticketId!: number;
  public options: {title?: string, userId?: number, ticketType?: Types};
  subscriptions: Array<Subscription> = [];

  public tickets$: Observable<TicketModel[]> = this.store.pipe(select(TicketsFeature.selectTicketsArray));
  public project$: Observable<ProjectModel> = this.store.pipe(select(ProjectFeature.selectProject))
  public employees!: UserModel[];

  public constructor(private store: Store<AppStateInterface>, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    if(this.route.snapshot.paramMap.get('projectId') != null) {
      this.projectId = parseInt(<string>this.route.snapshot.paramMap.get('projectId'), 10);
      this.store.dispatch(TicketsActions.loadTicketsFromProject({id: this.projectId, options: this.options}));
      this.store.dispatch(ProjectsActions.load({id: this.projectId}));
      this.subscriptions.push(this.store.select(ProjectFeature.selectProject).subscribe((project) => {
        this.employees = project.employees
      }))
    }
  }

  public setOptions(options: { title?: string; userId?: number; ticketType?: Types }): void {
    this.options = { ...this.options, ...options };
  }

  public searchForTitle(search: string){
    if(search) {
      this.setOptions({title: search});
    }else{
      this.setOptions({title: null});
    }
    this.store.dispatch(TicketsActions.loadTicketsFromProject({id: this.projectId, options: this.options}));

  }

  public changeType(){
    if(this.typeSelectedOption === 'all'){
      this.setOptions({ticketType: null});
    }else{
      this.setOptions({ticketType: this.typeSelectedOption as Types});
    }
    this.store.dispatch(TicketsActions.loadTicketsFromProject({id: this.projectId, options: this.options}));

  }

  public changeUser(){
    console.log(this.userSelectedOption);
    if(this.userSelectedOption > -1){
      this.setOptions({userId: this.userSelectedOption});
    }else{
      this.setOptions({userId: -1});
    }
    this.store.dispatch(TicketsActions.loadTicketsFromProject({id: this.projectId, options: this.options}));

  }

  public sortByPriority(){
    this.tickets$ = this.tickets$.pipe(
      map(tickets => tickets.slice().sort((a, b) => b.priority - a.priority))
    );

  }

  public createTicket(){
    this.router.navigate(['create-ticket/', this.projectId]);
  }

  public updateStatus(event: TicketModel){
    this.store.dispatch(TicketsActions.update({ticket: event}));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

}
