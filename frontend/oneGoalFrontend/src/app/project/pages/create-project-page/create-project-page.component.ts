import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { UserModel } from '../../../models/user.model';
import { AppStateInterface } from '../../../types/app-state-interface';
import { UsersFeature } from '../../../user/store/reducer/user.reducer';
import { ProjectsActions } from '../../store/actions/projects.actions';
import { UsersActions } from '../../../user/store/actions/users.actions';
import { MessagePopUpComponent } from '../../../message-pop-up/message-pop-up.component';

@Component({
  selector: 'app-create-project-page',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    ReactiveFormsModule,
    FormsModule,
    AsyncPipe,
    NgIf
  ],
  templateUrl: './create-project-page.component.html',
  styleUrl: './create-project-page.component.scss'
})
export class CreateProjectPageComponent implements OnInit{

  public selectedOption: UserModel;

  public addedEmployees: UserModel[] = [];

  public employees$: Observable<UserModel[]> = this.store.pipe(select(UsersFeature.selectEmployeesArray));

  public managers$: Observable<UserModel[]> = this.store.pipe(select(UsersFeature.selectManagersArray));

  public constructor(private router: Router, private store: Store<AppStateInterface>, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.store.dispatch(UsersActions.loadAll());
  }

  projectForm = new FormGroup({
    title: new FormControl('', Validators.required),
    manager: new FormControl('', Validators.required),
    employees: new FormControl('')
  })

  public onChange(){
    if(this.selectedOption){
      if(!this.addedEmployees.includes(this.selectedOption)){
        this.addedEmployees.push(this.selectedOption);
      }
    }
  }

  public removeEmployee(user:UserModel){
    const newArray = this.addedEmployees.filter((userModel: UserModel): boolean => userModel != user);
    this.addedEmployees = newArray;
  }

  public createProject(managers: UserModel[]){
    if(this.projectForm.valid){
      const managerId: number = parseInt(<string>this.projectForm.value.manager, 10);
      const title = this.projectForm.value.title as string;
      const employees: number[] = this.addedEmployees.map((user) => user.id);
      this.store.dispatch(ProjectsActions.create({name: title, managerId: managerId, employees:employees}));
    }else{
      this.openMessageDialog('All fields must be filled.');
    }

  }

  public openMessageDialog(message: string): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = message;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';

    const dialogRef = this.dialog.open(MessagePopUpComponent, dialogConfig);
  }
}
