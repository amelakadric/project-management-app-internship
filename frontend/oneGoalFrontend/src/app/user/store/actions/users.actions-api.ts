import { createActionGroup, props } from '@ngrx/store';

import { UserType } from '../../../types/user.type';
import { Roles } from '../../../enums/roles.enum';

export const UsersActionsApi = createActionGroup({
  source: 'Users/Api',
  events: {
    'Load All Success': props<{ users: UserType[] }>(),
    'Load All Failure': props<{ error: string }>(),

    'Load Success': props<{ user: UserType }>(),
    'Load Failure': props<{ error: string }>(),

    'Create Success': props<{ user: UserType }>(),
    'Create Failure': props<{ error: string }>(),

    'Login Success': props<{ role: Roles }>(),
    'Login Failure': props<{ error: string }>(),

    'Logout Success': props<{ message: string }>(),
    'Logout Failure': props<{ error: string }>(),

    'Update Success': props<{ user: UserType }>(),
    'Update Failure': props<{ error: string }>(),

    'Remove Success': props<{ isDeleted: boolean }>(),
    'Remove Failure': props<{ error: string }>(),

    'Load Current Success': props<{ user: UserType }>(),
    'Load Current Failure': props<{ error: string }>(),
  }
})
