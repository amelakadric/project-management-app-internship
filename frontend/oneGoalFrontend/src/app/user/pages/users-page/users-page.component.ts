import { Component, OnInit } from '@angular/core';
import { AsyncPipe, NgForOf } from '@angular/common';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { UserCardComponent } from '../../components/user-card/user-card.component';
import { AppStateInterface } from '../../../types/app-state-interface';
import { UsersFeature } from '../../store/reducer/user.reducer';
import { UserModel } from '../../../models/user.model';
import { UsersActions } from '../../store/actions/users.actions';
import { DeleteDialogComponent } from '../../../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [
    UserCardComponent,
    NgForOf,
    AsyncPipe
  ],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.scss'
})
export class UsersPageComponent implements OnInit{

  public userId!: number;
  public userArray$: Observable<UserModel[]> = this.store.pipe(select(UsersFeature.selectUsersArray));

  public constructor(public dialog: MatDialog, private store: Store<AppStateInterface>) {}

  ngOnInit(): void {
    this.store.dispatch(UsersActions.loadAll());
  }

  public actionToDelete(event: number){
    this.userId = event;
    this.openedDeleteConfirmationDialog();
  }

  public openedDeleteConfirmationDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = 'user';
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';

    const dialogRef = this.dialog.open(DeleteDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const id = this.userId;
        this.store.dispatch(UsersActions.remove({id}));

      } else {
        console.log('Deletion canceled.');
      }
    });
  }
}
