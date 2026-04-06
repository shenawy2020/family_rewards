import { Component, OnInit, inject } from '@angular/core';
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
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="animate-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">👑 {{ i18n.t('adminDashboard.title') }}</h1>
          <p class="page-subtitle">{{ i18n.t('adminDashboard.welcome') }}, {{ auth.currentUser?.fullName }}</p>
        </div>
      </div>

      @if (loading) {
        <div style="text-align:center;padding:64px"><mat-spinner></mat-spinner></div>
      } @else {
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon purple">👨‍👩‍👧‍👦</div>
            <div class="stat-info"><h3>{{ children }}</h3><p>{{ i18n.t('adminDashboard.children') }}</p></div>
          </div>
          <div class="stat-card">
            <div class="stat-icon blue">📋</div>
            <div class="stat-info"><h3>{{ tasks }}</h3><p>{{ i18n.t('adminDashboard.activeTasks') }}</p></div>
          </div>
          <div class="stat-card">
            <div class="stat-icon gold">⏳</div>
            <div class="stat-info"><h3>{{ pending }}</h3><p>{{ i18n.t('adminDashboard.pendingApprovals') }}</p></div>
          </div>
          <div class="stat-card">
            <div class="stat-icon green">🎁</div>
            <div class="stat-info"><h3>{{ rewards }}</h3><p>{{ i18n.t('adminDashboard.rewardsAvailable') }}</p></div>
          </div>
        </div>

        <h2 class="section-title">⚡ {{ i18n.t('adminDashboard.quickActions') }}</h2>
        <div class="actions-grid">
          <a class="action-card" routerLink="/admin/tasks">
            <span class="action-emoji">📝</span>
            <span class="action-label">{{ i18n.t('adminDashboard.createTask') }}</span>
          </a>
          <a class="action-card pending-card" routerLink="/admin/tasks">
            <span class="action-emoji">✅</span>
            <span class="action-label">{{ i18n.t('adminDashboard.reviewCompletions') }}
              @if (pending > 0) { <span class="pending-dot">{{ pending }}</span> }
            </span>
          </a>
          <a class="action-card" routerLink="/admin/rewards">
            <span class="action-emoji">🎁</span>
            <span class="action-label">{{ i18n.t('adminDashboard.addReward') }}</span>
          </a>
          <a class="action-card danger-card" routerLink="/admin/penalties">
            <span class="action-emoji">⚠️</span>
            <span class="action-label">{{ i18n.t('adminDashboard.addPenalty') }}</span>
          </a>
          <a class="action-card" routerLink="/admin/children">
            <span class="action-emoji">👶</span>
            <span class="action-label">{{ i18n.t('adminDashboard.addChild') }}</span>
          </a>
          <a class="action-card gold-card" routerLink="/leaderboard">
            <span class="action-emoji">🏆</span>
            <span class="action-label">{{ i18n.t('adminDashboard.leaderboard') }}</span>
          </a>
        </div>
      }
    </div>
  `,
  styles: [`
    .section-title { font-size: 1.2rem; font-weight: 700; color: #636e72; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 1px; }
    .actions-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 14px; }
    .action-card {
      display: flex; flex-direction: column; align-items: center; gap: 10px;
      padding: 24px; border-radius: 20px;
      background: white;
      border: 2px solid rgba(0,0,0,0.06);
      color: #2d3436; text-decoration: none;
      cursor: pointer; transition: all 0.3s;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }
    .action-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); border-color: var(--accent-teal); }
    .action-emoji { font-size: 2.2rem; }
    .action-label { font-weight: 600; font-size: 0.9rem; text-align: center; }
    .gold-card { border-color: rgba(245,180,0,0.2); }
    .gold-card:hover { border-color: #f5b400; box-shadow: 0 8px 24px rgba(245,180,0,0.15); }
    .danger-card { border-color: rgba(239,83,80,0.15); }
    .danger-card:hover { border-color: #ef5350; }
    .pending-dot {
      background: #ef5350; color: white; border-radius: 50%; width: 20px; height: 20px;
      font-size: 0.7rem; display: inline-flex; align-items: center; justify-content: center; margin-left: 6px;
    }
    
    [dir="rtl"] .pending-dot { margin-left: 0; margin-right: 6px; }
  `]
})
export class DashboardComponent implements OnInit {
  children = 0; tasks = 0; pending = 0; rewards = 0;
  loading = true;
  public i18n = inject(I18nService);

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
