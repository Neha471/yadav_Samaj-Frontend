import { Component, OnInit } from '@angular/core';
import { PaymentDetails, PaymentService } from '../../core/payment';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.html',
  styleUrls: ['./payment.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class PaymentComponent implements OnInit {
  phone = '';
  userType: 'MATRIMONIAL' | 'MEMBERSHIP' = 'MATRIMONIAL';
  paymentDetails?: PaymentDetails;
  errorMessage?: string;
  loading = false;

  constructor(
    private paymentService: PaymentService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['phone']) this.phone = params['phone'];
      if (params['userType']) this.userType = params['userType'];

      if (this.phone) this.loadPaymentDetails();
    });
  }

  loadPaymentDetails(): void {
    if (!this.phone.trim()) {
      Swal.fire('Error', 'Phone number missing', 'warning');
      return;
    }

    this.loading = true;
    this.errorMessage = undefined;

    this.paymentService.getPaymentDetails(this.phone, this.userType).subscribe({
      next: (data) => {
        if (!data) {
          this.errorMessage = 'No pending payment found for this user';
          this.paymentDetails = undefined;
        } else {
          // Only allow 1-Year or Lifetime plans
          if (data.membershipPlan !== '1_YEAR' && data.membershipPlan !== 'LIFETIME') {
            this.errorMessage = 'Invalid membership plan. Only 1-Year or Lifetime plans require payment.';
            this.paymentDetails = undefined;
          } else {
            this.paymentDetails = data;
          }
        }
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error fetching details';
        this.paymentDetails = undefined;
        this.loading = false;
      }
    });
  }

  payNow(): void {
    if (!this.paymentDetails) return;

    // Yadav check
    if (this.userType === 'MATRIMONIAL' && !this.paymentDetails.isYadav) {
      Swal.fire('Notice', 'You are not Yadav. Payment is non-refundable!', 'warning');
      return;
    }

    const fakePaymentId = 'TXN' + Math.floor(Math.random() * 10000000);

    this.paymentService.markPaymentSuccess(this.paymentDetails.phone, fakePaymentId, this.userType)
      .subscribe({
        next: (res: any) => {
          Swal.fire('Payment Successful', res.message, 'success');

          // Redirect after payment
          if (this.userType === 'MATRIMONIAL') {
            this.router.navigate(['/matrimonial-login']);
          } else {
            this.router.navigate(['/membership-login']);
          }

          this.paymentDetails = undefined;
          this.phone = '';
        },
        error: (err: any) => {
          Swal.fire('Payment Failed', err.error?.message || 'Something went wrong', 'error');
        }
      });
  }
}
