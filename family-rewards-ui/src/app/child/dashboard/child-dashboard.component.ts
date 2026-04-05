import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { TaskService } from '../../core/services/task.service';
import { WalletService } from '../../core/services/reward-wallet-penalty.service';
import { FamilyTask } from '../../core/models/task.model';
import { Wallet } from '../../core/models/reward.model';

@Component({
  selector: 'app-child-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="animate-in">
      <div class="hero-section">
        <div class="hero-avatar">
          <img [src]="auth.currentUser?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + auth.currentUser?.fullName"
               [alt]="auth.currentUser?.fullName" class="hero-img">
          <div class="star-ring pulse-gold"></div>
        </div>
        <div class="hero-info">
          <p class="hero-greeting">Hello, 👋</p>
          <h1 class="hero-name">{{ auth.currentUser?.fullName }}</h1>
          <div class="balance-display">
            <mat-icon>star</mat-icon>
            <span class="balance-num">{{ wallet?.balance || 0 }}</span>
            <span class="balance-label">Stars</span>
          </div>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon blue"><mat-icon>assignment</mat-icon></div>
          <div class="stat-info"><h3>{{ tasks.length }}</h3><p>Available Tasks</p></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon gold"><mat-icon>account_balance_wallet</mat-icon></div>
          <div class="stat-info"><h3>{{ wallet?.balance || 0 }}</h3><p>Stars Balance</p></div>
        </div>
      </div>

      <h2 class="section-heading">📋 Today's Tasks</h2>
      @if (loading) {
        <div style="text-align:center;padding:40px"><mat-spinner></mat-spinner></div>
      } @else if (tasks.length === 0) {
        <div class="empty-state"><mat-icon>celebration</mat-icon><h3>All done! 🎉</h3><p>No tasks available right now</p></div>
      } @else {
        <div class="cards-grid">
          @for (task of tasks.slice(0, 6); track task.id) {
            <mat-card class="task-card animate-in">
              <div class="task-top">
                <span class="badge" [class]="'badge-' + task.type.toLowerCase()">{{ task.type }}</span>
                <div class="stars-display"><mat-icon>star</mat-icon> {{ task.stars }}</div>
              </div>
              <h3>{{ task.title }}</h3>
              <p class="task-desc">{{ task.description }}</p>
              <a mat-raised-button class="btn-primary mark-done-btn" routerLink="/child/tasks">
                <mat-icon>check_circle</mat-icon> Mark Done
              </a>
            </mat-card>
          }
        </div>
      }

      <div class="quick-nav">
        <a mat-raised-button class="nav-btn store" routerLink="/child/rewards">
          <mat-icon>store</mat-icon><span>Rewards Store</span>
        </a>
        <a mat-raised-button class="nav-btn wallet" routerLink="/child/wallet">
          <mat-icon>account_balance_wallet</mat-icon><span>My Wallet</span>
        </a>
        <a mat-raised-button class="nav-btn board" routerLink="/leaderboard">
          <mat-icon>emoji_events</mat-icon><span>Leaderboard</span>
        </a>
      </div>
    </div>
  `,
  styles: [`
    .hero-section { display: flex; align-items: center; gap: 28px; margin-bottom: 32px; padding: 32px; background: linear-gradient(135deg, #1a1a2e, #16213e); border-radius: 24px; border: 1px solid rgba(255,215,0,0.2); }
    .hero-avatar { position: relative; flex-shrink: 0; }
    .hero-img { width: 100px; height: 100px; border-radius: 50%; border: 4px solid #ffd700; position: relative; z-index: 1; }
    .star-ring { position: absolute; inset: -8px; border-radius: 50%; border: 2px solid rgba(255,215,0,0.4); }
    .hero-greeting { color: #94a3b8; font-size: 0.9rem; }
    .hero-name { font-size: 2rem; font-weight: 800; color: white; margin: 4px 0 12px; }
    .balance-display { display: flex; align-items: center; gap: 8px; }
    .balance-display mat-icon { color: #ffd700; font-size: 28px; }
    .balance-num { font-size: 2rem; font-weight: 800; color: #ffd700; }
    .balance-label { color: #94a3b8; }
    .section-heading { font-size: 1.2rem; font-weight: 700; margin: 24px 0 16px; }
    .task-card { padding: 20px !important; transition: all 0.3s; }
    .task-card:hover { transform: translateY(-4px); border-color: #7c3aed !important; }
    .task-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .task-desc { color: #94a3b8; font-size: 0.85rem; margin: 8px 0 16px; }
    .mark-done-btn { width: 100%; justify-content: center; }
    .quick-nav { display: flex; gap: 16px; margin-top: 32px; flex-wrap: wrap; }
    .nav-btn { flex: 1; min-width: 140px; display: flex !important; flex-direction: column; align-items: center; gap: 8px; padding: 20px !important; border-radius: 16px !important; height: auto !important; font-size: 0.9rem; }
    .nav-btn.store { background: linear-gradient(135deg, rgba(124,58,237,0.3), rgba(59,130,246,0.3)) !important; color: white !important; border: 1px solid rgba(124,58,237,0.4) !important; }
    .nav-btn.wallet { background: linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,140,0,0.2)) !important; color: #ffd700 !important; border: 1px solid rgba(255,215,0,0.3) !important; }
    .nav-btn.board { background: linear-gradient(135deg, rgba(16,185,129,0.2), rgba(59,130,246,0.2)) !important; color: #10b981 !important; border: 1px solid rgba(16,185,129,0.3) !important; }
    .nav-btn mat-icon { font-size: 28px; width: 28px; height: 28px; }
  `]
})
export class ChildDashboardComponent implements OnInit {
  tasks: FamilyTask[] = [];
  wallet: Wallet | null = null;
  loading = true;

  constructor(public auth: AuthService, private taskSvc: TaskService, private walletSvc: WalletService) {}

  ngOnInit() {
    const childId = this.auth.currentUser!.userId;
    forkJoin([this.taskSvc.getTasks(), this.walletSvc.getWallet(childId)]).subscribe({
      next: ([t, w]) => { this.tasks = t; this.wallet = w; this.loading = false; },
      error: () => this.loading = false
    });
  }
}
