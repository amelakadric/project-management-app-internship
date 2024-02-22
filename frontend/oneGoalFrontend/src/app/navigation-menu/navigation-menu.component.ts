import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AsyncPipe, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppStateInterface } from '../types/app-state-interface';
import { UsersFeature } from '../user/store/reducer/user.reducer';
import { Roles } from '../enums/roles.enum';
import { UserModel } from '../models/user.model';
import { UsersActions } from '../user/store/actions/users.actions';

@Component({
  selector: 'app-navigation-menu',
  standalone: true,
  imports: [
    RouterLinkActive,
    RouterLink,
    AsyncPipe,
    NgIf,
    RouterOutlet,
    NgSwitch,
    NgSwitchDefault,
    NgSwitchCase
  ],
  templateUrl: './navigation-menu.component.html',
  styleUrl: './navigation-menu.component.scss',
})
export class NavigationMenuComponent implements OnInit{

  protected readonly Roles = Roles;

  public user$: Observable<UserModel>;

  constructor(private store: Store<AppStateInterface>, private router: Router) {
  }

  ngOnInit(): void {
    this.user$ = this.store.pipe(select(UsersFeature.selectCurrentUser));
  }

  logout(){
    this.store.dispatch(UsersActions.logout());
  }

}
