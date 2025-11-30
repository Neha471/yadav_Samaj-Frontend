import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatrimonialUser, MatrimonialUserService } from '../../../core/matrimonial-user';

import { HomeSectionService } from '../../../core/home-section';
import { HappyStoryService } from '../../../core/happy-stories';
import { HomeSection } from '../../../core/models';

@Component({
  selector: 'app-matrimonial-welcome',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './welcome.html',
  styleUrls: ['./welcome.scss']
})
export class MatrimonialWelcomeComponent implements OnInit {

  featuredProfiles: MatrimonialUser[] = [];
  happyStories: any[] = [];
  faqs: any[] = [];
  communitySection: any = null;
  selectedProfile: MatrimonialUser | null = null;
 leadershipTeam: HomeSection[] = [];
 leadershipSections: any[] = [];

  constructor(
    private userService: MatrimonialUserService,
    private storyService: HappyStoryService,
    private homeSectionService: HomeSectionService
  ) { }

  ngOnInit(): void {
    this.loadFeaturedProfiles();
    this.loadHappyStories();
    this.loadFaqs();
    this.loadLeadership();

  }

  selectProfile(profile: MatrimonialUser) {
    this.selectedProfile = profile;
  }

  closeProfileModal() {
    this.selectedProfile = null;
  }

  async loadFeaturedProfiles() {
    try {
      const users = await this.userService.getAllUsers();
      this.featuredProfiles = users.filter(u => u.approved).slice(0, 5);
    } catch (error) {
      console.error('Error fetching featured profiles', error);
    }
  }
fullImageUrl: string | null = null;

openFullImage(imageUrl: string) {
  this.fullImageUrl = imageUrl;
}

closeFullImage() {
  this.fullImageUrl = null;
}

async loadHappyStories() {
  try {
    const stories = await this.storyService.getStories().toPromise();
    this.happyStories = (stories ?? [])
      .filter(story => story.approved)
      .slice(0, 4);
  } catch (error) {
    console.error('Error fetching happy stories', error);
    this.happyStories = [];
  }
}

  async loadFaqs() {
    try {
      const res = await fetch('http://yaduvanshisangathan.cloud/api/home-sections/active/type/FAQ');
      if (!res.ok) throw new Error('FAQ endpoint not found');
      const data = await res.json();
      this.faqs = Array.isArray(data) ? data : [];
    } catch (error) {
      console.warn('FAQ fetch failed', error);
      this.faqs = [];
    }
  }

  async loadCommunitySection() {
    try {
      const res = await fetch('http://yaduvanshisangathan.cloud/api/home-sections/active/type/SAMAJ_BANNER');
      if (!res.ok) throw new Error('Community section not found');
      const data = await res.json();
      this.communitySection = Array.isArray(data) && data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error('Error fetching community section', error);
      this.communitySection = null;
    }
  }



loadLeadership() {
  this.homeSectionService.getLeadership().subscribe({
    next: (data) => {
      console.log('Leadership data:', data);
      this.leadershipSections = data;
    },
    error: (err) => {
      console.error('Failed to load leadership data:', err);
    }
  });
}

  getLeaderPhotoUrl(leader: HomeSection) {
    return leader.imageUrl ? `http://yaduvanshisangathan.cloud${leader.imageUrl}` : 'default-profile.jpg';
  }

  getPhotoUrl(user: MatrimonialUser) {
    return user.photoFileName
      ? `http://yaduvanshisangathan.cloud${user.photoFileName}`
      : 'assets/images/default-user.png';
  }

}
