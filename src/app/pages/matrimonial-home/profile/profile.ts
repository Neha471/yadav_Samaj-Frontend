import { Component, OnInit } from '@angular/core';
import { MatrimonialUserService, MatrimonialUser } from '../../../core/matrimonial-user';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss'],
  imports:[FormsModule, CommonModule]
})
export class ProfileComponent implements OnInit {
  phone: string = ''; // user enters this to fetch profile
  user: MatrimonialUser = {} as MatrimonialUser;
  photoFile?: File;
  photoPreview?: string;
  loading: boolean = false;

  genders = ['Male', 'Female', 'Other'];
  maritalStatuses = ['Single', 'Married', 'Divorced', 'Widowed'];
  educations = ['High School', 'Graduate', 'Postgraduate'];
  motherTongues = ['Hindi', 'English', 'Bengali', 'Tamil'];
  religions = ['Hindu', 'Muslim', 'Christian', 'Sikh'];
  diets = ['Vegetarian', 'Non-Vegetarian', 'Vegan'];
  lifestyles = ['Active', 'Moderate', 'Sedentary'];
  membershipPlans = [
    { value: '1_MONTH', label: '1 Month' },

    { value: 'LIFETIME', label: 'Lifetime' }
  ];

  constructor(private service: MatrimonialUserService) {}

  ngOnInit() {}

  // Load existing details using phone
  async loadUserDetails() {
    if (!this.phone) {
      alert('Please enter your phone number');
      return;
    }
    this.loading = true;
    try {
      this.user = await this.service.getUserByPhone(this.phone);

      // Preview photo
      if (this.user.photoPath) {
        this.photoPreview = `http://yaduvanshisangathan.cloud/uploads/${this.user.photoPath}`;
      }
    } catch (err) {
      console.error('Error loading profile', err);
      alert('User not found');
      this.user = {} as MatrimonialUser;
      this.photoPreview = undefined;
    } finally {
      this.loading = false;
    }
  }

  // Handle photo file change
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.photoFile = file;
      const reader = new FileReader();
      reader.onload = e => (this.photoPreview = e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }

  // Update profile
async updateProfile() {
  if (!this.user.id) {
    alert('Load user profile first');
    return;
  }

  this.loading = true;
  try {
    await this.service.updateUser(this.user.id, this.user, this.photoFile);
    alert('Profile updated successfully');
  } catch (err) {
    console.error('Error updating profile', err);
    alert('Failed to update profile');
  } finally {
    this.loading = false;
  }
}

}
