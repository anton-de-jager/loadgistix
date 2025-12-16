import { NgIf } from '@angular/common';
import { Component, Inject, OnDestroy, inject, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-info',
  templateUrl: './dialog-info.component.html',
  styleUrls: ['./dialog-info.component.scss'],
  standalone: true,
  imports: [MatIconModule, MatDialogModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, NgIf],
  encapsulation: ViewEncapsulation.None
})
export class DialogInfoComponent implements OnDestroy {
  private _unsubscribeAll = new Subject<void>();
  stopAction = true;
  title = '';
  alertHeading = '';
  alertContent = '';

  constructor(
    public dialogRef: MatDialogRef<DialogInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.stopAction = data.stopAction;
    this.title = data.title;
    this.alertHeading = data.alertHeading;
    this.alertContent = data.alertContent;
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  close() {
    this.dialogRef.close(false);
  }
}
