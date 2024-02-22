import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Subscription } from 'rxjs';

import { ProjectPageComponent } from './project-page.component';
import { UsersActions } from '../../../user/store/actions/users.actions';
import { ProjectsActions } from '../../store/actions/projects.actions';

describe('ProjectPageComponent', () => {
  let component: ProjectPageComponent;
  let fixture: ComponentFixture<ProjectPageComponent>;let store: MockStore;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectPageComponent],
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
    fixture = TestBed.createComponent(ProjectPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('dispatches loadCurrent action on ngOnInit', () => {
    expect(component).toBeTruthy();

    expect(component['store'].dispatch).toHaveBeenCalledWith(UsersActions.loadCurrent());
  });

  it('calls delete confirmation dialog on createProject', () => {
    spyOn(component, 'openedDeleteConfirmationDialog');
    component.actionToDelete(1);
    expect(component.openedDeleteConfirmationDialog).toHaveBeenCalled();
  });

  it('opens delete confirmation dialog and dispatch remove action when confirmed', () => {
    const projectId = 123;
    spyOn(component, 'openedDeleteConfirmationDialog').and.callThrough();

    component.actionToDelete(projectId);

    expect(component.openedDeleteConfirmationDialog).toHaveBeenCalled();

    expect(store.dispatch).toHaveBeenCalledWith(ProjectsActions.remove({ id: projectId }));
  });

  it('navigates to create-project route', () => {
    const routerSpy = spyOn(component['router'], 'navigate').and.stub(); // Spy na navigate metodu, stubujemo da ne menjamo stvarnu rutu
    component.createProject();
    expect(routerSpy).toHaveBeenCalledWith(['create-project']);
  });

  it('unsubscribes from all subscriptions in ngOnDestroy', () => {
    const subscription1 = new Subscription();
    const subscription2 = new Subscription();

    component.subscriptions = [subscription1, subscription2];

    component.ngOnDestroy();

    expect(subscription1.closed).toBeTruthy();
    expect(subscription2.closed).toBeTruthy();
  });
});
