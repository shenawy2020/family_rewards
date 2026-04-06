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
        <nav class="app-nav">
          <div class="nav-inner">
            <a routerLink="/" class="nav-brand">
              <span class="brand-star">⭐</span>
              <span class="brand-text">Family Rewards</span>
            </a>
            <div class="nav-links">
              @if (auth.isAdmin) {
                <a routerLink="/admin/dashboard" routerLinkActive="active-link" class="nav-link">
                  <span class="link-icon">📊</span> Dashboard
                </a>
                <a routerLink="/admin/children" routerLinkActive="active-link" class="nav-link">
                  <span class="link-icon">👨‍👩‍👧‍👦</span> Children
                </a>
                <a routerLink="/admin/tasks" routerLinkActive="active-link" class="nav-link">
                  <span class="link-icon">✅</span> Tasks
                </a>
                <a routerLink="/admin/stars" routerLinkActive="active-link" class="nav-link">
                  <span class="link-icon">🌟</span> Stars
                </a>
                <a routerLink="/admin/rewards" routerLinkActive="active-link" class="nav-link">
                  <span class="link-icon">🎁</span> Rewards
                </a>
                <a routerLink="/admin/penalties" routerLinkActive="active-link" class="nav-link">
                  <span class="link-icon">⚠️</span> Penalties
                </a>
              } @else {
                <a routerLink="/child/dashboard" routerLinkActive="active-link" class="nav-link">
                  <span class="link-icon">🏠</span> Home
                </a>
                <a routerLink="/child/tasks" routerLinkActive="active-link" class="nav-link">
                  <span class="link-icon">📋</span> My Tasks
                </a>
                <a routerLink="/child/rewards" routerLinkActive="active-link" class="nav-link">
                  <span class="link-icon">🏪</span> Store
                </a>
                <a routerLink="/child/wallet" routerLinkActive="active-link" class="nav-link">
                  <span class="link-icon">💰</span> Wallet
                </a>
              }
              <a routerLink="/leaderboard" routerLinkActive="active-link" class="nav-link">
                <span class="link-icon">🏆</span> Ranks
              </a>
            </div>
            <div class="nav-user">
              <button class="user-btn" [matMenuTriggerFor]="menu">
                <img [src]="auth.currentUser?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + auth.currentUser?.fullName"
                     class="user-avatar" [alt]="auth.currentUser?.fullName || 'User'">
                <span class="user-name">{{ auth.currentUser?.fullName }}</span>
                <mat-icon class="dropdown-arrow">expand_more</mat-icon>
              </button>
              <mat-menu #menu="matMenu">
                <div class="menu-header">
                  <span class="menu-name">{{ auth.currentUser?.fullName }}</span>
                  <span class="menu-role" [class.admin]="auth.isAdmin">{{ auth.isAdmin ? '👑 Admin' : '⭐ Child' }}</span>
                </div>
                <mat-divider></mat-divider>
                <button mat-menu-item (click)="auth.logout()">
                  <mat-icon>logout</mat-icon> Logout
                </button>
              </mat-menu>
            </div>
          </div>
        </nav>
      }
      <main class="app-content" [class.with-nav]="auth.isLoggedIn">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-shell { min-height: 100vh; background: var(--bg-primary); position: relative; }

    .app-nav {
      background: linear-gradient(135deg, #4dc9d6 0%, #45b7d1 40%, #42a5f5 100%);
      padding: 0 24px;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 4px 20px rgba(77,201,214,0.3);
    }
    .nav-inner {
      display: flex;
      align-items: center;
      gap: 16px;
      max-width: 1400px;
      margin: 0 auto;
      height: 64px;
    }

    .nav-brand {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      flex-shrink: 0;
    }
    .brand-star { font-size: 1.6rem; animation: float 3s infinite ease-in-out; }
    .brand-text { font-size: 1.3rem; font-weight: 700; color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.1); }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 4px;
      flex: 1;
      justify-content: center;
      flex-wrap: nowrap;
      overflow-x: auto;
    }
    .nav-link {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 8px 14px;
      border-radius: 12px;
      color: rgba(255,255,255,0.9);
      text-decoration: none;
      font-size: 0.88rem;
      font-weight: 500;
      transition: all 0.2s;
      white-space: nowrap;
    }
    .nav-link:hover { background: rgba(255,255,255,0.2); color: white; }
    .nav-link.active-link { background: rgba(255,255,255,0.3); color: white; font-weight: 600; }
    .link-icon { font-size: 1rem; }

    .nav-user { margin-left: auto; flex-shrink: 0; }
    .user-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255,255,255,0.2);
      border: 2px solid rgba(255,255,255,0.3);
      border-radius: 24px;
      padding: 4px 12px 4px 4px;
      cursor: pointer;
      transition: all 0.2s;
      color: white;
      font-family: 'Fredoka', sans-serif;
      font-size: 0.9rem;
    }
    .user-btn:hover { background: rgba(255,255,255,0.3); }
    .user-avatar { width: 32px; height: 32px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.6); }
    .user-name { font-weight: 500; }
    .dropdown-arrow { font-size: 18px; width: 18px; height: 18px; }

    .menu-header { padding: 12px 16px; display: flex; flex-direction: column; gap: 4px; }
    .menu-name { font-weight: 600; font-size: 1rem; }
    .menu-role { font-size: 0.8rem; color: var(--text-secondary); }

    .app-content { padding: 24px; max-width: 1400px; margin: 0 auto; position: relative; z-index: 1; }

    @media(max-width: 768px) {
      .nav-links { display: none; }
      .user-name { display: none; }
      .app-content { padding: 16px; }
    }
  `]
})
export class AppComponent {
  constructor(public auth: AuthService) {}
}
