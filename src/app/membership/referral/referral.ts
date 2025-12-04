import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-referral',
  templateUrl: './referral.html',
  styleUrls: ['./referral.scss']
})
export class ReferralComponent implements OnInit {
  referralCode: string = '';
  referralLink: string = '';
  usedCount: number = 0;
  private apiUrl = 'https://yaduvanshisangathan.cloud/api/membership';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const phone = localStorage.getItem('loggedInPhone');
    if (phone) {
      this.http.get<any>(`${this.apiUrl}/details/${phone}`).subscribe(member => {
        this.referralCode = member.referralCode;
        this.referralLink = `${window.location.origin}/register?ref=${this.referralCode}`;
        this.http.get<number>(`${this.apiUrl}/referral-count/${this.referralCode}`).subscribe(count => this.usedCount = count);
      });
    }
  }

  copyLink() {
    navigator.clipboard.writeText(this.referralLink).then(() => alert('Link copied!'));
  }
}
