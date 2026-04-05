import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { forkJoin } from 'rxjs';
import { UserService } from '../../core/services/user.service';
import { TaskService } from '../../core/services/task.service';
import { RewardService } from '../../core/services/reward-wallet-penalty.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="animate-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">👑 Admin Dashboard</h1>
          <p class="page-subtitle">Welcome back, {{ auth.currentUser?.fullName }}</p>
        </div>
      </div>

      @if (loading) {
        <div style="text-align:center;padding:64px"><mat-spinner></mat-spinner></div>
      } @else {
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon purple"><mat-icon>group</mat-icon></div>
            <div class="stat-info">
              <h3>{{ children }}</h3>
              <p>Children</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon blue"><mat-icon>assignment</mat-icon></div>
            <div class="stat-info">
              <h3>{{ tasks }}</h3>
              <p>Active Tasks</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon gold"><mat-icon>pending_actions</mat-icon></div>
            <div class="stat-info">
              <h3>{{ pending }}</h3>
              <p>Pending Approvals</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon green"><mat-icon>card_giftcard</mat-icon></div>
            <div class="stat-info">
              <h3>{{ rewards }}</h3>
              <p>Rewards Available</p>
            </div>
          </div>
        </div>

        <h2 class="section-title">Quick Actions</h2>
        <div class="actions-grid">
          <a mat-raised-button class="action-card" routerLink="/admin/tasks">
            <mat-icon>add_task</mat-icon>
            <span>Create Task</span>
          </a>
          <a mat-raised-button class="action-card approval" routerLink="/admin/tasks">
            <mat-icon>approval</mat-icon>
            <span>Review Completions <span class="pending-badge" *ngIf="pending > 0">{{pending}}</span></span>
          </a>
          <a mat-raised-button class="action-card" routerLink="/admin/rewards">
            <mat-icon>add_shopping_cart</mat-icon>
            <span>Add Reward</span>
          </a>
          <a mat-raised-button class="action-card danger" routerLink="/admin/penalties">
            <mat-icon>report</mat-icon>
            <span>Add Penalty</span>
          </a>
          <a mat-raised-button class="action-card" routerLink="/admin/children">
            <mat-icon>person_add</mat-icon>
            <span>Add Child</span>
          </a>
          <a mat-raised-button class="action-card gold" routerLink="/leaderboard">
            <mat-icon>emoji_events</mat-icon>
            <span>Leaderboard</span>
          </a>
        </div>
      }
    </div>
  `,
  styles: [`
    .section-title { font-size: 1.2rem; font-weight: 700; color: #94a3b8; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 1px; }
    .actions-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
    .action-card { display: flex !important; flex-direction: column; align-items: center; gap: 12px; padding: 24px !important; border-radius: 16px !important; background: linear-gradient(135deg, #1a1a2e, #16213e) !important; border: 1px solid rgba(255,255,255,0.1) !important; color: white !important; height: 100px; cursor: pointer; transition: all 0.3s !important; text-decoration: none; }
    .action-card:hover { transform: translateY(-4px); border-color: #7c3aed !important; box-shadow: 0 12px 40px rgba(124,58,237,0.3) !important; }
    .action-card mat-icon { font-size: 32px; width: 32px; height: 32px; color: #7c3aed; }
    .action-card.gold mat-icon { color: #ffd700; }
    .action-card.gold:hover { border-color: #ffd700 !important; box-shadow: 0 12px 40px rgba(255,215,0,0.3) !important; }
    .action-card.approval mat-icon { color: #f59e0b; }
    .action-card.danger mat-icon { color: #ef4444; }
    .pending-badge { background: #ef4444; color: white; border-radius: 50%; width: 20px; height: 20px; font-size: 0.7rem; display: inline-flex; align-items: center; justify-content: center; margin-left: 6px; }
  `]
})
export class DashboardComponent implements OnInit {
  children = 0; tasks = 0; pending = 0; rewards = 0;
  loading = true;

  constructor(public auth: AuthService, private userSvc: UserService,
    private taskSvc: TaskService, private rewardSvc: RewardService) {}

  ngOnInit() {
    forkJoin([
      this.userSvc.getChildren(),
      this.taskSvc.getTasks(),
      this.taskSvc.getPendingCompletions(),
      this.rewardSvc.getRewards()
    ]).subscribe({
      next: ([c, t, p, r]) => {
        this.children = c.length; this.tasks = t.length;
        this.pending = p.length; this.rewards = r.length;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}
