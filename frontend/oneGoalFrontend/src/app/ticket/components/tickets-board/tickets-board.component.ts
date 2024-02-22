import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {
  CdkDrag,
  CdkDragDrop, CdkDropList,
  CdkDropListGroup,
  DragDropModule,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';

import { Store } from '@ngrx/store';

import { TicketCardComponent } from '../ticket-card/ticket-card.component';
import { TicketModel } from '../../../models/ticket.model';
import { Statuses } from '../../../enums/statuses.enum';
import { AppStateInterface } from '../../../types/app-state-interface';
import { DeleteDialogComponent } from '../../../delete-dialog/delete-dialog.component';
import { ProjectsActions } from '../../../project/store/actions/projects.actions';

@Component({
  selector: 'app-tickets-board',
  standalone: true,
  imports: [
    CdkDrag,
    CdkDropList,
    TicketCardComponent,
    DragDropModule,
    CdkDropListGroup,
    TicketCardComponent,
  ],
  templateUrl: './tickets-board.component.html',
  styleUrl: './tickets-board.component.scss'
})
export class TicketsBoardComponent {

  public ticketId!: number;
  public tickets!: TicketModel[];
  public backlogTickets: TicketModel[] = [];
  public toDoTickets: TicketModel[] = [];
  public inProgressTickets: TicketModel[] = [];
  public doneTickets: TicketModel[] = [];

  @Input() projectId!: number;
  @Input('tickets')
  set ticketState(tickets: Array<TicketModel>){
    this.tickets = tickets;
    this.sortArrays();
  }

  @Output() updatedStatus = new EventEmitter<TicketModel>();

  public constructor(private dialog: MatDialog, private store: Store<AppStateInterface>) {
  }

  public sortArrays(){
    this.backlogTickets = this.tickets.filter((ticket: TicketModel) => ticket.status === Statuses.BACKLOG);
    this.toDoTickets = this.tickets.filter((ticket: TicketModel) => ticket.status === Statuses.TODO);
    this.inProgressTickets = this.tickets.filter((ticket: TicketModel) => ticket.status === Statuses.INPROGRESS);
    this.doneTickets = this.tickets.filter((ticket: TicketModel) => ticket.status === Statuses.DONE);
  }

  public actionToDelete(event: number){
    this.ticketId = event;
    this.openedDeleteConfirmationDialog();
  }

  public openedDeleteConfirmationDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = 'ticket';
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';

    const dialogRef = this.dialog.open(DeleteDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const id = this.ticketId;
        this.store.dispatch(ProjectsActions.removeTicket({projectId: this.projectId, ticketId: id}));
      } else {
        console.log('Deletion canceled.');
      }
    });
  }

  public drop(event: CdkDragDrop<TicketModel[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      event.previousContainer.data[event.previousIndex] = {...event.previousContainer.data[event.previousIndex], status:this.findStatus(event.container.id)}
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      this.updatedStatus.emit(event.container.data[event.currentIndex]);
    }
  }

  public findStatus(id: string | undefined){
    switch(id){
      case '0': return Statuses.BACKLOG;
      case '1': return Statuses.TODO;
      case '2': return Statuses.INPROGRESS;
      case '3': return Statuses.DONE;

      default: return  Statuses.BACKLOG;
    }
  }
}
