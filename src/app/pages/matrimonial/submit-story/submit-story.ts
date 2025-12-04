import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-submit-story',
  templateUrl: './submit-story.html',
  styleUrls: ['./submit-story.scss'],
  imports:[FormsModule, CommonModule]
})
export class SubmitStoryComponent {

  selectedFile: File | null = null;

  constructor(private http: HttpClient) {}

  // when user picks a file
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // when form is submitted
  submitStory(form: any) {
    if (!form.valid) {
      alert('Please fill in all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('coupleName', form.value.coupleName);
    formData.append('message', form.value.message);

    if (this.selectedFile) {
      formData.append('photo', this.selectedFile);
    }

    this.http.post('https://yaduvanshisangathan.cloud/api/happy-stories/add', formData)
      .subscribe({
        next: (response) => {
          console.log('✅ Story submitted successfully:', response);
          alert('Story submitted successfully!');
          form.reset();
          this.selectedFile = null;
        },
        error: (error) => {
          console.error('❌ Failed to submit story:', error);
          alert('Failed to submit story. Check console for details.');
        }
      });
  }
}
