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
          <h1 class="page-title">💳 My Wallet</h1>
          <p class="page-subtitle">Your stars history</p>
        </div>
      </div>

      <div class="wallet-hero">
        <div class="wallet-glow"></div>
        <mat-icon class="wallet-icon">account_balance_wallet</mat-icon>
        <div class="wallet-balance">{{ wallet?.balance || 0 }}</div>
        <div class="wallet-label">⭐ Stars Balance</div>
      </div>

      <mat-card class="tx-card">
        <mat-card-header>
          <mat-card-title>📜 Transaction History</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          @if (loading) {
            <div style="text-align:center;padding:40px"><mat-spinner></mat-spinner></div>
          } @else if (transactions.length === 0) {
            <div class="empty-state"><mat-icon>receipt_long</mat-icon><h3>No transactions yet</h3></div>
          } @else {
            <table mat-table [dataSource]="transactions" class="full-table">
              <ng-container matColumnDef="type">
                <th mat-header-cell *matHeaderCellDef>Type</th>
                <td mat-cell *matCellDef="let t">
                  <div class="type-cell">
                    <mat-icon [class]="'type-icon type-'+t.type.toLowerCase()">{{ typeIcon(t.type) }}</mat-icon>
                    {{ t.type }}
                  </div>
                </td>
              </ng-container>
              <ng-container matColumnDef="description">
                <th mat-header-cell *matHeaderCellDef>Description</th>
                <td mat-cell *matCellDef="let t">{{ t.description }}</td>
              </ng-container>
              <ng-container matColumnDef="amount">
                <th mat-header-cell *matHeaderCellDef>Stars</th>
                <td mat-cell *matCellDef="let t">
                  <span [class]="t.amount > 0 ? 'amount-pos' : 'amount-neg'">
                    {{ t.amount > 0 ? '+' : '' }}{{ t.amount }} ⭐
                  </span>
                </td>
              </ng-container>
              <ng-container matColumnDef="date">
                <th mat-header-cell *matHeaderCellDef>Date</th>
                <td mat-cell *matCellDef="let t">{{ t.createdAt | date:'MMM d, y' }}</td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="cols"></tr>
              <tr mat-row *matRowDef="let row; columns: cols;"></tr>
            </table>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .wallet-hero { text-align: center; padding: 48px 24px; margin-bottom: 32px; background: linear-gradient(135deg, #1a1a2e, #16213e); border-radius: 24px; border: 1px solid rgba(255,215,0,0.3); position: relative; overflow: hidden; }
    .wallet-glow { position: absolute; top: -50%; left: 50%; transform: translateX(-50%); width: 300px; height: 300px; background: radial-gradient(circle, rgba(255,215,0,0.15), transparent 70%); border-radius: 50%; animation: pulse-gold 3s infinite; }
    .wallet-icon { font-size: 48px; width: 48px; height: 48px; color: #ffd700; margin-bottom: 16px; position: relative; }
    .wallet-balance { font-size: 5rem; font-weight: 900; color: #ffd700; line-height: 1; position: relative; }
    .wallet-label { color: #94a3b8; margin-top: 8px; font-size: 1rem; }
    .tx-card { }
    .full-table { width: 100%; }
    .type-cell { display: flex; align-items: center; gap: 8px; }
    .type-icon { font-size: 18px; width: 18px; height: 18px; }
    .type-icon.type-reward { color: #10b981; }
    .type-icon.type-penalty { color: #ef4444; }
    .type-icon.type-redeem { color: #7c3aed; }
    .amount-pos { color: #10b981; font-weight: 700; }
    .amount-neg { color: #ef4444; font-weight: 700; }
  `]
})
export class ChildWalletComponent implements OnInit {
  wallet: Wallet | null = null;
  transactions: Transaction[] = [];
  loading = true;
  cols = ['type', 'description', 'amount', 'date'];

  constructor(public auth: AuthService, private walletSvc: WalletService) {}

  ngOnInit() {
    const id = this.auth.currentUser!.userId;
    this.walletSvc.getWallet(id).subscribe(w => this.wallet = w);
    this.walletSvc.getTransactions(id).subscribe({ next: t => { this.transactions = t; this.loading = false; }, error: () => this.loading = false });
  }

  typeIcon(type: string) {
    return type === 'Reward' ? 'star' : type === 'Penalty' ? 'warning' : 'shopping_bag';
  }
}
