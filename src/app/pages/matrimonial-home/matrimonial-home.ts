import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatrimonialUser, MatrimonialUserService } from '../../core/matrimonial-user';
import { UserDetailComponent } from '../matrimonial/user-detail/user-detail';
import { PremiumPlansComponent } from '../matrimonial/premium-plans/premium-plans';
import { HappyStoryComponent } from '../matrimonial/happy-stories/happy-stories';

import { HomeSection } from '../../core/models';
import { HomeSectionService } from '../../core/home-section';
import { ProfileComponent } from './profile/profile';

@Component({
  selector: 'app-matrimonial-home',
  standalone: true,
  imports: [CommonModule, MatDialogModule, HappyStoryComponent,  FormsModule,ProfileComponent],
  templateUrl: './matrimonial-home.html',
  styleUrls: ['./matrimonial-home.scss'],
})
export class MatrimonialHomeComponent implements OnInit {

  users: MatrimonialUser[] = [];
  banners: HomeSection[] = [];
  ads: HomeSection[] = [];
selectedUser?: any;
fullImageUrl?: string;
  imageBaseUrl = 'https://yaduvanshisangathan.cloud';
activeTab: 'home' | 'active' | 'premium' | 'stories' | 'profile' = 'home';

  constructor(
    private userService: MatrimonialUserService,
    private homeSectionService: HomeSectionService,
    private dialog: MatDialog,
    public router: Router
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.loadMatrimonialSections();
  }

  /** ✅ Load active matrimonial users */
  async loadUsers() {
    try {
      const data = await this.userService.getAllUsers();
      console.log('✅ Loaded users:', data);

      this.users = data
        .filter(u => u.approved)
        .map(u => ({
          ...u,
          age: u.dob ? this.calculateAge(u.dob) : undefined
        }));
    } catch (err) {
      console.error('❌ Failed to fetch users', err);
    }
  }

  /** ✅ Load banners and ads */
  loadMatrimonialSections() {
    this.homeSectionService.getByType('MATRIMONIAL_BANNER').subscribe({
      next: (banners) => {
        console.log('✅ Loaded banners:', banners);
        this.banners = banners;
      },
      error: (err) => console.error('❌ Failed to load matrimonial banners', err)
    });

    this.homeSectionService.getByType('MATRIMONIAL_AD').subscribe({
      next: (ads) => {
        console.log('✅ Loaded ads:', ads);
        this.ads = ads;
      },
      error: (err) => console.error('❌ Failed to load matrimonial ads', err)
    });
  }

  /** ✅ Calculate age */
  calculateAge(dob: string): number {
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  }

  /** ✅ View user detail */
  viewDetails(user: MatrimonialUser) {
    this.dialog.open(UserDetailComponent, { data: user });
  }

  /** ✅ Switch tab */
  setTab(tab: 'home' | 'active' | 'premium' | 'stories' | 'profile') {
  this.activeTab = tab;

  // optional routing if you want to navigate to a dedicated route:
  if (tab === 'premium') {
    this.router.navigate(['/premium']);
  }
}
openUserModal(user: any) {
  this.selectedUser = user;
}

closeUserModal() {
  this.selectedUser = undefined;
}
openFullImage(url: string) {
  this.fullImageUrl = url;
}

// Close full image overlay
closeFullImage() {
  this.fullImageUrl = undefined;
}
}
