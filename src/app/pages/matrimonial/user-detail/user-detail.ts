// user-detail.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatrimonialUser } from '../../../core/matrimonial-user';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './user-detail.html',
  styleUrls: ['./user-detail.scss']
})
export class UserDetailComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public user: MatrimonialUser,
    public dialogRef: MatDialogRef<UserDetailComponent>
  ) {}

  close() {
    this.dialogRef.close();
  }
}
