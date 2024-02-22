import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

import { Statuses } from '../../../enums/statuses.enum';
import { TicketModel } from '../../../models/ticket.model';
import { Priorities } from '../../../enums/priorities.enum';
import { TicketOptionsComponent } from '../ticket-options/ticket-options.component';
import { Operations } from '../../../enums/operations.enum';

@Component({
  selector: 'app-ticket-card',
  standalone: true,
  imports: [
    TicketOptionsComponent,
    NgClass,
    NgIf,
    MatIcon
  ],
  templateUrl: './ticket-card.component.html',
  styleUrl: './ticket-card.component.scss'
})
export class TicketCardComponent {

  protected readonly Priorities = Priorities;

  @Input() ticket!: TicketModel;
  @Output() delete = new EventEmitter<number>();

  public constructor(public router: Router) {}

  public makeStatusImage(){
    let url = "../../assets/status-images/";

    switch(this.ticket.status){
      case Statuses.BACKLOG: return url + "1.png";
      case Statuses.TODO: return url + "2.png";
      case Statuses.INPROGRESS: return  url + "3.png";
      case Statuses.DONE: return  url + "4.png";

      default: return url;
    }
  }

  public responseToAction(event: Operations){
    if(event === Operations.DELETE){
      this.delete.emit(this.ticket.id);
    } else if(event === Operations.UPDATE){
      this.router.navigate(['update-ticket/' + this.ticket.project.id + '/' + this.ticket.id]);
    } else if(event === Operations.DETAILS){
      this.router.navigate(['ticket-details/' + this.ticket.project.id + '/' + this.ticket.id])
    }
  }
}
