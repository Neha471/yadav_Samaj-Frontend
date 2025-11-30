import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-membership-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class MembershipRegisterComponent {
  user: any = { pledgeAccepted: false };
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  api = 'http://yaduvanshisangathan.cloud/api/membership';


  membershipPlans = [
    { label: '1 Year', value: '1_YEAR', amount: 99 },
    { label: 'Lifetime', value: 'LIFETIME', amount: 499 }
  ];

  constructor(private http: HttpClient, private router: Router) {}

  // --- Handle Image Selection ---
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => (this.imagePreview = reader.result);
      reader.readAsDataURL(this.selectedFile);
    }
  }

  // --- Validate 18+ Age ---
  private isAbove18(dob: string): boolean {
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 18;
    }
    return age >= 18;
  }

  // --- Get selected plan amount ---
  getSelectedPlanAmount(): number {
    const plan = this.membershipPlans.find(p => p.value === this.user.membershipPlan);
    return plan ? plan.amount : 0;
  }

  // --- Registration Method ---
  register() {
    // 1️⃣ Basic Validations
    if (!this.user.phone || !/^\d{10}$/.test(this.user.phone)) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!this.user.dob) {
      alert('Please select your date of birth.');
      return;
    }

    if (!this.isAbove18(this.user.dob)) {
      alert('You must be at least 18 years old to register.');
      return;
    }

    if (!this.user.membershipPlan) {
      alert('Please select a membership plan.');
      return;
    }

    // 2️⃣ Assign plan amount
    this.user.membershipAmount = this.getSelectedPlanAmount();

    // 3️⃣ Prepare Form Data
    const formData = new FormData();
    formData.append('user', new Blob([JSON.stringify(this.user)], { type: 'application/json' }));
    if (this.selectedFile) {
      formData.append('photo', this.selectedFile);
    }

    // 4️⃣ Submit Registration
    this.http.post(`${this.api}/register`, formData).subscribe({
      next: (res: any) => {
        alert('Registration successful! Redirecting to payment...');
        this.router.navigate(['/payment'], {
          queryParams: {
            phone: this.user.phone,
            userType: 'MEMBERSHIP'
          }
        });
      },
      error: (err) => {
        alert(err.error?.message || 'Registration failed!');
      }
    });
  }
}
