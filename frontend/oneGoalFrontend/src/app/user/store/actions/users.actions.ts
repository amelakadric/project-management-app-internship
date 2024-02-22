import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { UserType } from '../../../types/user.type';

export const UsersActions = createActionGroup({
  source: 'Users',
  events: {
    'Load All': emptyProps(),
    'Load': props<{ id: number }>(),
    'Create': props<{ user: UserType }>(),
    'Login': props<{ email: string, password: string }>(),
    'Logout': emptyProps(),
    'Update': props<{ user: UserType }>(),
    'Remove': props<{ id: number }>(),
    'Load Current': emptyProps()
  }
})
