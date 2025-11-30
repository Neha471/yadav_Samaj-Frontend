import { Component, OnInit } from '@angular/core';
import { WalletService } from '../../../core/wallet';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.html',
  styleUrls: ['./wallet.scss'],
   imports:[FormsModule, CommonModule]
})
export class WalletComponent implements OnInit {
  transactions: any[] = [];
  totalBalance: number = 0;

  userEmail = '';
  amount = 0;
  type = 'CREDIT';
  description = '';

  constructor(private walletService: WalletService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.walletService.getAll().subscribe(data => this.transactions = data);
    this.walletService.getBalance().subscribe(res => this.totalBalance = res.totalBalance);
  }

  addTransaction() {
    const tx = { userEmail: this.userEmail, amount: this.amount, type: this.type, description: this.description };
    this.walletService.addTransaction(tx).subscribe(() => {
      alert('Transaction added!');
      this.loadData();
    });
  }
}
