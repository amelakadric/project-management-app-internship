import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe, NgForOf } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { Store } from '@ngrx/store';

import { Genders } from '../enums/genders.enum';
import { Roles } from '../enums/roles.enum';
import { UserModel } from '../models/user.model';
import { UsersActions } from '../user/store/actions/users.actions';
import { AppStateInterface } from '../types/app-state-interface';
import { MessagePopUpComponent } from '../message-pop-up/message-pop-up.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    AsyncPipe,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  public constructor(private store: Store<AppStateInterface>, private router: Router, public dialog: MatDialog) {
  }

  protected readonly Object = Object;
  protected readonly Genders = Genders;

  public registrationForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    gender:  new FormControl('', Validators.required),
    phoneNumber: new FormControl(''),
    email: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  })

  public registerUser(){
    if(this.registrationForm.valid) {
      const user = new UserModel(3,
        this.registrationForm.value.firstName as string,
        this.registrationForm.value.lastName as string,
        this.registrationForm.value.phoneNumber as string,
        this.registrationForm.value.gender as Genders,
        this.registrationForm.value.email as string,
        this.registrationForm.value.password as string,
        Roles.EMPLOYEE
      );
      this.store.dispatch(UsersActions.create({user}));
     } else{
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
