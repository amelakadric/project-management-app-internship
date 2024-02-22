import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';

import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { UsersPageComponent } from './users-page.component';
import { UsersActions } from '../../store/actions/users.actions';

describe('UsersPageComponent', () => {
  let component: UsersPageComponent;
  let fixture: ComponentFixture<UsersPageComponent>;
  let store: MockStore;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersPageComponent],
      providers: [provideMockStore({}), MatDialog]
    })
    .compileComponents();

    store = TestBed.inject(MockStore);
    dialog = TestBed.inject(MatDialog);
    spyOn(store, 'dispatch').and.callThrough();
    spyOn(dialog, 'open').and.returnValue({
      afterClosed: () => ({
        subscribe: (callback: (result: boolean) => void) => {
          callback(true);
        },
      }),
    } as any);
    fixture = TestBed.createComponent(UsersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('dispatches load action on ngOnInit', () => {
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(UsersActions.loadAll());
  });

  it('opens delete confirmation dialog and dispatch remove action when confirmed', () => {
    const userId = 123;
    spyOn(component, 'openedDeleteConfirmationDialog').and.callThrough();

    component.actionToDelete(userId);

    expect(component.openedDeleteConfirmationDialog).toHaveBeenCalled();

    expect(store.dispatch).toHaveBeenCalledWith(UsersActions.remove({ id: userId }));
  });
});
