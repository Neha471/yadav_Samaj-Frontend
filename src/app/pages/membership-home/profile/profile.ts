import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MembershipUser, MembershipUserService } from '../../../core/membership-user';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class ProfileComponent implements OnInit {

  user: MembershipUser = {} as MembershipUser;
  selectedFile?: File; // use undefined instead of null
  imagePreview: string | ArrayBuffer | null = null;
  originalPhone: string = ''; // store original phone

  private baseUrl = 'http://yaduvanshisangathan.cloud';

  constructor(private membershipUserService: MembershipUserService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  /** Load logged-in user details */
  async loadProfile() {
    const phone = localStorage.getItem('loggedInPhone');
    if (!phone) return;

    try {
      const data: any = await this.membershipUserService.getMembershipDetails(phone);
      if (data) {
        this.user = { ...data };  // Autofill form
        this.originalPhone = data.phone; // Save original phone
        this.imagePreview = data.profilePhoto
          ? `${this.baseUrl}${data.profilePhoto}`
          : `${this.baseUrl}/uploads/membership/default.png`;
      }
    } catch (err) {
      console.error('Failed to load profile', err);
    }
  }

  /** Handle image file selection */
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => (this.imagePreview = reader.result);
      reader.readAsDataURL(this.selectedFile);
    }
  }

  /** Update profile */
  updateProfile() {
    if (!this.user.id) {
      alert('User ID missing. Cannot update profile.');
      return;
    }

    // Ensure phone is not null
    if (!this.user.phone) {
      this.user.phone = this.originalPhone;
    }

    const formData = new FormData();
    formData.append(
      'user',
      new Blob([JSON.stringify(this.user)], { type: 'application/json' })
    );
    if (this.selectedFile) {
      formData.append('photo', this.selectedFile);
    }

    this.membershipUserService.updateMembership(this.user.id, formData).subscribe({
      next: () => alert('Profile updated successfully!'),
      error: err => {
        console.error('Update failed', err);
        alert('Failed to update profile: ' + err.error?.message || err.message);
      }
    });
  }

  /** Helper for safe image URL */
  sanitizeImageUrl(filePath: string | undefined): string {
    if (!filePath) return `${this.baseUrl}/uploads/membership/default.png`;
    return filePath.startsWith('/') ? `${this.baseUrl}${filePath}` : `${this.baseUrl}/${filePath}`;
  }
}
