import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './help.html',
  styleUrls: ['./help.scss'],
})
export class HelpComponent implements OnInit {
  faqs: any[] = [];

  ngOnInit(): void {
    this.loadFaqs();
  }
async loadFaqs() {
  try {
    const res = await fetch('http://yaduvanshisangathan.cloud/api/home-sections/active/type/FAQ');
    if (!res.ok) throw new Error('FAQ endpoint not found');
    const data = await res.json();
    this.faqs = Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn('Failed to fetch FAQs, using default.');
    this.faqs = [
      { title: 'How to register?', description: 'Click Register and fill details.' },
      { title: 'Is my data secure?', description: 'Yes, all info is secure.' },
    ];
  }
}

}
