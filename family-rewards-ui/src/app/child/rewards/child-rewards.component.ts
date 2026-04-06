import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RewardService, WalletService } from '../../core/services/reward-wallet-penalty.service';
import { AuthService } from '../../core/services/auth.service';
import { Reward, Wallet } from '../../core/models/reward.model';

@Component({
  selector: 'app-child-rewards',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatSnackBarModule, MatProgressSpinnerModule, MatProgressBarModule],
  template: `
    <div class="animate-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">🏪 The Goal Shop</h1>
          <p class="page-subtitle">Spend your stars on amazing rewards!</p>
        </div>
        <div class="balance-pill">
          <span class="pill-star">⭐</span>
          <span class="pill-count">{{ wallet?.balance || 0 }}</span>
          <span class="pill-label">Stars</span>
        </div>
      </div>

      @if (rewards.length === 0) {
        <div class="empty-state">
          <span style="font-size:4rem">🎁</span>
          <h3>No rewards yet</h3>
          <p>Ask your parents to add some!</p>
        </div>
      } @else {
        <div class="rewards-grid">
          @for (reward of rewards; track reward.id) {
            <div class="reward-card" [class.can-afford]="canAfford(reward)">
              <div class="rcard-icon">{{ rewardEmojis[reward.id % rewardEmojis.length] }}</div>
              <div class="rcard-body">
                <h3 class="rcard-title">{{ reward.title }}</h3>
                <p class="rcard-desc">{{ reward.description }}</p>
                <div class="rcard-cost">
                  <span>⭐ {{ reward.starsCost }}</span>
                </div>
                <div class="rcard-progress">
                  <mat-progress-bar mode="determinate" [value]="progressPct(reward)"></mat-progress-bar>
                  <span class="pct-label">{{ progressPct(reward) | number:'1.0-0' }}%</span>
                </div>
              </div>
              <button class="rcard-btn" [class.afford]="canAfford(reward)"
                      (click)="redeem(reward)" [disabled]="!canAfford(reward) || redeeming === reward.id">
                @if (redeeming === reward.id) { ⏳ }
                @else if (canAfford(reward)) { 🎉 Redeem! }
                @else { 🔒 Save up }
              </button>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .balance-pill {
      display: flex; align-items: center; gap: 8px;
      background: linear-gradient(135deg, #fffde7, #fff9c4);
      border: 2px solid #f5b400;
      padding: 10px 20px; border-radius: 20px;
      box-shadow: 0 2px 8px rgba(245,180,0,0.2);
    }
    .pill-star { font-size: 1.3rem; }
    .pill-count { font-size: 1.3rem; font-weight: 700; color: #f57f17; }
    .pill-label { font-size: 0.9rem; color: #8d6e00; font-weight: 500; }

    .rewards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
    }
    .reward-card {
      display: flex; align-items: center; gap: 16px;
      background: white;
      border: 2px solid rgba(0,0,0,0.06);
      border-radius: 20px;
      padding: 18px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      transition: all 0.3s;
      opacity: 0.7;
    }
    .reward-card.can-afford { opacity: 1; border-color: rgba(76,175,80,0.2); }
    .reward-card.can-afford:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(76,175,80,0.15); border-color: #4caf50; }
    .rcard-icon { font-size: 2.4rem; flex-shrink: 0; }
    .rcard-body { flex: 1; }
    .rcard-title { font-weight: 700; font-size: 1rem; margin-bottom: 4px; }
    .rcard-desc { color: #636e72; font-size: 0.82rem; margin-bottom: 8px; }
    .rcard-cost { color: #f57f17; font-weight: 700; margin-bottom: 6px; font-size: 0.9rem; }
    .rcard-progress { display: flex; align-items: center; gap: 8px; }
    .rcard-progress mat-progress-bar { flex: 1; }
    .pct-label { font-size: 0.75rem; color: #636e72; min-width: 30px; }
    .rcard-btn {
      background: #e0e0e0; color: #9e9e9e; border: none;
      padding: 10px 16px; border-radius: 14px;
      font-family: 'Fredoka', sans-serif; font-weight: 600; font-size: 0.85rem;
      cursor: default; flex-shrink: 0; transition: all 0.2s;
    }
    .rcard-btn.afford {
      background: linear-gradient(135deg, #4caf50, #66bb6a); color: white;
      cursor: pointer; box-shadow: 0 2px 8px rgba(76,175,80,0.3);
    }
    .rcard-btn.afford:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(76,175,80,0.4); }

    ::ng-deep .rcard-progress .mdc-linear-progress__bar-inner { border-color: #4dc9d6 !important; }
  `]
})
export class ChildRewardsComponent implements OnInit {
  rewards: Reward[] = [];
  wallet: Wallet | null = null;
  redeeming: number | null = null;
  rewardEmojis = ['📱', '🚲', '🎮', '🍦', '📚', '🎬', '🧸', '⚽', '🎨', '🎵'];

  constructor(public auth: AuthService, private rewardSvc: RewardService,
    private walletSvc: WalletService, private snack: MatSnackBar) {}

  ngOnInit() {
    this.rewardSvc.getRewards().subscribe(r => this.rewards = r);
    this.walletSvc.getWallet(this.auth.currentUser!.userId).subscribe(w => this.wallet = w);
  }

  canAfford(r: Reward) { return (this.wallet?.balance || 0) >= r.starsCost; }
  progressPct(r: Reward) { return Math.min(100, ((this.wallet?.balance || 0) / r.starsCost) * 100); }

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
