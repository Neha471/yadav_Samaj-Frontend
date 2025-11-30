import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommunitySection } from '../../../core/models';
import { AdminService } from '../../../core/admin';


@Component({
  selector: 'app-admin-community',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './community.html',
  styleUrls: ['./community.scss']
})
export class AdminCommunityComponent implements OnInit {

  sections: CommunitySection[] = [];
  selectedSection: CommunitySection | null = null;
  newImageFile: File | null = null;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadSections();
  }

async loadSections() {
  try {
    const sectionsFromBackend = await this.adminService.getCommunitySections();
    this.sections = sectionsFromBackend.map(s => ({
      id: s.id,
      title: s.title || '',
      description: s.description || '',
      imageUrl: s.imageUrl,
      route: s.route,
      active: s.active
    }));
  } catch (err) {
    console.error('Failed to load community sections', err);
  }
}


  selectSection(section: CommunitySection) {
    this.selectedSection = { ...section }; // clone to avoid two-way binding issues
  }

  onImageChange(event: any) {
    if (event.target.files && event.target.files.length) {
      this.newImageFile = event.target.files[0];
    }
  }

  async saveSection() {
    if (!this.selectedSection) return;

    const formData = new FormData();
    formData.append('title', this.selectedSection.title);
    formData.append('description', this.selectedSection.description || '');
    formData.append('type', 'SAMAJ_AD'); // You can adjust the type
    if (this.newImageFile) formData.append('image', this.newImageFile);

    try {
      if (this.selectedSection.id) {
        await this.adminService.updateCommunity(this.selectedSection.id, formData);
      } else {
        await this.adminService.addCommunity(formData);
      }
      this.selectedSection = null;
      this.newImageFile = null;
      this.loadSections();
    } catch (err) {
      console.error('Failed to save section', err);
    }
  }

  async deleteSection(section: CommunitySection) {
    if (!section.id) return;
    if (!confirm('Are you sure you want to delete this section?')) return;

    try {
      await this.adminService.deleteCommunity(section.id);
      this.loadSections();
    } catch (err) {
      console.error('Failed to delete section', err);
    }
  }

  cancelEdit() {
    this.selectedSection = null;
    this.newImageFile = null;
  }

  getPhotoUrl(section: CommunitySection) {
    return section.imageUrl ? `http://yaduvanshisangathan.cloud${section.imageUrl}` : 'assets/images/default-user.png';
  }
}
