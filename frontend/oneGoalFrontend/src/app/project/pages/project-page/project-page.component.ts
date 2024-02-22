import { Component, OnInit } from '@angular/core';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { ProjectCardComponent } from '../../components/project-card/project-card.component';
import { ProjectModel } from '../../../models/project.model';
import { AppStateInterface } from '../../../types/app-state-interface';
import { ProjectFeature } from '../../store/reducer/project.reducer';
import { ProjectsActions } from '../../store/actions/projects.actions';
import { DeleteDialogComponent } from '../../../delete-dialog/delete-dialog.component';
import { UserModel } from '../../../models/user.model';
import { UsersFeature } from '../../../user/store/reducer/user.reducer';
import { Roles } from '../../../enums/roles.enum';
import { UsersActions } from '../../../user/store/actions/users.actions';

@Component({
  selector: 'app-project-page',
  standalone: true,
  imports: [
    NgForOf,
    AsyncPipe,
    NgIf,
    ProjectCardComponent
  ],
  templateUrl: './project-page.component.html',
  styleUrl: './project-page.component.scss'
})
export class ProjectPageComponent implements OnInit{

  protected readonly Roles = Roles;

  public projectId!: number;

  public projects$: Observable<ProjectModel[]> = this.store.pipe(select(ProjectFeature.selectProjectArray));

  public currentUser$: Observable<UserModel> = this.store.pipe(select(UsersFeature.selectCurrentUser));

  subscriptions: Array<Subscription> = [];

  public constructor(private router: Router, public dialog: MatDialog, private store: Store<AppStateInterface>) {
  }

  ngOnInit(): void {
    this.store.dispatch(UsersActions.loadCurrent());
    let user: UserModel;
    this.subscriptions.push(this.currentUser$.subscribe((data) => {
      user = data;

      switch (user.role){
        case Roles.ADMIN: this.store.dispatch(ProjectsActions.loadAll()); break;
        case Roles.MANAGER: this.store.dispatch(ProjectsActions.loadManagers({id: user.id})); break;
        case Roles.EMPLOYEE: this.store.dispatch(ProjectsActions.loadUsers({id: user.id})); break;
      }
    }));
  }

  public createProject(){
    this.router.navigate(['create-project'])
  }

  public actionToDelete(event: number){
    this.projectId = event;
    this.openedDeleteConfirmationDialog();
  }

  public openedDeleteConfirmationDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = 'project';
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';

    const dialogRef = this.dialog.open(DeleteDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const id = this.projectId;
        this.store.dispatch(ProjectsActions.remove({id}));
      } else {
        console.log('Deletion canceled.');
      }
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }
}
