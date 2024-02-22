import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { MessagePopUpComponent } from './message-pop-up.component';

describe('MessagePopUpComponent', () => {
  let component: MessagePopUpComponent;
  let fixture: ComponentFixture<MessagePopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessagePopUpComponent],
      providers: [{ provide: MatDialogRef, useValue: {}}, { provide: MAT_DIALOG_DATA, useValue: {} }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessagePopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });
});
