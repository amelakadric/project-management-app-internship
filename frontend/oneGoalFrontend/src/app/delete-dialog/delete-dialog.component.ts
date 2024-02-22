import { Component, Inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';

@Component({
  selector: 'app-delete-dialog',
  standalone: true,
    imports: [
        MatButton,
        MatDialogActions,
        MatDialogContent,
        MatDialogTitle
    ],
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.scss'
})
export class DeleteDialogComponent {

  public item!: string;
  public constructor(@Inject(MAT_DIALOG_DATA) public data: string, public dialogRef: MatDialogRef<DeleteDialogComponent>) {
    this.item = data;
  }

  public confirmed(): void {
    this.dialogRef.close(true);
  }

  public canceled(): void {
    this.dialogRef.close(false);
  }
}
