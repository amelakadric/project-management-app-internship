import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';

import { Store } from '@ngrx/store';

import { AppStateInterface } from '../types/app-state-interface';
import { UsersActions } from '../user/store/actions/users.actions';
import { NavigationMenuComponent } from '../navigation-menu/navigation-menu.component';
import { MessagePopUpComponent } from '../message-pop-up/message-pop-up.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NavigationMenuComponent,
    MatFormField,
    MatLabel,
    MatFormFieldModule,
    MatInput
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  public constructor(private store: Store<AppStateInterface>, private router: Router, private dialog: MatDialog){}

  public loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  public loginUser(){
    if(this.loginForm.valid){
      const email = this.loginForm.value.email as string;
      const password = this.loginForm.value.password as string;
      this.store.dispatch(UsersActions.login({email, password}));

    }else{
      this.openMessageDialog('All fields must be filled.')
    }
  }

  public navigate(){
    this.router.navigate(['register']);
  }

  public openMessageDialog(message: string): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = message;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';

    const dialogRef = this.dialog.open(MessagePopUpComponent, dialogConfig);
  }
}
