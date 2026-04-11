import { environment } from '../../../environments/environment';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { TaskService } from '../../core/services/task.service';
import { RewardService, WalletService } from '../../core/services/reward-wallet-penalty.service';
import { FamilyTask } from '../../core/models/task.model';
import { Wallet, Reward } from '../../core/models/reward.model';
import { UserService } from '../../core/services/user.service';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-child-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatProgressBarModule],
  template: `
    <div class="animate-in">
      <!-- Hero Section: Avatar + Stars -->
      <div class="hero-section">
        <div class="hero-left">
          <div class="hero-avatar-wrap">
            <img [src]="getAvatar()"
                 [alt]="auth.currentUser?.fullName" class="hero-avatar">
          </div>
          <div>
             <div class="hero-name">{{ auth.currentUser?.fullName }}</div>
             <button class="pass-btn" (click)="changePassword()">{{ i18n.t('childDashboard.changePassword') }}</button>
          </div>
        </div>
        <div class="hero-right">
          <div class="star-badge pulse-gold">
            <span class="big-star">⭐</span>
            <div class="star-count">
              <span class="star-num">{{ wallet?.balance || 0 }}</span>
              <span class="star-label">{{ i18n.t('common.stars') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Your Tasks Today -->
      <div class="section">
        <h2 class="section-title">📋 {{ i18n.t('tasks.yourTasksToday') }}</h2>
        @if (loading) {
          <div style="text-align:center;padding:40px"><mat-spinner></mat-spinner></div>
        } @else if (tasks.length === 0) {
          <div class="empty-state">
            <span style="font-size:3rem">🎉</span>
            <h3>{{ i18n.t('tasks.allDone') }}</h3>
            <p>{{ i18n.t('tasks.noTasksNow') }}</p>
          </div>
        } @else {
          <div class="scroll-section">
            @for (task of tasks; track task.id) {
              <div class="task-card" [style.background]="taskColors[task.id % taskColors.length]">
                <div class="task-stars-badge">+{{ task.stars }} ⭐</div>
                <div class="task-emoji">{{ task.icon || taskEmojis[task.id % taskEmojis.length] }}</div>
                <div class="task-title">{{ task.title }}</div>
                <a class="mark-done-btn" routerLink="/child/tasks">{{ i18n.t('tasks.markDone') }}</a>
              </div>
            }
          </div>
        }
      </div>

      <!-- Quick Nav -->
      <div class="quick-nav">
        <a routerLink="/child/tasks" class="qnav-btn tasks-btn">
          <span class="qnav-icon">📋</span>
          <span>{{ i18n.t('childDashboard.myTasks') }}</span>
        </a>
        <a routerLink="/child/wallet" class="qnav-btn wallet-btn">
          <span class="qnav-icon">💰</span>
          <span>{{ i18n.t('childDashboard.myWallet') }}</span>
        </a>
        <a routerLink="/leaderboard" class="qnav-btn rank-btn">
          <span class="qnav-icon">🏆</span>
          <span>{{ i18n.t('childDashboard.leaderboard') }}</span>
        </a>
      </div>
    </div>
  `,
  styles: [`
    /* Hero Section */
    .hero-section {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      padding: 28px 32px;
      background: linear-gradient(135deg, #b2ebf2, #e0f7fa, #b2ebf2);
      border-radius: 24px;
      margin-bottom: 28px;
      box-shadow: 0 4px 16px rgba(77,201,214,0.15);
      border: 2px solid rgba(77,201,214,0.2);
      flex-wrap: wrap;
    }
    .hero-left { display: flex; align-items: center; gap: 20px; }
    .hero-avatar-wrap {
      width: 88px; height: 88px;
      border-radius: 50%;
      border: 4px solid #4dc9d6;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(77,201,214,0.3);
      background: white;
    }
    .hero-avatar { width: 100%; height: 100%; object-fit: cover; }
    .hero-name { font-size: 1.6rem; font-weight: 700; color: #2d3436; margin-bottom: 8px; }
    .pass-btn { background: rgba(255,255,255,0.5); border: 1px solid rgba(0,0,0,0.1); padding: 4px 10px; border-radius: 12px; font-size: 0.8rem; cursor: pointer; transition: 0.2s; font-family: 'Fredoka', sans-serif; }
    .pass-btn:hover { background: white; }

    .hero-right { display: flex; align-items: center; }
    .star-badge {
      display: flex;
      align-items: center;
      gap: 12px;
      background: linear-gradient(135deg, #fffde7, #fff9c4);
      border: 3px solid #f5b400;
      border-radius: 20px;
      padding: 14px 28px;
      box-shadow: 0 4px 20px rgba(245,180,0,0.25);
    }
    .big-star { font-size: 2.8rem; filter: drop-shadow(0 2px 4px rgba(245,180,0,0.4)); }
    .star-count { display: flex; flex-direction: column; }
    .star-num { font-size: 2.4rem; font-weight: 700; color: #f57f17; line-height: 1; text-align: center; }
    .star-label { font-size: 0.85rem; color: #8d6e00; font-weight: 500; }

    /* Section */
    .section { margin-bottom: 28px; }
    .section-title { font-size: 1.3rem; font-weight: 700; color: #2d3436; margin-bottom: 16px; }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .see-all { color: #4dc9d6; font-weight: 600; text-decoration: none; font-size: 0.9rem; }

    /* Task Cards - Horizontal Scroll */
    .scroll-section {
      display: flex;
      gap: 16px;
      overflow-x: auto;
      padding: 8px 4px 16px;
      scroll-snap-type: x mandatory;
      -webkit-overflow-scrolling: touch;
    }
    .scroll-section::-webkit-scrollbar { height: 6px; }
    .scroll-section::-webkit-scrollbar-thumb { background: #4dc9d6; border-radius: 3px; }

    .task-card {
      flex-shrink: 0;
      width: 200px;
      border-radius: 20px;
      padding: 18px;
      text-align: center;
      position: relative;
      scroll-snap-align: start;
      box-shadow: 0 4px 16px rgba(0,0,0,0.08);
      transition: all 0.3s;
      border: 2px solid rgba(0,0,0,0.05);
    }
    .task-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }

    .task-stars-badge {
      position: absolute;
      top: 10px; right: 12px;
      background: white;
      border-radius: 12px;
      padding: 2px 10px;
      font-size: 0.8rem;
      font-weight: 700;
      color: #f57f17;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }
    [dir="rtl"] .task-stars-badge { right: auto; left: 12px; }
    .task-emoji { font-size: 2.6rem; margin: 12px 0 8px; }
    .task-title { font-weight: 600; font-size: 0.95rem; margin-bottom: 14px; color: #2d3436; min-height: 40px; }
    .mark-done-btn {
      display: block;
      background: linear-gradient(135deg, #4caf50, #66bb6a);
      color: white;
      border: none;
      padding: 8px 0;
      border-radius: 12px;
      font-family: 'Fredoka', sans-serif;
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s;
      box-shadow: 0 2px 8px rgba(76,175,80,0.3);
    }
    .mark-done-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(76,175,80,0.4); }

    /* Quick Nav */
    .quick-nav { display: flex; gap: 14px; flex-wrap: wrap; }
    .qnav-btn {
      flex: 1; min-width: 120px;
      display: flex; flex-direction: column; align-items: center; gap: 8px;
      padding: 20px;
      border-radius: 20px;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.95rem;
      transition: all 0.3s;
      border: 2px solid transparent;
    }
    .qnav-btn:hover { transform: translateY(-4px); }
    .qnav-icon { font-size: 2rem; }
    .tasks-btn { background: #e3f2fd; color: #1565c0; border-color: rgba(21,101,192,0.15); }
    .wallet-btn { background: #fff8e1; color: #f57f17; border-color: rgba(245,127,23,0.15); }
    .rank-btn { background: #e8f5e9; color: #2e7d32; border-color: rgba(46,125,50,0.15); }

    @media(max-width: 600px) {
      .hero-section { flex-direction: column; text-align: center; padding: 20px; }
      .hero-left { flex-direction: column; }
      .task-card { width: 170px; }
    }
  `]
})
export class ChildDashboardComponent implements OnInit {
  tasks: FamilyTask[] = [];
  wallet: Wallet | null = null;
  loading = true;
  profileImageUrl: string | null = null;
  public i18n = inject(I18nService);

  taskColors = ['#ffe0b2', '#fff9c4', '#c8e6c9', '#b3e5fc', '#f8bbd0', '#d1c4e9', '#b2ebf2', '#ffe082'];
  taskEmojis = [
    '🧹', '🛏️', '📚', '🐶', '🗑️', '🌱', '👕', '🍽️', '🏋️', '🧘‍♂️', '🎨', '🎯',
    '🧺', '🧼', '🚗', '🪴', '🛒', '📝', '🏃', '🚿', '🧸', '🪟', '🧽', '🍼'
  ];

  constructor(public auth: AuthService, private taskSvc: TaskService,
    private walletSvc: WalletService, private userSvc: UserService) {}

  ngOnInit() {
    const childId = this.auth.currentUser!.userId;
    forkJoin([
      this.taskSvc.getTasks(),
      this.walletSvc.getWallet(childId),
      this.userSvc.getLeaderboard()
    ]).subscribe({
      next: ([t, w, children]) => { 
        this.tasks = t; 
        this.wallet = w; 
        
        const currentChild = children.find(c => c.id === childId);
        if (currentChild && currentChild.avatarUrl) {
            this.profileImageUrl = currentChild.avatarUrl;
        }

        this.loading = false; 
      },
      error: () => this.loading = false
    });
  }

  changePassword() {
    const current = prompt(this.i18n.t('common.password') + ' (Current):');
    if (!current) return;
    const newPass = prompt(this.i18n.t('common.password') + ' (New, min 6 chars):');
    if (!newPass || newPass.length < 6) {
      alert("Invalid new password!");
      return;
    }
    this.userSvc.changePassword({ currentPassword: current, newPassword: newPass }).subscribe({
      next: () => alert(this.i18n.t('common.success') + "!"),
      error: (e) => alert(e.error?.message || this.i18n.t('common.error'))
    });
  }

  getAvatar(): string {
    const url = this.profileImageUrl || this.auth.currentUser?.avatarUrl;
    if (url?.startsWith('/uploads')) {
      return `${environment.apiUrl.replace('/api', '')}${url}`;
    }
    return url || 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=' + encodeURIComponent(this.auth.currentUser?.fullName || '');
  }
}
