import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { UserService, User } from '../../core/user';
import { MembershipUserService } from '../../core/membership-user';
import { MatrimonialUserService } from '../../core/matrimonial-user';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class NavbarComponent implements OnInit {
  isMenuOpen = false;
  loggedInUser: User | null = null;

  // Status indicators
  status: string = 'PENDING';
  approved: boolean = false;
  paymentDone: boolean = false;
  showStatusTab: boolean = false;

  constructor(
    private userService: UserService,
    private membershipService: MembershipUserService,
    private matrimonialService: MatrimonialUserService,
    private router: Router
  ) {}

  ngOnInit() {
    // Subscribe to logged-in user changes
    this.userService.loggedInUser$.subscribe(user => {
      this.loggedInUser = user;
      this.updateStatus();
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/home']);
  }

  async updateStatus() {
    if (!this.loggedInUser) return;

    // Hide status tab for admin users
    if (this.loggedInUser.role === 'ADMIN') {
      this.showStatusTab = false;
      return;
    }

    this.showStatusTab = true;

    try {
      if (this.loggedInUser.membershipType || this.loggedInUser.membershipPlan) {
        // Membership users: use ID to fetch status
        if (this.loggedInUser.id == null) {
          console.warn('Membership user has no ID');
          return;
        }
        const res = await this.membershipService.getStatus(this.loggedInUser.id);
        this.status = res.status ?? 'PENDING';
        this.approved = res.approved ?? false;
        this.paymentDone = res.paymentDone ?? false;
      } else {
        // Matrimonial users: use phone to fetch status
        if (!this.loggedInUser.phone) {
          console.warn('Matrimonial user has no phone number');
          return;
        }
        const res = await this.matrimonialService.getStatus(this.loggedInUser.phone);
        this.status = res.status ?? 'PENDING';
        this.approved = res.approved ?? false;
        this.paymentDone = res.paymentDone ?? false;
      }
    } catch (err) {
      console.error('Failed to fetch status', err);
      // Fallback status
      this.status = 'ERROR';
      this.approved = false;
      this.paymentDone = false;
    }
  }
}
