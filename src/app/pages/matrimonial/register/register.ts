import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatrimonialUser, MatrimonialUserService } from '../../../core/matrimonial-user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-matrimonial-register',
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class MatrimonialRegisterComponent implements OnDestroy {
  user: MatrimonialUser = {} as MatrimonialUser;
  photoFile?: File;
  photoPreview?: string;
  loading = false;

  genders = ['Male', 'Female', 'Other'];
  maritalStatuses = ['Single', 'Married', 'Divorced'];
  educations = ['High School', 'Graduate', 'Postgraduate'];
  motherTongues = ['Hindi', 'English', 'Gujarati'];
  diets = ['Vegetarian', 'Non-Vegetarian', 'Vegan'];
  lifestyles = ['Active', 'Moderate', 'Sedentary'];

membershipPlans = [
  { label: '1 Year', value: '1_YEAR', amount: 99 },
  { label: 'Lifetime', value: 'LIFETIME', amount: 499 },
];


  constructor(private service: MatrimonialUserService, private router: Router) {}

getSelectedPlanAmount(): number {
  switch (this.user.membershipPlan) {
    case '1_YEAR': return 99;
    case 'LIFETIME': return 499;
    default: return 0;
  }
}

  onFileSelected(event: any) {
    if (this.photoPreview) URL.revokeObjectURL(this.photoPreview);
    this.photoFile = event.target.files[0];
    if (this.photoFile) this.photoPreview = URL.createObjectURL(this.photoFile);
  }

  isAdult(dob: string | Date): boolean {
    if (!dob) return false;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age >= 18;
  }

  async register() {
    this.loading = true;

    try {
      // ---------------- Validation ----------------
      if (!this.user.isYadav) {
        alert('You must confirm you are Yadav to register. Payment is non-refundable if false.');
        this.loading = false;
        return;
      }

      if (!this.isAdult(this.user.dob)) {
        alert('You must be at least 18 years old to register.');
        this.loading = false;
        return;
      }

      if (!/^\d{10}$/.test(this.user.phone)) {
        alert('Phone number must be exactly 10 digits.');
        this.loading = false;
        return;
      }

      if (!this.user.membershipPlan) {
        alert('Please select a membership plan (1-Year or Lifetime).');
        this.loading = false;
        return;
      }

      this.user.membershipAmount = this.getSelectedPlanAmount();
      if (this.user.membershipAmount === 0) {
        alert('Invalid membership plan selected.');
        this.loading = false;
        return;
      }

      // Format DOB as ISO string (yyyy-MM-dd)
      if (this.user.dob) {
        this.user.dob = new Date(this.user.dob).toISOString().split('T')[0];
      }

      // ---------------- Register ----------------
      const savedUser = await this.service.register(this.user, this.photoFile);

      // ---------------- Redirect to payment ----------------
      this.router.navigate(['/payment'], {
        queryParams: { phone: savedUser.phone, userType: 'MATRIMONIAL' }
      });

    } catch (err: any) {
      alert(err.error?.message || 'Registration failed');
    } finally {
      this.loading = false;
    }
  }

  ngOnDestroy() {
    if (this.photoPreview) URL.revokeObjectURL(this.photoPreview);
  }
}
