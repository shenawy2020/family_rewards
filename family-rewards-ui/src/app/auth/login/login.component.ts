import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';
import { I18nService } from '../../core/services/i18n.service';

type ViewMode = 'login' | 'forgot-password' | 'reset-password';
type LoginTab = 'family' | 'child';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatCardModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatSnackBarModule],
  template: `
    <div class="auth-page">
      <div class="auth-bg">
        <div class="floating-star" *ngFor="let s of stars"
             [style.left.%]="s.x" [style.top.%]="s.y"
             [style.font-size.px]="s.size"
             [style.animation-delay.s]="s.delay"
             [style.animation-duration.s]="s.dur">{{ s.emoji }}</div>
      </div>
      
      <div class="auth-container animate-in">
        <div class="auth-logo">
          <span class="logo-star float">⭐</span>
          <h1>Family Rewards</h1>
          <!-- Add language toggle button in auth -->
          <button mat-button (click)="toggleLang()" class="lang-toggle">
             🌐 {{ i18n.currentLang === 'ar' ? 'English' : 'عربي' }}
          </button>
        </div>

        <mat-card class="auth-card">
          <!-- TABS -->
          @if (viewMode === 'login') {
            <div class="tabs">
              <button class="tab-btn" [class.active]="activeTab === 'family'" (click)="activeTab = 'family'">
                👨‍👩‍👧‍👦 {{ i18n.t('auth.familyLogin') }}
              </button>
              <button class="tab-btn" [class.active]="activeTab === 'child'" (click)="activeTab = 'child'">
                👧 {{ i18n.t('auth.childLogin') }}
              </button>
            </div>
          }

          <mat-card-content>
            <!-- LOGIN VIEW -->
            @if (viewMode === 'login') {
              <form [formGroup]="form" (ngSubmit)="onSubmit()">
                
                @if (activeTab === 'family') {
                  <mat-form-field appearance="outline">
                    <mat-label>{{ i18n.t('auth.email') }}</mat-label>
                    <mat-icon matPrefix>email</mat-icon>
                    <input matInput type="email" formControlName="loginId">
                  </mat-form-field>
                } @else {
                  <mat-form-field appearance="outline">
                    <mat-label>{{ i18n.t('auth.loginId') }}</mat-label>
                    <mat-icon matPrefix>person</mat-icon>
                    <input matInput type="text" formControlName="loginId">
                  </mat-form-field>
                }

                <mat-form-field appearance="outline">
                  <mat-label>{{ i18n.t('common.password') }}</mat-label>
                  <mat-icon matPrefix>lock</mat-icon>
                  <input matInput [type]="hidePass ? 'password' : 'text'" formControlName="password">
                  <button mat-icon-button matSuffix type="button" (click)="hidePass = !hidePass">
                    <mat-icon>{{ hidePass ? 'visibility_off' : 'visibility' }}</mat-icon>
                  </button>
                </mat-form-field>

                @if (activeTab === 'family') {
                  <div class="forgot-link">
                    <a href="javascript:void(0)" (click)="setViewMode('forgot-password')">{{ i18n.t('auth.forgotPassword') }}</a>
                  </div>
                }

                <button mat-raised-button class="btn-green submit-btn" type="submit" [disabled]="loading || !form.value.loginId || !form.value.password">
                  @if (loading) { <mat-spinner diameter="20"></mat-spinner> } 
                  @else { 🚀 {{ i18n.t('auth.login') }} }
                </button>
              </form>
            }

            <!-- FORGOT PASSWORD VIEW -->
            @if (viewMode === 'forgot-password') {
              <div class="view-header">
                <h3>{{ i18n.t('auth.resetPassword') }}</h3>
                <p>Enter your family admin email to receive a reset link.</p>
              </div>
              <form [formGroup]="forgotForm" (ngSubmit)="onForgotSubmit()">
                <mat-form-field appearance="outline">
                  <mat-label>{{ i18n.t('auth.email') }}</mat-label>
                  <mat-icon matPrefix>email</mat-icon>
                  <input matInput type="email" formControlName="email">
                </mat-form-field>
                <button mat-raised-button class="btn-primary submit-btn" type="submit" [disabled]="loading || !forgotForm.value.email">
                  @if (loading) { <mat-spinner diameter="20"></mat-spinner> }
                  @else { Send Reset Link }
                </button>
                <button mat-button class="full-width mt-2" type="button" (click)="setViewMode('login')" [disabled]="loading">Back to Login</button>
              </form>
            }

            <!-- RESET PASSWORD VIEW -->
            @if (viewMode === 'reset-password') {
              <div class="view-header">
                <h3>Enter new password</h3>
                <p>Use the token sent to your email.</p>
              </div>
              <form [formGroup]="resetForm" (ngSubmit)="onResetSubmit()">
                <mat-form-field appearance="outline">
                  <mat-label>{{ i18n.t('auth.email') }}</mat-label>
                  <mat-icon matPrefix>email</mat-icon>
                  <input matInput type="email" formControlName="email">
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Reset Token</mat-label>
                  <mat-icon matPrefix>key</mat-icon>
                  <input matInput type="text" formControlName="token">
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>New Password</mat-label>
                  <mat-icon matPrefix>lock</mat-icon>
                  <input matInput [type]="hidePass ? 'password' : 'text'" formControlName="newPassword">
                  <button mat-icon-button matSuffix type="button" (click)="hidePass = !hidePass">
                    <mat-icon>{{ hidePass ? 'visibility_off' : 'visibility' }}</mat-icon>
                  </button>
                </mat-form-field>
                <button mat-raised-button class="btn-green submit-btn" type="submit" [disabled]="loading || resetForm.invalid">
                  @if (loading) { <mat-spinner diameter="20"></mat-spinner> }
                  @else { Change Password }
                </button>
                <button mat-button class="full-width mt-2" type="button" (click)="setViewMode('login')" [disabled]="loading">Back to Login</button>
              </form>
            }

            <div class="auth-footer" *ngIf="viewMode === 'login'">
              {{ i18n.t('auth.dontHave') }} <a routerLink="/auth/register">{{ i18n.t('auth.createAccount') }}</a>
            </div>
          </mat-card-content>
        </mat-card>
        
        <div class="demo-accounts" *ngIf="viewMode === 'login'">
          <p>✨ Demo accounts:</p>
          <button class="demo-btn" (click)="fillDemo('father@family.com', 'Admin@123', 'family')">👨 Father (Admin)</button>
          <button class="demo-btn" (click)="fillDemo('fam0000001-01', 'Child@123', 'child')">👧 Emma (Child)</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
    .auth-bg {
      position: fixed; inset: 0;
      background: linear-gradient(135deg, #e8f6f8 0%, #d4f0f5 30%, #c8e6f5 60%, #e0f0ff 100%);
    }
    .floating-star { position: absolute; opacity: 0.5; animation: floatStar linear infinite; pointer-events: none; }
    @keyframes floatStar { 0% { transform: translateY(0) rotate(0deg); opacity: 0.3; } 50% { opacity: 0.7; } 100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; } }
    .auth-container { position: relative; z-index: 1; width: 100%; max-width: 440px; padding: 24px; }
    .auth-logo { text-align: center; margin-bottom: 28px; }
    .logo-star { font-size: 56px; display: block; margin-bottom: 8px; }
    .auth-logo h1 { font-size: 2rem; font-weight: 700; color: #2d3436; margin: 8px 0 4px; }
    .lang-toggle { margin-top: 8px; font-family: 'Fredoka', sans-serif; }
    
    .auth-card { padding: 0 !important; border: 2px solid rgba(77,201,214,0.3) !important; overflow: hidden; border-radius: 20px !important; }
    .tabs { display: flex; border-bottom: 2px solid #edf2f7; background: #fafbfc; }
    .tab-btn { flex: 1; padding: 16px; border: none; background: transparent; font-family: 'Fredoka', sans-serif; font-size: 1.05rem; font-weight: 600; color: #a0aec0; cursor: pointer; transition: 0.3s; }
    .tab-btn.active { color: var(--accent-teal); background: white; border-bottom: 3px solid var(--accent-teal); }
    .tab-btn:hover:not(.active) { color: #718096; background: #f7fafc; }
    
    mat-card-content { padding: 24px !important; }
    mat-form-field { width: 100%; margin-bottom: -4px; }
    
    .forgot-link { text-align: right; margin-bottom: 12px; margin-top: -8px; }
    [dir="rtl"] .forgot-link { text-align: left; }
    .forgot-link a { color: var(--accent-teal); text-decoration: none; font-size: 0.85rem; font-weight: 600; }
    .forgot-link a:hover { text-decoration: underline; }
    
    .view-header { text-align: center; margin-bottom: 20px; }
    .view-header h3 { font-size: 1.3rem; font-weight: 700; color: #2d3436; margin: 0 0 8px; }
    .view-header p { font-size: 0.9rem; color: #636e72; margin: 0; }
    
    .submit-btn {
      width: 100%; height: 52px; font-size: 1.1rem; margin-top: 8px;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      border-radius: 16px !important; font-family: 'Fredoka', sans-serif !important;
    }
    .full-width { width: 100%; }
    .mt-2 { margin-top: 12px; }
    
    .auth-footer { text-align: center; margin-top: 20px; color: #636e72; font-size: 0.9rem; }
    .auth-footer a { color: var(--accent-teal); text-decoration: none; font-weight: 600; }
    
    .demo-accounts { margin-top: 20px; text-align: center; }
    .demo-accounts p { color: #636e72; font-size: 0.85rem; margin-bottom: 10px; font-weight: 500; }
    .demo-btn { margin: 0 4px; padding: 8px 16px; border: 2px solid rgba(77,201,214,0.3); background: white; border-radius: 12px; cursor: pointer; font-family: 'Fredoka', sans-serif; font-size: 0.85rem; color: #2d3436; transition: all 0.2s; }
    .demo-btn:hover { border-color: var(--accent-teal); background: #e0f7fa; transform: translateY(-2px); }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);
  public i18n = inject(I18nService);

  viewMode: ViewMode = 'login';
  activeTab: LoginTab = 'family';
  loading = false;
  hidePass = true;

  form = this.fb.group({
    loginId: [''],
    password: ['']
  });

  forgotForm = this.fb.group({
    email: ['']
  });

  resetForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    token: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(6)]]
  });

  emojis = ['⭐', '🌟', '✨', '💫', '🎯', '🎁', '🏆', '🌈'];
  stars = Array.from({ length: 30 }, () => ({
    x: Math.random() * 100, y: Math.random() * 100 + 100,
    size: Math.random() * 20 + 14,
    delay: Math.random() * 8,
    dur: Math.random() * 6 + 8,
    emoji: this.emojis[Math.floor(Math.random() * this.emojis.length)]
  }));

  toggleLang() {
    this.i18n.setLanguage(this.i18n.currentLang === 'en' ? 'ar' : 'en');
  }

  setViewMode(mode: ViewMode) {
    this.viewMode = mode;
    this.form.reset();
    this.forgotForm.reset();
    this.resetForm.reset();
  }

  fillDemo(loginId: string, pass: string, tab: LoginTab) {
    this.activeTab = tab;
    this.form.patchValue({ loginId, password: pass });
  }

  onSubmit() {
    if (!this.form.value.loginId || !this.form.value.password) return;
    this.loading = true;
    this.auth.login(this.form.value as any).subscribe({
      next: (res) => {
        this.snack.open(`${this.i18n.t('adminDashboard.welcome')}, ${res.fullName}! 🌟`, this.i18n.t('common.close'), { duration: 3000 });
        this.router.navigate([res.role === 'Admin' ? '/admin/dashboard' : '/child/dashboard']);
      },
      error: (e) => {
        this.snack.open(e.error?.message || this.i18n.t('common.error'), this.i18n.t('common.close'), { duration: 4000 });
        this.loading = false;
      }
    });
  }

  onForgotSubmit() {
    if (!this.forgotForm.value.email) return;
    this.loading = true;
    this.auth.forgotPassword(this.forgotForm.value.email).subscribe({
      next: (res) => {
        this.snack.open(res.message, this.i18n.t('common.close'), { duration: 5000 });
        this.loading = false;
        this.resetForm.patchValue({ email: this.forgotForm.value.email });
        this.setViewMode('reset-password');
      },
      error: (e) => {
        this.snack.open(e.error?.message || this.i18n.t('common.error'), this.i18n.t('common.close'), { duration: 4000 });
        this.loading = false;
      }
    });
  }

  onResetSubmit() {
    if (this.resetForm.invalid) return;
    this.loading = true;
    const { email, token, newPassword } = this.resetForm.value;
    this.auth.resetPassword(email!, token!, newPassword!).subscribe({
      next: (res) => {
        this.snack.open(res.message, this.i18n.t('common.close'), { duration: 5000 });
        this.setViewMode('login');
        this.loading = false;
      },
      error: (e) => {
        this.snack.open(e.error?.message || this.i18n.t('common.error'), this.i18n.t('common.close'), { duration: 4000 });
        this.loading = false;
      }
    });
  }
}
