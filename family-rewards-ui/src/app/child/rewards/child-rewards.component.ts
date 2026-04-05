import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RewardService, WalletService } from '../../core/services/reward-wallet-penalty.service';
import { AuthService } from '../../core/services/auth.service';
import { Reward, Wallet } from '../../core/models/reward.model';

@Component({
  selector: 'app-child-rewards',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatSnackBarModule, MatProgressSpinnerModule],
  template: `
    <div class="animate-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">🏪 Rewards Store</h1>
          <p class="page-subtitle">Spend your stars on amazing rewards!</p>
        </div>
        <div class="balance-pill">
          <mat-icon>star</mat-icon>
          <span>{{ wallet?.balance || 0 }} Stars</span>
        </div>
      </div>

      @if (rewards.length === 0) {
        <div class="empty-state"><mat-icon>store</mat-icon><h3>No rewards yet</h3><p>Ask your parents to add some!</p></div>
      } @else {
        <div class="cards-grid">
          @for (reward of rewards; track reward.id) {
            <mat-card class="reward-card animate-in" [class.can-afford]="canAfford(reward)">
              <div class="reward-emoji">🎁</div>
              <h3 class="reward-title">{{ reward.title }}</h3>
              <p class="reward-desc">{{ reward.description }}</p>
              <div class="reward-footer">
                <div class="cost" [class.affordable]="canAfford(reward)">
                  <mat-icon>star</mat-icon> {{ reward.starsCost }}
                </div>
                <button mat-raised-button
                        [class]="canAfford(reward) ? 'btn-gold' : 'btn-disabled'"
                        (click)="redeem(reward)"
                        [disabled]="!canAfford(reward) || redeeming === reward.id">
                  @if (redeeming === reward.id) { <mat-spinner diameter="18"></mat-spinner> }
                  @else { {{ canAfford(reward) ? 'Redeem! 🎉' : 'Need more stars' }} }
                </button>
              </div>
            </mat-card>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .balance-pill { display: flex; align-items: center; gap: 6px; background: rgba(255,215,0,0.15); border: 1px solid rgba(255,215,0,0.4); padding: 10px 20px; border-radius: 24px; color: #ffd700; font-size: 1.1rem; font-weight: 700; }
    .reward-card { text-align: center; padding: 28px 20px !important; transition: all 0.3s; opacity: 0.7; }
    .reward-card.can-afford { opacity: 1; }
    .reward-card.can-afford:hover { transform: translateY(-6px); border-color: #ffd700 !important; box-shadow: 0 12px 40px rgba(255,215,0,0.2) !important; }
    .reward-emoji { font-size: 3rem; margin-bottom: 12px; }
    .reward-title { font-size: 1.05rem; font-weight: 700; margin-bottom: 8px; }
    .reward-desc { color: #94a3b8; font-size: 0.85rem; margin-bottom: 16px; min-height: 40px; }
    .reward-footer { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; }
    .cost { display: flex; align-items: center; gap: 4px; color: #64748b; font-weight: 700; font-size: 1.1rem; }
    .cost.affordable { color: #ffd700; }
    .btn-disabled { background: rgba(255,255,255,0.05) !important; color: #64748b !important; border-radius: 10px !important; font-size: 0.8rem; }
  `]
})
export class ChildRewardsComponent implements OnInit {
  rewards: Reward[] = [];
  wallet: Wallet | null = null;
  redeeming: number | null = null;

  constructor(public auth: AuthService, private rewardSvc: RewardService,
    private walletSvc: WalletService, private snack: MatSnackBar) {}

  ngOnInit() {
    this.rewardSvc.getRewards().subscribe(r => this.rewards = r);
    this.walletSvc.getWallet(this.auth.currentUser!.userId).subscribe(w => this.wallet = w);
  }

  canAfford(r: Reward) { return (this.wallet?.balance || 0) >= r.starsCost; }

  redeem(r: Reward) {
    this.redeeming = r.id;
    this.rewardSvc.redeemReward(r.id).subscribe({
      next: () => {
        this.snack.open(`🎉 "${r.title}" redeemed! Enjoy!`, 'Close', { duration: 4000 });
        this.walletSvc.getWallet(this.auth.currentUser!.userId).subscribe(w => this.wallet = w);
        this.redeeming = null;
      },
      error: (e) => { this.snack.open(e.error?.message || 'Error', 'Close', { duration: 4000 }); this.redeeming = null; }
    });
  }
}
