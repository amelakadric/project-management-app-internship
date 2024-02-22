import { Routes } from '@angular/router';
import { importProvidersFrom } from '@angular/core';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { UsersFeature } from './user/store/reducer/user.reducer';
import { UsersEffects } from './user/store/effects/users.effects';
import { UserService } from './services/user.service';
import { LoginComponent } from './login/login.component';
import { TicketsFeature } from './ticket/store/reducer/ticket.reducer';
import { TicketsEffects } from './ticket/store/effects/tickets.effects';
import { TicketService } from './services/ticket.service';
import { ProjectFeature } from './project/store/reducer/project.reducer';
import { ProjectsEffects } from './project/store/effects/projects.effects';
import { ProjectService } from './services/project.service';
import { AuthGuard } from './guards/auth.guard';
import { Roles } from './enums/roles.enum';
import { TicketDetailsPageComponent } from './ticket/pages/ticket-details-page/ticket-details-page.component';

export const routes: Routes = [
  {
    path: '',
    providers: [
      importProvidersFrom(StoreModule.forFeature(UsersFeature), EffectsModule.forFeature([UsersEffects])),
      UserService
    ],
    component: LoginComponent,
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.component')
      .then(c => c.RegisterComponent),
    providers: [
      importProvidersFrom(StoreModule.forFeature(UsersFeature), EffectsModule.forFeature([UsersEffects])),
      UserService,
    ],
  },
  {
    path: 'login',
    providers: [
      importProvidersFrom(StoreModule.forFeature(UsersFeature), EffectsModule.forFeature([UsersEffects])),
      UserService
    ],
    component: LoginComponent,
  },
  {

    path: 'update-user/:userId',
    loadComponent: () => import('./user/pages/update-user-page/update-user-page.component')
      .then(c => c.UpdateUserPageComponent),
    providers: [
      importProvidersFrom(StoreModule.forFeature(UsersFeature), EffectsModule.forFeature([UsersEffects])),
      UserService
    ],
    canActivate:[AuthGuard],
    data: {
      requiredRole: [Roles.ADMIN]
    }
  },
  {
    path: 'users',
    loadComponent: () => import('./user/pages/users-page/users-page.component')
      .then(c => c.UsersPageComponent),
    providers: [
      importProvidersFrom(StoreModule.forFeature(UsersFeature), EffectsModule.forFeature([UsersEffects])),
      UserService
    ],
    canActivate:[AuthGuard],
    data: {
      requiredRole: [Roles.ADMIN]
    }
  },
  {
    path:'tickets/:projectId',
    loadComponent: () => import('./ticket/pages/tickets-page/tickets-page.component')
      .then(c => c.TicketsPageComponent),
    providers: [
      importProvidersFrom(StoreModule.forFeature(TicketsFeature), EffectsModule.forFeature([TicketsEffects]),
        StoreModule.forFeature(UsersFeature), EffectsModule.forFeature([UsersEffects]),
        StoreModule.forFeature(ProjectFeature), EffectsModule.forFeature([ProjectsEffects])),
      TicketService
    ],
    canActivate:[AuthGuard],
    data: {
      requiredRole: [Roles.ADMIN, Roles.MANAGER, Roles.EMPLOYEE]
    }
  },
  {
    path:'create-ticket/:projectId',
    loadComponent: () => import('./ticket/pages/create-ticket-page/create-ticket-page.component')
      .then(c => c.CreateTicketPageComponent),
    providers: [
      importProvidersFrom(StoreModule.forFeature(TicketsFeature), EffectsModule.forFeature([TicketsEffects]),
        StoreModule.forFeature(UsersFeature), EffectsModule.forFeature([UsersEffects])),
      TicketService
    ],
    canActivate:[AuthGuard],
    data: {
      requiredRole: [Roles.ADMIN, Roles.MANAGER, Roles.EMPLOYEE]
    }
  },
  {
    path: 'update-ticket/:projectId/:ticketId',
    loadComponent: () => import('./ticket/pages/update-ticket-page/update-ticket-page.component')
      .then(c => c.UpdateTicketPageComponent),
    providers: [
      importProvidersFrom(StoreModule.forFeature(TicketsFeature), EffectsModule.forFeature([TicketsEffects]),
        StoreModule.forFeature(UsersFeature), EffectsModule.forFeature([UsersEffects])),
      TicketService
    ],
    canActivate:[AuthGuard],
    data: {
      requiredRole: [Roles.ADMIN, Roles.MANAGER, Roles.EMPLOYEE]
    }
  },
  {
    path: 'ticket-details/:projectId/:ticketId',
    loadComponent: () => import('./ticket/pages/ticket-details-page/ticket-details-page.component')
      .then(c => c.TicketDetailsPageComponent),
    providers: [
      importProvidersFrom(StoreModule.forFeature(TicketsFeature), EffectsModule.forFeature([TicketsEffects]),
        StoreModule.forFeature(UsersFeature), EffectsModule.forFeature([UsersEffects])),
      TicketService],
    canActivate:[AuthGuard],
    data: {
      requiredRole: [Roles.ADMIN, Roles.MANAGER, Roles.EMPLOYEE]
    }
  },
  {
    path: 'projects',
    loadComponent: () => import('./project/pages/project-page/project-page.component')
      .then(c => c.ProjectPageComponent),
    providers: [
      importProvidersFrom(StoreModule.forFeature(ProjectFeature), EffectsModule.forFeature([ProjectsEffects])),
      ProjectService
    ],
    canActivate:[AuthGuard],
    data: {
      requiredRole: [Roles.ADMIN, Roles.MANAGER, Roles.EMPLOYEE]
    },

  },
  {
    path: 'create-project',
    loadComponent: () => import('./project/pages/create-project-page/create-project-page.component')
      .then(c => c.CreateProjectPageComponent),
    providers: [
      importProvidersFrom(StoreModule.forFeature(ProjectFeature), EffectsModule.forFeature([ProjectsEffects]),
                          StoreModule.forFeature(UsersFeature), EffectsModule.forFeature([UsersEffects])),
      ProjectService
    ],
    canActivate:[AuthGuard],
    data: {
      requiredRole: [Roles.ADMIN]
    }
  },
  {
    path: 'update-project/:projectId',
    loadComponent: () => import('./project/pages/update-project-page/update-project-page.component')
      .then(c => c.UpdateProjectPageComponent),
    providers: [
      importProvidersFrom(StoreModule.forFeature(ProjectFeature), EffectsModule.forFeature([ProjectsEffects]),
        StoreModule.forFeature(UsersFeature), EffectsModule.forFeature([UsersEffects])),
      ProjectService
    ],
    canActivate:[AuthGuard],
    data: {
      requiredRole: [Roles.ADMIN, Roles.MANAGER]
    }
  }

];
