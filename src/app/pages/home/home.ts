import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { HomeSection, HappyStory, MatrimonialUser } from '../../core/models';
import { HomeSectionService } from '../../core/home-section';
import { HappyStoryService } from '../../core/happy-stories';

import { Banner, BannerService } from '../../core/banner.service';
import { TeamMember } from '../../models/TeamMember';
import { MatrimonialUserService } from '../../core/matrimonial-user';
import { TeamService } from '../../core/TeamMemberService ';




@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  sections: HomeSection[] = [];
  stories: HappyStory[] = [];
  activeMembers: MatrimonialUser[] = [];
  banners: Banner[] = [];
  imageBaseUrl = 'https://yaduvanshisangathan.cloud/';
  currentIndex = 0;
  slideInterval: any;
  imageHeights: number[] = [];
  activeTeam: TeamMember[] = [];
  backendUrl = 'https://yaduvanshisangathan.cloud';

  @ViewChild('storiesContainer') storiesContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('membersContainer') membersContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('teamContainer') teamContainer!: ElementRef<HTMLDivElement>;
  scrollAmount = 300;

  constructor(
    private router: Router,
    private sectionService: HomeSectionService,
    private storyService: HappyStoryService,
    private userService: MatrimonialUserService,
    private bannerService: BannerService,
    private teamService: TeamService
  ) {}

  ngOnInit(): void {
    this.loadSections();
    this.loadStories();
    this.loadActiveMembers();
    this.loadBanners();
    this.startAutoSlide();
     this.loadTeamMembers();
  }

  /** Load Home Sections (Banners + Cards) */
  async loadSections() {
    try {
      const sectionsFromApi = await firstValueFrom(this.sectionService.getSections());
      this.sections = (sectionsFromApi ?? []).map((s: any) => ({
        id: s.id ?? 0,
        title: s.title ?? '',
        description: s.description ?? '',
        route: s.route ?? '',
        type: s.type ?? 'BANNER',
        active: s.active ?? true,
        imageUrl: s.imageUrl
          ? s.imageUrl.startsWith('http')
            ? s.imageUrl
            : this.imageBaseUrl + s.imageUrl.replace(/^\/+/, '')
          : '',
      }));
    } catch (err) {
      console.error('Failed to load sections', err);
      this.sections = [];
    }
  }
  onImageLoad(event: Event, index: number) {
  const img = event.target as HTMLImageElement;
  this.imageHeights[index] = img.naturalHeight / img.naturalWidth * img.width;
}

getBackendUrl(filePath: string | undefined): string {
  if (!filePath) return 'assets/img1.jpeg';

  // If already a full URL, return as is
  if (filePath.startsWith('http')) return filePath;

  // Remove leading slash if any and prepend backend URL
  const path = filePath.replace(/^\/+/, '');
  return `${this.backendUrl}/${path}`;
}

async loadTeamMembers() {
 this.teamService.getAll().subscribe({
  next: (data: TeamMember[]) => {
    this.activeTeam = data.map((member: TeamMember) => ({
      ...member
      // map only the fields you need, e.g. name, photo, role
    }));
  },
  error: (err: any) => console.error(err)
});
}

  /** Load Happy Stories */
  async loadStories() {
    try {
      const storiesFromApi = await firstValueFrom(this.storyService.getStories());
      this.stories = (storiesFromApi ?? []).map((s: any) => ({
        ...s,
        photoUrl: s.photoUrl
          ? s.photoUrl.startsWith('http')
            ? s.photoUrl
            : this.imageBaseUrl + s.photoUrl.replace(/^\/+/, '')
          : 'default-story.jpg',
      }));
    } catch (err) {
      console.error('Failed to load stories', err);
      this.stories = [];
    }
  }

  /** Load Active Members */
  /** Load Active Members */
async loadActiveMembers() {
  try {
    // Fetch users from service
    const usersFromService = await this.userService.getAllUsers();

    // Map to the correct type and fix age
    const users: MatrimonialUser[] = usersFromService.map(u => ({
      ...u,
      age: u.age ?? (u.dob ? this.calculateAge(u.dob) : 0),
      photoFileName: u.photoFileName
        ? u.photoFileName.startsWith('http')
          ? u.photoFileName
          : this.imageBaseUrl + u.photoFileName.replace(/^\/+/, '')
        : 'img1.jpeg',
    })) as MatrimonialUser[];

    // Filter approved members
    this.activeMembers = users.filter(u => u.approved);

  } catch (err) {
    console.error('❌ Failed to load members', err);
    this.activeMembers = [];
  }
}


  /** Load Banners */
loadBanners(): void {
  this.bannerService.getBanners().subscribe({
    next: data => this.banners = data,
    error: err => console.error('Error loading banners:', err)
  });
}


  /** Calculate Age from DOB */
  calculateAge(dob: string): number {
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  }

  /** Banner Sections */
  get bannerSections(): HomeSection[] {
    return this.sections.filter((s) => s.type === 'BANNER');
  }

  /** Card Sections */
  get cardSections(): HomeSection[] {
    return this.sections.filter((s) => ['CARD', 'MATRIMONIAL', 'MEMBERSHIP'].includes((s.type ?? '').toUpperCase()));
  }

  /** Navigate to Card */
  goToCard(section: HomeSection) {
    const type = section.type?.trim().toUpperCase() ?? '';
    const route = section.route?.trim() ?? '';
    const title = section.title?.trim().toUpperCase() ?? '';

    if (type === 'MATRIMONIAL' || title === 'MATRIMONIAL') this.router.navigate(['/matrimonial-welcome']);
    else if (type === 'MEMBERSHIP' || title === 'MEMBERSHIP') this.router.navigate(['/membership-login']);
    else if (route) this.router.navigate([route]);
    else console.warn('No route defined for card:', section);
  }

  /** Scroll Controls */
scrollLeft(container: 'stories' | 'members' | 'team') {
  const el = container === 'stories' ? this.storiesContainer.nativeElement :
             container === 'members' ? this.membersContainer.nativeElement :
             this.teamContainer.nativeElement;
  el.scrollBy({ left: -this.scrollAmount, behavior: 'smooth' });
}

scrollRight(container: 'stories' | 'members' | 'team') {
  const el = container === 'stories' ? this.storiesContainer.nativeElement :
             container === 'members' ? this.membersContainer.nativeElement :
             this.teamContainer.nativeElement;
  el.scrollBy({ left: this.scrollAmount, behavior: 'smooth' });
}


  viewDetails(member: MatrimonialUser) {
    console.log('Viewing member:', member);
  }

  /** Auto Slide */
startAutoSlide() {
  this.slideInterval = setInterval(() => {
    this.nextSlide();
  }, 5000);
}

 nextSlide() {
  if (this.bannerSections.length === 0) return;
  this.currentIndex = (this.currentIndex + 1) % this.bannerSections.length;
}

prevSlide() {
  if (this.bannerSections.length === 0) return;
  this.currentIndex = (this.currentIndex - 1 + this.bannerSections.length) % this.bannerSections.length;
}

goToSlide(index: number) {
  if (this.bannerSections.length === 0) return;
  this.currentIndex = index;
}

  ngOnDestroy() {
    clearInterval(this.slideInterval);
  }
}
