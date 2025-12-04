import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Donation {
  id?: number;
  name: string;
  amount: number;
  message?: string;
  paymentId?: string;
  orderId?: string;
  paymentMethod?: string;
  paid?: boolean;
}

@Component({
  selector: 'app-donation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './donation.html',
  styleUrls: ['./donation.scss']
})
export class DonationComponent implements OnInit {
  activeTab: 'donate' | 'history' = 'donate';
  donation: Donation = { name: '', amount: 0, message: '' };
  adminDonations: Donation[] = [];

  backendUrl = 'https://yaduvanshisangathan.cloud/api/donations';
  showSuccessAlert = false;
  successMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadAdminDonations();
  }

  // ✅ User Donation Form Submit
  submitDonation() {
    if (!this.donation.name || !this.donation.amount) {
      return alert('Please fill all required fields.');
    }

    // Dummy flow (replace with actual payment integration if needed)
    this.http.post<any>(`${this.backendUrl}/create-dummy-order`, { amount: this.donation.amount })
      .subscribe({
        next: order => {
          const confirmPayload = {
            name: this.donation.name,
            amount: this.donation.amount,
            message: this.donation.message,
            orderId: order.orderId,
            paymentMethod: 'DUMMY',
            paymentId: order.orderId
          };

          this.http.post(`${this.backendUrl}/confirm-dummy`, confirmPayload).subscribe({
            next: () => {
              this.successMessage = 'Donation submitted successfully!';
              this.showSuccessAlert = true;
              setTimeout(() => this.showSuccessAlert = false, 3000);
              this.donation = { name: '', amount: 0, message: '' };
            },
            error: () => alert('Failed to save donation.')
          });
        },
        error: () => alert('Failed to create order.')
      });
  }

  // ✅ Load donations added by Admin (from DB)
loadAdminDonations() {
  this.http.get<Donation[]>(`${this.backendUrl}/admin`).subscribe({
    next: data => this.adminDonations = data,
    error: () => console.error('Failed to load admin donations')
  });
}

}
