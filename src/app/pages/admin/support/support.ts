import { Component, OnInit } from '@angular/core';
import { SupportService } from '../../../core/support';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-support-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './support.html',
  styleUrls: ['./support.scss']
})
export class SupportComponent implements OnInit {
  messages: any[] = [];
  replyText: { [key: number]: string } = {};

  constructor(private supportService: SupportService) {}

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.supportService.getAll().subscribe(data => this.messages = data);
  }

  sendReply(id: number) {
    const text = this.replyText[id];
    if (!text) return alert('Enter a reply first.');

    this.supportService.reply(id, text).subscribe(() => {
      alert('Reply sent successfully!');
      this.replyText[id] = '';
      this.loadMessages();
    });
  }

  deleteMessage(id: number) {
    if (confirm('Are you sure?')) {
      this.supportService.delete(id).subscribe(() => this.loadMessages());
    }
  }
}
