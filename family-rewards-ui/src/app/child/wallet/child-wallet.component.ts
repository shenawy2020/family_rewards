import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { WalletService } from '../../core/services/reward-wallet-penalty.service';
import { AuthService } from '../../core/services/auth.service';
import { Wallet, Transaction } from '../../core/models/reward.model';

@Component({
  selector: 'app-child-wallet',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatTableModule, MatProgressSpinnerModule],
  template: `
    <div class="animate-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">💰 My Wallet</h1>
          <p class="page-subtitle">Your stars history</p>
        </div>
      </div>

      <div class="wallet-hero">
        <div class="hero-star float">⭐</div>
        <div class="hero-balance">{{ wallet?.balance || 0 }}</div>
        <div class="hero-label">Stars Balance</div>
      </div>

      <div class="tx-card">
        <h2 class="section-title">📜 Transaction History</h2>
        @if (loading) {
          <div style="text-align:center;padding:40px"><mat-spinner></mat-spinner></div>
        } @else if (transactions.length === 0) {
          <div class="empty-state">
            <span style="font-size:3rem">📜</span>
            <h3>No transactions yet</h3>
          </div>
        } @else {
          <div class="tx-list">
            @for (t of transactions; track t) {
              <div class="tx-row">
                <div class="tx-left">
                  <span class="tx-icon" [class]="'tx-type-' + t.type.toLowerCase()">{{ typeEmoji(t.type) }}</span>
                  <div>
                    <div class="tx-desc">{{ t.description }}</div>
                    <div class="tx-date">{{ t.createdAt | date:'MMM d, y' }}</div>
                  </div>
                </div>
                <span [class]="t.amount > 0 ? 'amount-pos' : 'amount-neg'">
                  {{ t.amount > 0 ? '+' : '' }}{{ t.amount }} ⭐
                </span>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .wallet-hero {
      text-align: center;
      padding: 40px 24px;
      margin-bottom: 28px;
      background: linear-gradient(135deg, #fffde7, #fff9c4, #ffe082);
      border-radius: 24px;
      border: 3px solid #f5b400;
      box-shadow: 0 4px 20px rgba(245,180,0,0.2);
    }
    .hero-star { font-size: 3.5rem; margin-bottom: 8px; display: inline-block; }
    .hero-balance { font-size: 4rem; font-weight: 700; color: #f57f17; line-height: 1; }
    .hero-label { color: #8d6e00; margin-top: 8px; font-size: 1rem; font-weight: 500; }

    .section-title { font-size: 1.2rem; font-weight: 700; margin-bottom: 16px; }

    .tx-card {
      background: white;
      border-radius: 20px;
      padding: 24px;
      border: 2px solid rgba(0,0,0,0.06);
      box-shadow: 0 4px 16px rgba(0,0,0,0.05);
    }
    .tx-list { display: flex; flex-direction: column; gap: 8px; }
    .tx-row {
      display: flex; align-items: center; justify-content: space-between;
      padding: 14px 16px;
      border-radius: 14px;
      background: #f8fffe;
      border: 1px solid rgba(0,0,0,0.04);
      transition: all 0.2s;
    }
    .tx-row:hover { background: #e0f7fa; }
    .tx-left { display: flex; align-items: center; gap: 12px; }
    .tx-icon { font-size: 1.5rem; }
    .tx-desc { font-weight: 500; font-size: 0.95rem; }
    .tx-date { color: #b2bec3; font-size: 0.8rem; margin-top: 2px; }
    .amount-pos { color: #2e7d32; font-weight: 700; font-size: 1rem; }
    .amount-neg { color: #c62828; font-weight: 700; font-size: 1rem; }
  `]
})
export class ChildWalletComponent implements OnInit {
  wallet: Wallet | null = null;
  transactions: Transaction[] = [];
  loading = true;

  constructor(public auth: AuthService, private walletSvc: WalletService) {}

  ngOnInit() {
    const id = this.auth.currentUser!.userId;
    this.walletSvc.getWallet(id).subscribe(w => this.wallet = w);
    this.walletSvc.getTransactions(id).subscribe({ next: t => { this.transactions = t; this.loading = false; }, error: () => this.loading = false });
  }

  typeEmoji(type: string) {
    return type === 'Reward' ? '⭐' : type === 'Penalty' ? '⚠️' : '🛍️';
  }
}
