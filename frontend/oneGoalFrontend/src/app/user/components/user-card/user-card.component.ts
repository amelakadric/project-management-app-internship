import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

import { UserModel } from '../../../models/user.model';
import { UserOptionsComponent } from '../user-options/user-options.component';
import { Operations } from '../../../enums/operations.enum';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [
    UserOptionsComponent,
    NgIf,
    MatIcon
  ],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss'
})
export class UserCardComponent {

  @Input() user !: UserModel;
  @Output() delete = new EventEmitter<number>();

  public constructor(public router: Router){}

  public responseToAction(event: Operations) {
    if( event === Operations.UPDATE ){
      this.router.navigate(['update-user/' + this.user.id.toString()]);
    }else if( event === Operations.DELETE ){
      this.delete.emit(this.user.id);
    }
  }
}
