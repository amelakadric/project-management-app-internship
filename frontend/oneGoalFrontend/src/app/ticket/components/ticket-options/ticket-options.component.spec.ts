import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketOptionsComponent } from './ticket-options.component';
import { Operations } from '../../../enums/operations.enum';

describe('TicketOptionsComponent', () => {
  let component: TicketOptionsComponent;
  let fixture: ComponentFixture<TicketOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketOptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketOptionsComponent);
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
