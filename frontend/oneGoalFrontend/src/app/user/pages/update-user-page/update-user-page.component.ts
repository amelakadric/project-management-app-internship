import { Component, OnInit } from '@angular/core';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';


import { UserModel } from '../../../models/user.model';
import { Genders } from '../../../enums/genders.enum';
import { Roles } from '../../../enums/roles.enum';
import { AppStateInterface } from '../../../types/app-state-interface';
import { UsersActions } from '../../store/actions/users.actions';
import { UsersFeature } from '../../store/reducer/user.reducer';

@Component({
  selector: 'app-update-user-page',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule,
    AsyncPipe,
    NgIf
  ],
  templateUrl: './update-user-page.component.html',
  styleUrl: './update-user-page.component.scss'
})
export class UpdateUserPageComponent implements OnInit{

  protected readonly Object = Object;
  protected readonly Genders = Genders;
  protected readonly Roles = Roles;
  public showPassword = false;
  public id!:number;
  subscriptions: Array<Subscription> = [];
  public user: UserModel;
  public updateUserForm;
  public user$ = this.store.pipe(select(UsersFeature.selectUser));

  public constructor(public store: Store<AppStateInterface>, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    if(this.route.snapshot.paramMap.get('userId') != null) {
      this.id = parseInt(<string>this.route.snapshot.paramMap.get('userId'), 10);
      this.store.dispatch(UsersActions.load({id: this.id}));

      this.subscriptions.push(this.store.pipe(select(UsersFeature.selectUser)).subscribe((user)=>{
        this.user = user;
        this.updateUserForm = new FormGroup({
            firstName: new FormControl(this.user.firstname, Validators.required),
            lastName: new FormControl(this.user.lastname, Validators.required),
            gender:  new FormControl(this.user.gender, Validators.required),
            phoneNumber: new FormControl(this.user.phoneNumber),
            email: new FormControl(this.user.email, Validators.required),
            password: new FormControl(this.user.password),
            role: new FormControl(this.user.role, Validators.required)
          })
      }))
    }
  }

  public updatedUser(){
    if(this.updateUserForm.valid) {
      const user = new UserModel(
        this.id,
        this.updateUserForm.value.firstName as string,
        this.updateUserForm.value.lastName as string,
        this.updateUserForm.value.phoneNumber as string,
        this.updateUserForm.value.gender as Genders,
        this.updateUserForm.value.email as string,
        this.updateUserForm.value.password as string,
        this.updateUserForm.value.role as Roles
      );
      this.store.dispatch(UsersActions.update({user}));
      this.store.dispatch(UsersActions.loadAll());

    } else{
      //console.log('Neispravna forma');
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }
}
