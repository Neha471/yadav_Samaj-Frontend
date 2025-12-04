import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.html',
  styleUrls: ['./admin-login.scss'],
  imports:[FormsModule, CommonModule]
})
export class AdminLoginComponent {
  emailOrMobile = '';
  otp = '';
  step = 1; // 1: enter email/mobile, 2: enter OTP
  message = '';

  constructor(private http: HttpClient, private router: Router) {}

  sendOtp() {
    this.http.post('https://yaduvanshisangathan.cloud/api/admin/send-otp', { emailOrMobile: this.emailOrMobile })
      .subscribe({
        next: (res: any) => {
          this.message = res.message;
          this.step = 2;
        },
        error: (err) => {
          this.message = err.error.message || 'Failed to send OTP';
        }
      });
  }

  verifyOtp() {
    this.http.post('https://yaduvanshisangathan.cloud/api/admin/verify-otp', {
      emailOrMobile: this.emailOrMobile,
      otp: this.otp
    }).subscribe({
      next: (res: any) => {
        this.message = res.message;
        localStorage.setItem('adminLogin', this.emailOrMobile);
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        this.message = err.error.message || 'Invalid OTP';
      }
    });
  }
}
