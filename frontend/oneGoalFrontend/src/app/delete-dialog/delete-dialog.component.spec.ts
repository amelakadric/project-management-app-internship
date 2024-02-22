import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { DeleteDialogComponent } from './delete-dialog.component';

describe('DeleteDialogComponent', () => {
  let component: DeleteDialogComponent;
  let fixture: ComponentFixture<DeleteDialogComponent>;
  let dialogRef: MatDialogRef<DeleteDialogComponent>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [DeleteDialogComponent],
      providers: [{ provide: MatDialogRef, useValue: {close: jasmine.createSpy('close')}}, { provide: MAT_DIALOG_DATA, useValue: {} }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteDialogComponent);
    dialogRef = TestBed.inject(MatDialogRef);
    component = TestBed.createComponent(DeleteDialogComponent).componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('closes dialog with true on confirmed', () => {
    component.confirmed();
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('closes dialog with false on canceled', () => {
    component.canceled();
    expect(dialogRef.close).toHaveBeenCalledWith(false);
  });
});
