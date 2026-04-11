import { environment } from '../environments/environment';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { AuthService } from './core/services/auth.service';
import { I18nService } from './core/services/i18n.service';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule,
    MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, MatDividerModule, MatSidenavModule],
  template: `
    <mat-sidenav-container class="app-shell">
      <!-- Mobile Sidenav -->
      <mat-sidenav #sidenav mode="over" position="start" class="mobile-sidenav">
        <div class="sidenav-header">
          <span class="brand-star">⭐</span>
          <span class="sidenav-brand">{{ i18n.t('common.appName') }}</span>
        </div>
        <div class="sidenav-links">
          @if (auth.isLoggedIn) {
            @if (auth.isAdmin) {
              <a routerLink="/admin/dashboard" routerLinkActive="active-link" class="sidenav-link" (click)="sidenav.close()">
                <span>📊</span> {{ i18n.t('nav.dashboard') }}
              </a>
              <a routerLink="/admin/children" routerLinkActive="active-link" class="sidenav-link" (click)="sidenav.close()">
                <span>👨‍👩‍👧‍👦</span> {{ i18n.t('nav.children') }}
              </a>
              <a routerLink="/admin/tasks" routerLinkActive="active-link" class="sidenav-link" (click)="sidenav.close()">
                <span>✅</span> {{ i18n.t('nav.tasks') }}
              </a>
              <a routerLink="/admin/stars" routerLinkActive="active-link" class="sidenav-link" (click)="sidenav.close()">
                <span>🌟</span> {{ i18n.t('nav.stars') }}
              </a>
              <a routerLink="/admin/rewards" routerLinkActive="active-link" class="sidenav-link" (click)="sidenav.close()">
                <span>🎁</span> {{ i18n.t('nav.rewards') }}
              </a>
              <a routerLink="/admin/penalties" routerLinkActive="active-link" class="sidenav-link" (click)="sidenav.close()">
                <span>⚠️</span> {{ i18n.t('nav.penalties') }}
              </a>
            } @else {
              <a routerLink="/child/dashboard" routerLinkActive="active-link" class="sidenav-link" (click)="sidenav.close()">
                <span>🏠</span> {{ i18n.t('nav.home') }}
              </a>
              <a routerLink="/child/tasks" routerLinkActive="active-link" class="sidenav-link" (click)="sidenav.close()">
                <span>📋</span> {{ i18n.t('nav.myTasks') }}
              </a>
              <a routerLink="/child/wallet" routerLinkActive="active-link" class="sidenav-link" (click)="sidenav.close()">
                <span>💰</span> {{ i18n.t('nav.wallet') }}
              </a>
            }
            <a routerLink="/leaderboard" routerLinkActive="active-link" class="sidenav-link" (click)="sidenav.close()">
              <span>🏆</span> {{ i18n.t('nav.ranks') }}
            </a>
            <div class="sidenav-divider"></div>
            <button class="sidenav-link" (click)="toggleLang(); sidenav.close()">
              <span>🌐</span> {{ i18n.currentLang === 'ar' ? 'English' : 'عربي' }}
            </button>
            <button class="sidenav-link" (click)="showThemePicker = true; sidenav.close()">
              <span>🎨</span> {{ i18n.t('nav.theme') }}
            </button>
            <button class="sidenav-link logout-link" (click)="auth.logout(); sidenav.close()">
              <span>🚪</span> {{ i18n.t('nav.logout') }}
            </button>
          }
        </div>
      </mat-sidenav>

      <mat-sidenav-content>
        @if (auth.isLoggedIn) {
          <nav class="app-nav">
            <div class="nav-inner">
              <!-- Hamburger for mobile -->
              <button class="hamburger-btn" (click)="sidenav.toggle()">
                <mat-icon>menu</mat-icon>
              </button>
              <a routerLink="/" class="nav-brand">
                <span class="brand-star">⭐</span>
                <span class="brand-text">{{ i18n.t('common.appName') }}</span>
              </a>
              <div class="nav-links">
                @if (auth.isAdmin) {
                  <a routerLink="/admin/dashboard" routerLinkActive="active-link" class="nav-link">
                    <span class="link-icon">📊</span> {{ i18n.t('nav.dashboard') }}
                  </a>
                  <a routerLink="/admin/children" routerLinkActive="active-link" class="nav-link">
                    <span class="link-icon">👨‍👩‍👧‍👦</span> {{ i18n.t('nav.children') }}
                  </a>
                  <a routerLink="/admin/tasks" routerLinkActive="active-link" class="nav-link">
                    <span class="link-icon">✅</span> {{ i18n.t('nav.tasks') }}
                  </a>
                  <a routerLink="/admin/stars" routerLinkActive="active-link" class="nav-link">
                    <span class="link-icon">🌟</span> {{ i18n.t('nav.stars') }}
                  </a>
                  <a routerLink="/admin/rewards" routerLinkActive="active-link" class="nav-link">
                    <span class="link-icon">🎁</span> {{ i18n.t('nav.rewards') }}
                  </a>
                  <a routerLink="/admin/penalties" routerLinkActive="active-link" class="nav-link">
                    <span class="link-icon">⚠️</span> {{ i18n.t('nav.penalties') }}
                  </a>
                } @else {
                  <a routerLink="/child/dashboard" routerLinkActive="active-link" class="nav-link">
                    <span class="link-icon">🏠</span> {{ i18n.t('nav.home') }}
                  </a>
                  <a routerLink="/child/tasks" routerLinkActive="active-link" class="nav-link">
                    <span class="link-icon">📋</span> {{ i18n.t('nav.myTasks') }}
                  </a>
                  <a routerLink="/child/wallet" routerLinkActive="active-link" class="nav-link">
                    <span class="link-icon">💰</span> {{ i18n.t('nav.wallet') }}
                  </a>
                }
                <a routerLink="/leaderboard" routerLinkActive="active-link" class="nav-link">
                  <span class="link-icon">🏆</span> {{ i18n.t('nav.ranks') }}
                </a>
              </div>
              <div class="nav-actions">
                <!-- Language Toggle -->
                <button class="action-btn" (click)="toggleLang()" title="Toggle Language">
                  🌐
                </button>
                <!-- Theme picker -->
                <button class="action-btn" (click)="showThemePicker = !showThemePicker" title="Theme">
                  🎨
                </button>
                <!-- User Menu -->
                <button class="user-btn" [matMenuTriggerFor]="menu">
                  <img [src]="getNavAvatar()"
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
                    <mat-icon>logout</mat-icon> {{ i18n.t('nav.logout') }}
                  </button>
                </mat-menu>
              </div>
            </div>
          </nav>
        }

        <!-- Theme Picker Overlay -->
        @if (showThemePicker) {
          <div class="theme-overlay" (click)="showThemePicker = false">
            <div class="theme-picker" (click)="$event.stopPropagation()">
              <h3>{{ i18n.t('theme.pickColor') }}</h3>
              <div class="theme-swatches">
                @for (p of theme.palettes; track p.key) {
                  <button class="swatch" [style.background]="p.primary"
                          [class.active]="theme.currentTheme === p.key"
                          (click)="selectTheme(p.key)">
                    @if (theme.currentTheme === p.key) { <mat-icon>check</mat-icon> }
                  </button>
                }
              </div>
            </div>
          </div>
        }

        <main class="app-content" [class.with-nav]="auth.isLoggedIn">
          <router-outlet></router-outlet>
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .app-shell { min-height: 100vh; background: var(--bg-primary); }

    .app-nav {
      background: var(--nav-gradient, linear-gradient(135deg, #4dc9d6 0%, #45b7d1 40%, #42a5f5 100%));
      padding: 0 24px;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    }
    .nav-inner {
      display: flex;
      align-items: center;
      gap: 12px;
      max-width: 1400px;
      margin: 0 auto;
      height: 64px;
    }

    .hamburger-btn {
      display: none;
      background: rgba(255,255,255,0.2);
      border: none;
      border-radius: 12px;
      padding: 6px;
      cursor: pointer;
      color: white;
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
      font-size: 0.85rem;
      font-weight: 500;
      transition: all 0.2s;
      white-space: nowrap;
    }
    .nav-link:hover { background: rgba(255,255,255,0.2); color: white; }
    .nav-link.active-link { background: rgba(255,255,255,0.3); color: white; font-weight: 600; }
    .link-icon { font-size: 1rem; }

    .nav-actions { display: flex; align-items: center; gap: 8px; margin-left: auto; flex-shrink: 0; }

    .action-btn {
      background: rgba(255,255,255,0.15);
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 50%;
      width: 36px; height: 36px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      font-size: 1.1rem;
      transition: all 0.2s;
    }
    .action-btn:hover { background: rgba(255,255,255,0.3); }

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

    /* Mobile Sidenav */
    .mobile-sidenav {
      width: 280px;
      background: white !important;
      border-radius: 0 20px 20px 0;
    }
    [dir="rtl"] .mobile-sidenav { border-radius: 20px 0 0 20px; }
    .sidenav-header {
      padding: 24px;
      background: var(--nav-gradient, linear-gradient(135deg, #4dc9d6 0%, #45b7d1 40%, #42a5f5 100%));
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .sidenav-brand { font-size: 1.3rem; font-weight: 700; color: white; }
    .sidenav-links { padding: 16px 0; }
    .sidenav-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 24px;
      text-decoration: none;
      color: var(--text-primary);
      font-weight: 500;
      font-size: 0.95rem;
      transition: background 0.2s;
      width: 100%;
      background: none;
      border: none;
      cursor: pointer;
      font-family: 'Fredoka', sans-serif;
      text-align: start;
    }
    .sidenav-link:hover { background: var(--bg-primary); }
    .sidenav-link.active-link { background: var(--bg-primary); font-weight: 600; }
    .sidenav-link span:first-child { font-size: 1.2rem; }
    .sidenav-divider { height: 1px; background: var(--border); margin: 8px 24px; }
    .logout-link { color: #ef5350; }

    /* Theme Picker */
    .theme-overlay {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.4);
      z-index: 1000;
      display: flex; align-items: center; justify-content: center;
      animation: fadeIn 0.2s ease;
    }
    .theme-picker {
      background: white;
      border-radius: 24px;
      padding: 28px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
      min-width: 300px;
      text-align: center;
    }
    .theme-picker h3 { margin-bottom: 20px; font-size: 1.2rem; }
    .theme-swatches { display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; }
    .swatch {
      width: 52px; height: 52px; border-radius: 50%;
      border: 3px solid transparent;
      cursor: pointer; transition: all 0.2s;
      display: flex; align-items: center; justify-content: center;
      color: white;
    }
    .swatch:hover { transform: scale(1.15); }
    .swatch.active { border-color: #333; transform: scale(1.15); box-shadow: 0 4px 12px rgba(0,0,0,0.3); }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    @media(max-width: 768px) {
      .nav-links { display: none; }
      .user-name { display: none; }
      .hamburger-btn { display: flex; }
      .app-content { padding: 16px; }
      .action-btn { width: 32px; height: 32px; font-size: 0.95rem; }
    }
    @media(max-width: 480px) {
      .app-nav { padding: 0 12px; }
      .brand-text { font-size: 1.1rem; }
      .app-content { padding: 12px; }
    }
  `]
})
export class AppComponent implements OnInit {
  showThemePicker = false;
  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(public auth: AuthService, public i18n: I18nService, public theme: ThemeService) {}

  ngOnInit() {
    // Apply saved preferences from user data on login
    if (this.auth.currentUser) {
      const user = this.auth.currentUser as any;
      if (user.themeColor) this.theme.applyTheme(user.themeColor);
      if (user.language) this.i18n.setLanguage(user.language);
    }
  }

  toggleLang() {
    const newLang = this.i18n.currentLang === 'en' ? 'ar' : 'en';
    this.i18n.setLanguage(newLang);
    // Save to server
    const apiUrl = `\${environment.apiUrl.replace('/api', '')}/api/users/preferences`;
    // We'll use the user service's http client through the auth service approach
  }

  selectTheme(key: string) {
    this.theme.applyTheme(key);
    this.theme.saveToServer(key).subscribe();
    this.showThemePicker = false;
  }

  getNavAvatar(): string {
    const url = this.auth.currentUser?.avatarUrl;
    if (url?.startsWith('/uploads')) {
      return `${environment.apiUrl.replace('/api', '')}${url}`;
    }
    return url || 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=' + encodeURIComponent(this.auth.currentUser?.fullName || '');
  }
}
