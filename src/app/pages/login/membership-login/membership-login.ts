import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

import { MembershipUserService } from '../../../core/membership-user';
import { AuthService } from '../../../core/auth';

@Component({
  selector: 'app-membership-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './membership-login.html',
  styleUrls: ['./membership-login.scss']
})
export class MembershipLoginComponent {
  phoneForm: FormGroup;
  otpForm: FormGroup;
  step: 1 | 2 = 1;

  constructor(
    private fb: FormBuilder,
    private membershipService: MembershipUserService,
    private authService: AuthService,
    private router: Router
  ) {
    this.phoneForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]]
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{4,6}$/)]]
    });
  }

async sendOtp() {
  if (this.phoneForm.invalid) {
    Swal.fire('Invalid Phone', 'Please enter a valid 10-digit number', 'warning');
    return;
  }

  const phone = this.phoneForm.value.phone;

  try {
    await this.membershipService.sendOtp(phone);

    // ✅ Just show success message, no OTP
    Swal.fire('Success', 'OTP sent successfully to your phone.', 'success');

    this.step = 2; // move to OTP input
  } catch (error) {
    Swal.fire('Error', 'Unable to send OTP. Try again later.', 'error');
  }
}

  async verifyOtp() {
    const phone = this.phoneForm.value.phone;
    const otp = this.otpForm.value.otp;

    if (!otp) {
      Swal.fire('Enter OTP', 'Please enter the OTP sent to your phone.', 'warning');
      return;
    }

    try {
      const response = await this.membershipService.verifyOtp(phone, otp);

      if (!response.verified) {
        Swal.fire('Invalid OTP', response.message || 'OTP verification failed', 'error');
        return;
      }

      // Check approval
      if (response.status === 'PENDING') {
        Swal.fire('Pending Approval', 'Admin has not approved your membership yet.', 'info');
        return;
      }

      // Payment check
      if (!response.paymentDone) {
        Swal.fire('Payment Pending', 'Redirecting to payment page...', 'info');
        this.router.navigate(['/payment'], { queryParams: { phone, type: 'membership' } });
        return;
      }

      // Save login info
      localStorage.setItem('loggedInPhone', phone);
      localStorage.setItem('userType', 'membership');

    this.authService.saveUser({
  name: response.fullName ?? phone,
  role: response.role ?? 'USER'
});

      Swal.fire('Login Success', 'Welcome to Yadav Samaj Membership Portal!', 'success');
      this.router.navigate(['/membership-home']);
    } catch (error: any) {
      Swal.fire('Error', error?.message || 'Something went wrong during verification', 'error');
    }
  }
}
