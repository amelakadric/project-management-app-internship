import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOptionsComponent } from './user-options.component';
import { Operations } from '../../../enums/operations.enum';

describe('UserOptionsComponent', () => {
  let component: UserOptionsComponent;
  let fixture: ComponentFixture<UserOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserOptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('toggles dropdown', () => {
    expect(component.showDropdown).toBeFalse();
    component.toggleDropdown();
    expect(component.showDropdown).toBeTrue();
  });

  it('emits action when handleAction is called', () => {
    spyOn(component.action, 'emit');
    const testAction: Operations = Operations.UPDATE;
    component.handleAction(testAction);
    expect(component.action.emit).toHaveBeenCalledWith(testAction);
  });
});
