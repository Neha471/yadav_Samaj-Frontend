import { Component, OnInit } from '@angular/core';
import { TeamMember } from '../../models/TeamMember';

import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { TeamService } from '../../core/TeamMemberService ';

@Component({
  selector: 'app-team-user',
  templateUrl: './team.html',
  styleUrls: ['./team.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class TeamUserComponent implements OnInit {
  members: TeamMember[] = [];
  imageBaseUrl: string = 'https://yaduvanshisangathan.cloud';

  constructor(private teamService: TeamService, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.teamService.getAll().subscribe({
      next: (data) => this.members = data,
      error: (err) => console.error('Failed to load team members', err)
    });
  }

  getSafeImageUrl(fileName: string): SafeUrl {
    if (!fileName) return 'assets/default-profile.png'; // fallback image
    const url = fileName.startsWith('/') ? `${this.imageBaseUrl}${fileName}` : `${this.imageBaseUrl}/${fileName}`;
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
}
