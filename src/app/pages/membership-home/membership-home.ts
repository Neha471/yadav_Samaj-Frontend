import { TeamService } from './../../core/TeamMemberService ';
import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import html2canvas from 'html2canvas';
import { MembershipUser, MembershipUserService } from '../../core/membership-user';
import { ProfileComponent } from "./profile/profile";
import { DonationComponent } from "../donation/donation";


@Component({
  selector: 'app-membership-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ProfileComponent, DonationComponent],
  templateUrl: './membership-home.html',
  styleUrls: ['./membership-home.scss']
})
export class MembershipHomeComponent implements OnInit, AfterViewInit {

  @ViewChild('bannerSlider') bannerSlider!: ElementRef<HTMLDivElement>;
  @ViewChild('membershipCard') membershipCard!: ElementRef<HTMLDivElement>;

activeTab: 'dashboard' | 'team' | 'announcements' | 'events' | 'activities' | 'profile' | 'photos' | 'donation' = 'dashboard';




  announcements: any[] = [];
  events: any[] = [];
  activities: any[] = [];
  banners: any[] = [];
  member: any = null;
photos: any[] = [];
teamMembers: any[] = [];
modalImages: { imageUrl: string, title?: string, description?: string }[] = [];

  currentIndex: number = 0;
  showModal: boolean = false;


  referralLink: string = '';
  imageBaseUrl = 'https://yaduvanshisangathan.cloud';

  // For profile update
  user: MembershipUser = {} as any;

  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer, private userService: MembershipUserService ,
     private teamService: TeamService ) {}

  ngOnInit(): void {
    this.loadMember();
    this.loadAll();
     this.loadTeamMembers();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.bannerSlider) {
        this.initializeBannerSlider(this.bannerSlider.nativeElement);
      }
    }, 300);
  }

  // ---------------- Member ----------------
  loadMember(): void {
    const phone = localStorage.getItem('loggedInPhone');
    if (!phone) return;

    this.http.get<any>(`https://yaduvanshisangathan.cloud/api/membership/details/${phone}`).subscribe({
      next: data => {
        this.member = data;
        this.referralLink = `${window.location.origin}/register?ref=${data.referralCode || ''}`;
        this.loadProfileForm(data);
      },
      error: err => console.error('Failed to load member', err)
    });
  }

 loadProfileForm(memberData: any) {
  this.user = { ...memberData }; // assign to user
  this.imagePreview = memberData.profilePhoto
    ? `${this.imageBaseUrl}${memberData.profilePhoto}`
    : `${this.imageBaseUrl}/uploads/membership/default.png`;
}


  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => (this.imagePreview = reader.result);
      reader.readAsDataURL(this.selectedFile);
    }
  }
updateProfile() {
  if (!this.user.id) return alert('User ID missing.');

  const formData = new FormData();
  formData.append('user', new Blob([JSON.stringify(this.user)], { type: 'application/json' }));
  if (this.selectedFile) formData.append('photo', this.selectedFile);

  this.userService.updateMembership(this.user.id, formData).subscribe({
    next: () => alert('Profile updated successfully!'),
    error: err => alert('Failed to update profile: ' + err.message)
  });
}



  sanitizeImageUrl(filePath: string): SafeUrl {
    if (!filePath) return 'default-profile.png';
    const url = filePath.startsWith('/') ? `${this.imageBaseUrl}${filePath}` : `${this.imageBaseUrl}/${filePath}`;
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  // ---------------- Load banners and sections ----------------
  loadAll(): void {
    this.loadAnnouncements();
    this.loadEvents();
    this.loadActivities();
    this.loadBanners();
    this.loadPhotos();
  }

  loadAnnouncements(): void {
    this.http.get<any[]>(`https://yaduvanshisangathan.cloud/api/home-sections/type/MEMBERSHIP_ANNOUNCEMENT`).subscribe({
      next: data => this.announcements = data,
      error: err => console.error(err)
    });
  }
  loadPhotos(): void {
  this.http.get<any[]>(`https://yaduvanshisangathan.cloud/api/home-sections/type/MEMBERSHIP_PHOTO`).subscribe({
    next: data => this.photos = data,
    error: err => console.error('Failed to load photos', err)
  });
}

loadTeamMembers() {
  this.teamService.getAll().subscribe({
    next: (data) => {
      this.teamMembers = data;
    },
    error: (err) => console.error('Failed to load team members', err)
  });
}



  loadEvents(): void {
    this.http.get<any[]>(`https://yaduvanshisangathan.cloud/api/home-sections/type/MEMBERSHIP_EVENT`).subscribe({
      next: data => this.events = data,
      error: err => console.error(err)
    });
  }

  loadActivities(): void {
    this.http.get<any[]>(`https://yaduvanshisangathan.cloud/api/home-sections/type/MEMBERSHIP_ACTIVITY`).subscribe({
      next: data => this.activities = data,
      error: err => console.error(err)
    });
  }

  loadBanners(): void {
    this.http.get<any[]>(`https://yaduvanshisangathan.cloud/api/home-sections/type/MEMBERSHIP_BANNER`).subscribe({
      next: data => this.banners = data,
      error: err => console.error(err)
    });
  }

  initializeBannerSlider(container: HTMLDivElement): void {}

  setTab(tab: 'dashboard' | 'announcements' | 'events' |'team'|'donation'| 'activities' | 'profile' | 'photos') {
  this.activeTab = tab;
}


  // ---------------- Modal ----------------

openModal(item: any, array: any[]) {
  this.modalImages = array.map(i => ({
    imageUrl: i.imageUrl,
    title: i.title,
    description: i.description
  }));
  this.currentIndex = array.indexOf(item);
  this.showModal = true;
}

  closeModal() { this.showModal = false; }
  nextImage() { this.currentIndex = (this.currentIndex + 1) % this.modalImages.length; }
  prevImage() { this.currentIndex = (this.currentIndex - 1 + this.modalImages.length) % this.modalImages.length; }

  // ---------------- Referral ----------------
  shareReferral() {
    if (navigator.share) {
      navigator.share({
        title: 'Join Yadav Samaj',
        text: `Use my referral code: ${this.member?.referralCode}`,
        url: this.referralLink
      }).catch(err => console.error(err));
    } else {
      alert(`Copy this link: ${this.referralLink}`);
    }
  }

  // ---------------- Download / Share Membership Card ----------------
downloadCard() {
  if (!this.membershipCard) return;

  const cardElement = this.membershipCard.nativeElement;

  html2canvas(cardElement, {
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    scale: 2, // High-quality HD output
    logging: false
  })
  .then(canvas => {

    // Convert to image
    const image = canvas.toDataURL('image/png');

    // Create download link
    const link = document.createElement('a');
    link.href = image;
    link.download = `${this.member?.fullName || 'membership'}-card.png`;

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  })
  .catch(err => console.error('Download failed:', err));
}

shareCard() {
  if (!navigator.share) { alert('Your browser does not support sharing.'); return; }
  if (!this.membershipCard) return;

  html2canvas(this.membershipCard.nativeElement, { useCORS: true, allowTaint: true }).then(canvas => {
    canvas.toBlob(blob => {
      if (!blob) return;
      const file = new File([blob], 'membership-card.png', { type: blob.type });
      navigator.share({ title: 'My Membership Card', text: 'Check out my Yadav Samaj membership card!', files: [file] })
        .catch(err => console.error(err));
    });
  });
}

}
