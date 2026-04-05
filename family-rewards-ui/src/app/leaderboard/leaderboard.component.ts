import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../core/services/user.service';
import { User } from '../core/models/user.model';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="animate-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">🏆 Leaderboard</h1>
          <p class="page-subtitle">Who's the star of the family?</p>
        </div>
      </div>

      @if (loading) {
        <div style="text-align:center;padding:64px"><mat-spinner></mat-spinner></div>
      } @else {
        <div class="leaderboard-list">
          @for (child of children; track child.id; let i = $index) {
            <mat-card class="lb-card animate-in" [class]="'rank-' + (i+1)">
              <div class="lb-rank">
                @if (i === 0) { 🥇 }
                @else if (i === 1) { 🥈 }
                @else if (i === 2) { 🥉 }
                @else { <span class="rank-num">#{{ i + 1 }}</span> }
              </div>
              <img [src]="child.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + child.fullName"
                   [alt]="child.fullName" class="lb-avatar">
              <div class="lb-info">
                <h3>{{ child.fullName }}</h3>
                <p>{{ child.email }}</p>
              </div>
              <div class="lb-score">
                <mat-icon>star</mat-icon>
                <span>{{ child.starBalance }}</span>
              </div>
            </mat-card>
          }

          @if (children.length === 0) {
            <div class="empty-state">
              <mat-icon>emoji_events</mat-icon>
              <h3>No children yet</h3>
              <p>Add children to see the leaderboard!</p>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .leaderboard-list { display: flex; flex-direction: column; gap: 16px; max-width: 700px; margin: 0 auto; }
    .lb-card { display: flex; align-items: center; gap: 20px; padding: 20px 24px !important; transition: all 0.3s; }
    .lb-card:hover { transform: translateX(4px); }
    .lb-card.rank-1 { border-color: #ffd700 !important; box-shadow: 0 0 30px rgba(255,215,0,0.2) !important; background: linear-gradient(135deg, #1a1a2e, #1a1508) !important; }
    .lb-card.rank-2 { border-color: #94a3b8 !important; }
    .lb-card.rank-3 { border-color: #cd7f32 !important; }
    .lb-rank { font-size: 2.5rem; min-width: 60px; text-align: center; }
    .rank-num { font-size: 1.2rem; font-weight: 700; color: #64748b; }
    .lb-avatar { width: 60px; height: 60px; border-radius: 50%; border: 3px solid rgba(255,255,255,0.2); }
    .lb-card.rank-1 .lb-avatar { border-color: #ffd700; }
    .lb-info { flex: 1; }
    .lb-info h3 { font-size: 1.1rem; font-weight: 700; }
    .lb-info p { color: #64748b; font-size: 0.85rem; }
    .lb-score { display: flex; align-items: center; gap: 6px; font-size: 1.4rem; font-weight: 800; color: #ffd700; }
  `]
})
export class LeaderboardComponent implements OnInit {
  children: User[] = [];
  loading = true;

  constructor(private userSvc: UserService) {}

  ngOnInit() {
    this.userSvc.getLeaderboard().subscribe({ next: c => { this.children = c; this.loading = false; }, error: () => this.loading = false });
  }
}
