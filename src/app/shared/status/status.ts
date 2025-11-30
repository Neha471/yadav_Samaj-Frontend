import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-status',
  templateUrl: './status.html',
  styleUrls: ['./status.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class StatusComponent {
  phone: string = '';
  statusData: any = null;
  message: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  // ✅ Check status for matrimonial users only
  checkStatus() {
    this.message = '';
    this.statusData = null;

    const trimmedPhone = this.phone?.trim();
    if (!trimmedPhone) {
      this.message = 'Please enter a phone number';
      return;
    }

    // Matrimonial status API
    const url = `http://yaduvanshisangathan.cloud/api/matrimonial/status/${trimmedPhone}`;

    this.http.get<any>(url).subscribe({
      next: (res) => {
        if (!res.found) {
          this.message = 'User not found in database.';
          return;
        }

        this.statusData = res;

        // Display appropriate message
        if (res.approved === true) {
          this.message = '✅ Your registration has been approved by admin.';
        } else if (res.approved === false) {
          this.message = '❌ Your registration has been rejected by admin.';
        } else {
          this.message = '⏳ Your registration is pending admin approval.';
        }
      },
      error: (err) => {
        console.error('Status fetch error:', err);
        if (err.status === 404) this.message = 'User not found.';
        else if (err.status === 500) this.message = 'Server error.';
        else this.message = err.error?.message || 'Unexpected error.';
      }
    });
  }

  // ✅ Go to payment (only for matrimonial, if needed)
  goToPayment() {
    const trimmedPhone = this.phone?.trim();
    if (!trimmedPhone) {
      alert('Please enter your phone number first.');
      return;
    }

    if (!this.statusData) {
      alert('Please check your status first.');
      return;
    }

    if (this.statusData.approved !== true) {
      alert('You can only proceed to payment after admin approval.');
      return;
    }

    if (this.statusData.paymentDone === true) {
      alert('Payment already completed. You can login now.');
      return;
    }

    this.router.navigate(['/payment'], {
      queryParams: { phone: trimmedPhone, type: 'matrimonial' }
    });
  }
}
