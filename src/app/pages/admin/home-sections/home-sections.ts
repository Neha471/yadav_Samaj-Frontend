import { Component, OnInit } from '@angular/core';
import { HomeSectionService } from '../../../core/home-section';
import { FormBuilder, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HomeSection } from '../../../core/models';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

interface FilePreview {
  file: File;
  preview: string;
}

@Component({
  selector: 'app-home-sections-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home-sections.html',
  styleUrls: ['./home-sections.scss']
})
export class HomeSectionsComponent implements OnInit {
  sections: HomeSection[] = [];
  imageBaseUrl = 'http://yaduvanshisangathan.cloud';

  // For adding multiple banners
  multipleFiles: FilePreview[] = [];
  newBannerTitle = '';
  newBannerDescription = '';

     // Cards
  cards: HomeSection[] = [];
  newCardFile?: File;
  newCardFilePreview: string = '';
  newCardTitle = '';
  newCardDescription = '';

  constructor(private service: HomeSectionService, private http: HttpClient, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loadSections();
     this.loadCards();
  }

  loadSections() {
    this.service.getSections().subscribe({
      next: (data) => {
        this.sections = data.map(s => ({
          ...s,
          imageUrl: s.imageUrl ? this.getImageUrl(s.imageUrl) : '',
          imageUrls: s.imageUrls ? s.imageUrls.map(img => this.getImageUrl(img)) : []
        }));
      },
      error: (err) => console.error(err)
    });
  }

  getImageUrl(path: string): string {
    return path.startsWith('http') ? path : `${this.imageBaseUrl}${path}`;
  }

  // Single file for updating existing banner
  onFileChange(event: any, section: HomeSection) {
    const file = event.target.files[0];
    if (file) (section as any).newImage = file;
  }

  // Multiple file upload for new banners
  onMultipleFilesChange(event: any) {
    const files: FileList = event.target.files;
    this.multipleFiles = [];
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.multipleFiles.push({ file, preview: e.target.result });
      };
      reader.readAsDataURL(file);
    });
  }

  removeFile(f: FilePreview) {
    this.multipleFiles = this.multipleFiles.filter(x => x !== f);
  }


addMultipleBanners() {
  if (!this.multipleFiles.length) {
    Swal.fire({
      icon: 'warning',
      title: 'No Images Selected',
      text: 'Please select at least one image.',
    });
    return;
  }

  // Check if title is empty
  if (this.newBannerTitle.trim() === '') {
    Swal.fire({
      icon: 'warning',
      title: 'Title Required',
      text: 'Please enter a title for the banner.',
    });
    return;
  }

  this.multipleFiles.forEach(f => {
    const formData = new FormData();

    // type is required for backend
    formData.append('type', 'BANNER');

    // Append title (required now)
    formData.append('title', this.newBannerTitle);

    // Append description only if provided
    if (this.newBannerDescription.trim() !== '') formData.append('description', this.newBannerDescription);

    // Append image
    formData.append('image', f.file);

    this.service.addSection(formData).subscribe({
      next: () => this.loadSections(),
      error: err => console.error(err)
    });
  });

  // Reset form
  this.multipleFiles = [];
  this.newBannerTitle = '';
  this.newBannerDescription = '';

  Swal.fire({
    icon: 'success',
    title: 'Banners Added!',
    text: 'Your banners have been successfully added.',
  });
}

// home-sections.component.ts

updateHomeSection(section: HomeSection) {
  const formData = new FormData();

  // Only add description and file (skip title for banners)
  if (section.description) formData.append('description', section.description);
  if ((section as any).newImage) formData.append('file', (section as any).newImage);
  if (section.route) formData.append('route', section.route);

  this.service.updateSection(section.id, formData).subscribe({
    next: (res) => {
      alert('Section updated successfully!');
      this.loadSections();
      delete (section as any).newImage;
    },
    error: (err) => {
      console.error(err);
      alert('Failed to update section. Check console for details.');
    }
  });
}



  deleteSection(id: number) {
    if (confirm('Delete this section?')) {
      this.service.deleteSection(id).subscribe(() => this.loadSections());
    }
  }

  // --- Cards Section ---
  loadCards() {
    this.service.getSections().subscribe({
      next: data => {
        this.cards = data
          .filter(s => s.type === 'CARD')
          .map(c => ({
            ...c,
            imageUrl: c.imageUrl ? this.getImageUrl(c.imageUrl) : ''
          }));
      },
      error: err => console.error(err)
    });
  }

  onCardFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.newCardFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newCardFilePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeCardFile() {
    this.newCardFile = undefined;
    this.newCardFilePreview = '';
  }

  addCard() {
    if (!this.newCardFile || !this.newCardTitle.trim()) {
      Swal.fire('Warning', 'Please select an image and enter a title', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('type', 'CARD');
    formData.append('title', this.newCardTitle);
    if (this.newCardDescription.trim()) formData.append('description', this.newCardDescription);
    formData.append('image', this.newCardFile);

    this.service.addSection(formData).subscribe({
      next: () => {
        this.loadCards();
        this.newCardFile = undefined;
        this.newCardFilePreview = '';
        this.newCardTitle = '';
        this.newCardDescription = '';
        Swal.fire('Success', 'Card added!', 'success');
      },
      error: err => console.error(err)
    });
  }

  onCardUpdateFileChange(event: any, card: HomeSection) {
    const file = event.target.files[0];
    if (file) (card as any).newImage = file;
  }

  updateCard(card: HomeSection) {
    const formData = new FormData();
    if (card.title) formData.append('title', card.title);
    if (card.description) formData.append('description', card.description);
    if ((card as any).newImage) formData.append('file', (card as any).newImage);

    this.service.updateSection(card.id, formData).subscribe({
      next: () => {
        this.loadCards();
        delete (card as any).newImage;
        Swal.fire('Success', 'Card updated!', 'success');
      },
      error: err => Swal.fire('Error', 'Failed to update card', 'error')
    });
  }

  deleteCard(id: number) {
    if (confirm('Delete this card?')) {
      this.service.deleteSection(id).subscribe(() => this.loadCards());
    }
  }
}
