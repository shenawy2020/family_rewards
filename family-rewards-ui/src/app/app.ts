import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule,
    MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, MatDividerModule],
  template: `
    <div class="app-shell">
      @if (auth.isLoggedIn) {
        <mat-toolbar class="app-toolbar">
          <div class="toolbar-left">
            <mat-icon class="logo-icon">star</mat-icon>
            <span class="app-title">Family Rewards</span>
          </div>
          <div class="toolbar-nav">
            @if (auth.isAdmin) {
              <a mat-button routerLink="/admin/dashboard" routerLinkActive="active-link">
                <mat-icon>dashboard</mat-icon> Dashboard
              </a>
              <a mat-button routerLink="/admin/children" routerLinkActive="active-link">
                <mat-icon>group</mat-icon> Children
              </a>
              <a mat-button routerLink="/admin/tasks" routerLinkActive="active-link">
                <mat-icon>assignment</mat-icon> Tasks
              </a>
              <a mat-button routerLink="/admin/rewards" routerLinkActive="active-link">
                <mat-icon>card_giftcard</mat-icon> Rewards
              </a>
              <a mat-button routerLink="/admin/penalties" routerLinkActive="active-link">
                <mat-icon>warning</mat-icon> Penalties
              </a>
            } @else {
              <a mat-button routerLink="/child/dashboard" routerLinkActive="active-link">
                <mat-icon>home</mat-icon> Home
              </a>
              <a mat-button routerLink="/child/tasks" routerLinkActive="active-link">
                <mat-icon>checklist</mat-icon> My Tasks
              </a>
              <a mat-button routerLink="/child/rewards" routerLinkActive="active-link">
                <mat-icon>store</mat-icon> Rewards
              </a>
              <a mat-button routerLink="/child/wallet" routerLinkActive="active-link">
                <mat-icon>account_balance_wallet</mat-icon> Wallet
              </a>
            }
            <a mat-button routerLink="/leaderboard" routerLinkActive="active-link">
              <mat-icon>emoji_events</mat-icon> Leaderboard
            </a>
          </div>
          <div class="toolbar-right">
            <button mat-icon-button [matMenuTriggerFor]="menu">
              <img [src]="auth.currentUser?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + auth.currentUser?.fullName"
                   class="avatar-img" [alt]="auth.currentUser?.fullName || 'User'">
            </button>
            <mat-menu #menu="matMenu">
              <div class="menu-header">
                <strong>{{ auth.currentUser?.fullName }}</strong>
                <span class="role-badge" [class.admin]="auth.isAdmin">{{ auth.currentUser?.role }}</span>
              </div>
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="auth.logout()">
                <mat-icon>logout</mat-icon> Logout
              </button>
            </mat-menu>
          </div>
        </mat-toolbar>
      }
      <main class="app-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-shell { min-height: 100vh; background: var(--bg-primary); }
    .app-toolbar {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%) !important;
      color: white;
      padding: 0 24px;
      height: 64px;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 4px 20px rgba(0,0,0,0.4);
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .toolbar-left { display: flex; align-items: center; gap: 8px; }
    .logo-icon { color: #ffd700; font-size: 28px; width: 28px; height: 28px; }
    .app-title { font-size: 1.3rem; font-weight: 700; background: linear-gradient(to right, #ffd700, #ff8c00); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .toolbar-nav { display: flex; align-items: center; gap: 4px; flex: 1; justify-content: center; }
    .toolbar-nav a { color: rgba(255,255,255,0.8); border-radius: 8px; transition: all 0.2s; font-size: 0.85rem; }
    .toolbar-nav a:hover, .toolbar-nav a.active-link { color: white; background: rgba(255,255,255,0.15); }
    .toolbar-right { margin-left: auto; }
    .avatar-img { width: 36px; height: 36px; border-radius: 50%; border: 2px solid rgba(255,215,0,0.6); }
    .menu-header { padding: 12px 16px; display: flex; flex-direction: column; gap: 4px; }
    .role-badge { font-size: 0.75rem; padding: 2px 8px; border-radius: 12px; background: rgba(103,58,183,0.2); color: #9c27b0; width: fit-content; }
    .role-badge.admin { background: rgba(255,215,0,0.2); color: #f57f17; }
    .app-content { padding: 24px; max-width: 1400px; margin: 0 auto; }
    @media(max-width: 768px) {
      .toolbar-nav { display: none; }
      .app-content { padding: 16px; }
    }
  `]
})
export class AppComponent {
  constructor(public auth: AuthService) {}
}
