  import { Component, OnInit } from '@angular/core';
  import { FooterService } from '../../core/footer.service';
  import { CommonModule } from '@angular/common';
  import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';


  interface FooterInfo {
  about: string;
  email: string;
  phone: string;
  address: string;
  facebook: string;
  instagram: string;
  whatsapp: string;
  google: string;
  termsLink?: string;
  refundLink?: string;
  privacyLink?: string;
}


  @Component({
    selector: 'app-footer',
    templateUrl: './footer.html',
    styleUrls: ['./footer.scss'],
    imports:[CommonModule, FormsModule, RouterLink]
  })
  export class FooterComponent implements OnInit {
    footerInfo?: FooterInfo;

    constructor(private footerService: FooterService) {}

    ngOnInit() {
      this.footerService.getFooterInfo().subscribe((data) => {
        this.footerInfo = data;
      });
    }
  }
