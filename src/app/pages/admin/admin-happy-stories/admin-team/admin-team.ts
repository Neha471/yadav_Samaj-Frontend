import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TeamMember } from '../../../../models/TeamMember';
import { TeamService } from '../../../../core/TeamMemberService ';


@Component({
  selector: 'app-team-admin',
  templateUrl: './admin-team.html',
  styleUrls: ['./admin-team.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule]
})
export class TeamAdminComponent implements OnInit {
  members: TeamMember[] = [];
  form: FormGroup;
  selectedPhoto: File | null = null;
  editMode = false;
  editingId: number | null = null;
  editingPhotoUrl: string | null = null;
  backendUrl = 'https://yaduvanshisangathan.cloud';

  constructor(private teamService: TeamService, private fb: FormBuilder) {
    this.form = this.fb.group({
      fullName: [''],
      role: [''],
      email: [''],
      phone: [''],
      about: [''],
      active: [true],
      age: [0],
      city: [''],
      designation: ['']
    });
  }

  ngOnInit() {
    this.loadMembers();
  }

  loadMembers() {
    this.teamService.getAll().subscribe({
      next: data => this.members = data,
      error: err => console.error(err)
    });
  }

  onPhotoSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedPhoto = event.target.files[0];
    } else {
      this.selectedPhoto = null;
    }
  }

  submit() {
    const formData = new FormData();
    formData.append('member', JSON.stringify(this.form.value));

    if (this.selectedPhoto) {
      formData.append('photo', this.selectedPhoto);
    }

    if (this.editMode && this.editingId) {
      this.teamService.update(this.editingId, formData).subscribe({
        next: res => {
          console.log('Member updated:', res);
          this.resetFormAndReload();
        },
        error: err => console.error('Update failed:', err)
      });
    } else {
      this.teamService.add(formData).subscribe({
        next: res => {
          console.log('Member added:', res);
          this.resetFormAndReload();
        },
        error: err => console.error('Add failed:', err)
      });
    }
  }

  resetFormAndReload() {
    this.form.reset({
      fullName: '',
      role: '',
      email: '',
      phone: '',
      about: '',
      city: '',
      designation: '',
      age: 0,
      active: true
    });
    this.selectedPhoto = null;
    this.editMode = false;
    this.editingId = null;
    this.editingPhotoUrl = null;
    this.loadMembers();
  }

  edit(member: TeamMember) {
    this.editMode = true;
    this.editingId = member.id!;
    this.form.patchValue(member);
    this.editingPhotoUrl = member.photoFileName
      ? this.getBackendUrl(member.photoFileName)
      : null;
  }

  getBackendUrl(filePath: string): string {
    if (!filePath) return 'assets/img1.jpeg';
    return `${this.backendUrl}${filePath}`;
  }

  delete(member: TeamMember) {
    if (member.id && confirm('Are you sure you want to delete this member?')) {
      this.teamService.delete(member.id).subscribe(() => this.loadMembers());
    }
  }
}
