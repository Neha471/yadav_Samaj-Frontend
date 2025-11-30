import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HappyStory } from '../../../core/models';
import { HappyStoryService } from '../../../core/happy-stories';



@Component({
  selector: 'app-happy-story',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './happy-stories.html',
  styleUrls: ['./happy-stories.scss']
})
export class HappyStoryComponent implements OnInit {

  stories: HappyStory[] = [];

  constructor(private storyService: HappyStoryService) { }

  ngOnInit(): void {
    this.loadStories();
  }
  

  loadStories() {
    this.storyService.getStories().subscribe(res => {
      this.stories = res;
    }, err => {
      console.error('Failed to load stories', err);
    });
  }

  getPhotoUrl(fileName: string): string {
    return `http://yaduvanshisangathan.cloud/uploads/${fileName}`;
  }
}
