import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { MatrimonialUserService } from '../../../core/matrimonial-user';

@Component({
  selector: 'app-matrimonial-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './matrimonial-login.html',
  styleUrls: ['./matrimonial-login.scss']
})
export class MatrimonialLoginComponent {
  phoneForm: FormGroup;
  otpForm: FormGroup;
  step: 1 | 2 = 1;

  constructor(
    private fb: FormBuilder,
    private matrimonialService: MatrimonialUserService,
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
      Swal.fire('Invalid Phone', 'Enter a valid 10-digit number', 'warning');
      return;
    }

    const phone = this.phoneForm.value.phone;

    try {
      const response: any = await this.matrimonialService.getStatus(phone);

      if (!response || !response.status) {
        Swal.fire('Error', 'User not registered', 'error');
        return;
      }

      // Admin rejection check
      if (response.approvalStatus === 'REJECTED') {
        Swal.fire('Rejected', 'You are rejected by admin.', 'error');
        return;
      }

      // Payment pending check
      if (!response.paymentDone) {
        Swal.fire('Payment Pending', 'Please complete your payment first.', 'warning');
        return;
      }

      await this.matrimonialService.sendOtp(phone);

      Swal.fire('OTP Sent', 'OTP sent successfully to your phone.', 'success');
      this.step = 2;

    } catch (err: any) {
      Swal.fire('Error', err.error?.message || 'Something went wrong', 'error');
    }
  }

  async verifyOtp() {
    const phone = this.phoneForm.value.phone;
    const otp = this.otpForm.value.otp;

    try {
      const response: any = await this.matrimonialService.verifyOtp(phone, otp);

      if (!response.verified) {
        Swal.fire('Login Failed', response.message || 'OTP verification failed', 'error');
        return;
      }

      localStorage.setItem('loggedInPhone', phone);

      if (response.role === 'ADMIN') {
        Swal.fire('Login Success', 'Welcome Admin!', 'success');
        this.router.navigate(['/admin']);
        return;
      }

      Swal.fire('Login Success', 'Welcome!', 'success');
      this.router.navigate(['/matrimonial-home']);

    } catch (err: any) {
      Swal.fire('Error', err.error?.message || 'Something went wrong', 'error');
    }
  }
}
