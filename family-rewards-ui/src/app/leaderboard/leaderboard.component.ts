import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../core/services/user.service';
import { User } from '../core/models/user.model';
import { I18nService } from '../core/services/i18n.service';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="animate-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">🏆 {{ i18n.t('leaderboard.title') }}</h1>
          <p class="page-subtitle">{{ i18n.t('leaderboard.subtitle') }}</p>
        </div>
      </div>

      @if (loading) {
        <div style="text-align:center;padding:64px"><mat-spinner></mat-spinner></div>
      } @else {
        <div class="leaderboard-list">
          @for (child of children; track child.id; let i = $index) {
            <div class="lb-card" [class]="'rank-' + (i+1)">
              <div class="lb-rank">
                @if (i === 0) { <span class="medal">🥇</span> }
                @else if (i === 1) { <span class="medal">🥈</span> }
                @else if (i === 2) { <span class="medal">🥉</span> }
                @else { <span class="rank-num">#{{ i + 1 }}</span> }
              </div>
              <img [src]="getAvatar(child)"
                   [alt]="child.fullName" class="lb-avatar">
              <div class="lb-info">
                <h3>{{ child.fullName }}</h3>
                <p>{{ child.email }}</p>
              </div>
              <div class="lb-score">
                <span class="score-star">⭐</span>
                <span class="score-num">{{ child.starBalance }}</span>
              </div>
            </div>
          }

          @if (children.length === 0) {
            <div class="empty-state">
              <span style="font-size:4rem">🏆</span>
              <h3>{{ i18n.t('leaderboard.noChildren') }}</h3>
              <p>{{ i18n.t('leaderboard.addToSee') }}</p>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .leaderboard-list { display: flex; flex-direction: column; gap: 14px; max-width: 700px; margin: 0 auto; }
    .lb-card {
      display: flex; align-items: center; gap: 16px;
      padding: 18px 24px;
      background: white;
      border: 2px solid rgba(0,0,0,0.06);
      border-radius: 20px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      transition: all 0.3s;
    }
    .lb-card:hover { transform: translateX(4px); box-shadow: 0 6px 20px rgba(0,0,0,0.08); }
    .lb-card.rank-1 {
      background: linear-gradient(135deg, #fffde7, #fff9c4);
      border-color: #f5b400;
      box-shadow: 0 4px 20px rgba(245,180,0,0.2);
    }
    .lb-card.rank-2 { border-color: #bdbdbd; background: #fafafa; }
    .lb-card.rank-3 { border-color: #cd7f32; background: #fff8f0; }
    .lb-rank { min-width: 50px; text-align: center; }
    .medal { font-size: 2.2rem; }
    .rank-num { font-size: 1.2rem; font-weight: 700; color: #b2bec3; }
    .lb-avatar {
      width: 56px; height: 56px; border-radius: 50%;
      border: 3px solid rgba(0,0,0,0.08); background: white;
    }
    .lb-card.rank-1 .lb-avatar { border-color: #f5b400; }
    .lb-info { flex: 1; }
    .lb-info h3 { font-size: 1.05rem; font-weight: 700; }
    .lb-info p { color: #b2bec3; font-size: 0.8rem; }
    .lb-score { display: flex; align-items: center; gap: 6px; }
    .score-star { font-size: 1.3rem; }
    .score-num { font-size: 1.4rem; font-weight: 700; color: #f57f17; }
    
    [dir="rtl"] .lb-card:hover { transform: translateX(-4px); }
  `]
})
export class LeaderboardComponent implements OnInit {
  children: User[] = [];
  loading = true;
  public i18n = inject(I18nService);

  constructor(private userSvc: UserService) {}

  ngOnInit() {
    this.userSvc.getLeaderboard().subscribe({ next: c => { this.children = c; this.loading = false; }, error: () => this.loading = false });
  }

  getAvatar(child: User): string {
    const url = child.avatarUrl;
    if (url?.startsWith('/uploads')) {
      return `http://localhost:5000${url}`;
    }
    return url || 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=' + encodeURIComponent(child.fullName);
  }
}
