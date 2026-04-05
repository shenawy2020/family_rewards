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

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatCardModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatSnackBarModule],
  template: `
    <div class="auth-page">
      <div class="auth-bg">
        <div class="star" *ngFor="let s of stars" [style.left.%]="s.x" [style.top.%]="s.y" [style.width.px]="s.size" [style.height.px]="s.size" [style.animation-delay.s]="s.delay"></div>
      </div>
      <div class="auth-container animate-in">
        <div class="auth-logo">
          <mat-icon class="logo-star">star</mat-icon>
          <h1>Family Rewards</h1>
          <p>Sign in to manage your family's rewards</p>
        </div>
        <mat-card class="auth-card">
          <mat-card-content>
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <mat-icon matPrefix>email</mat-icon>
                <input matInput type="email" formControlName="email" placeholder="you@family.com">
                <mat-error *ngIf="form.get('email')?.hasError('required')">Email is required</mat-error>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Password</mat-label>
                <mat-icon matPrefix>lock</mat-icon>
                <input matInput [type]="hidePass ? 'password' : 'text'" formControlName="password">
                <button mat-icon-button matSuffix type="button" (click)="hidePass = !hidePass">
                  <mat-icon>{{ hidePass ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
                <mat-error *ngIf="form.get('password')?.hasError('required')">Password is required</mat-error>
              </mat-form-field>
              <button mat-raised-button class="btn-primary submit-btn" type="submit" [disabled]="loading">
                @if (loading) {
                  <mat-spinner diameter="20"></mat-spinner>
                } @else {
                  <mat-icon>login</mat-icon> Sign In
                }
              </button>
            </form>
            <div class="auth-footer">
              Don't have an account? <a routerLink="/auth/register">Create Family</a>
            </div>
          </mat-card-content>
        </mat-card>
        <div class="demo-accounts">
          <p>Demo accounts:</p>
          <button mat-stroked-button (click)="fillDemo('father@family.com', 'Admin@123')" class="demo-btn">👨 Father</button>
          <button mat-stroked-button (click)="fillDemo('emma@family.com', 'Child@123')" class="demo-btn">👧 Emma</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
    .auth-bg { position: fixed; inset: 0; background: radial-gradient(ellipse at top, #1a1a2e 0%, #0d0d1a 100%); }
    .star { position: absolute; background: white; border-radius: 50%; opacity: 0; animation: twinkle 3s infinite; }
    @keyframes twinkle { 0%,100%{ opacity:0; } 50%{ opacity:0.8; } }
    .auth-container { position: relative; z-index: 1; width: 100%; max-width: 440px; padding: 24px; }
    .auth-logo { text-align: center; margin-bottom: 32px; }
    .logo-star { font-size: 56px; width: 56px; height: 56px; color: #ffd700; filter: drop-shadow(0 0 12px rgba(255,215,0,0.6)); animation: pulse-gold 2s infinite; }
    .auth-logo h1 { font-size: 2rem; font-weight: 800; background: linear-gradient(to right, #ffd700, #ff8c00); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 8px 0 4px; }
    .auth-logo p { color: #94a3b8; font-size: 0.9rem; }
    .auth-card { padding: 8px; }
    mat-form-field { width: 100%; margin-bottom: 8px; }
    .submit-btn { width: 100%; height: 48px; font-size: 1rem; margin-top: 8px; display: flex; align-items: center; justify-content: center; gap: 8px; }
    .auth-footer { text-align: center; margin-top: 20px; color: #94a3b8; font-size: 0.9rem; }
    .auth-footer a { color: #7c3aed; text-decoration: none; font-weight: 600; }
    .demo-accounts { margin-top: 16px; text-align: center; }
    .demo-accounts p { color: #64748b; font-size: 0.8rem; margin-bottom: 8px; }
    .demo-btn { margin: 0 4px; color: #94a3b8 !important; border-color: rgba(255,255,255,0.1) !important; font-size: 0.8rem; }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });
  loading = false;
  hidePass = true;
  stars = Array.from({ length: 50 }, () => ({
    x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 3 + 1, delay: Math.random() * 5
  }));

  constructor() {}

  fillDemo(email: string, pass: string) {
    this.form.patchValue({ email, password: pass });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.auth.login(this.form.value as any).subscribe({
      next: (res) => {
        this.snack.open(`Welcome back, ${res.fullName}! 🌟`, 'Close', { duration: 3000, panelClass: ['snack-success'] });
        this.router.navigate([res.role === 'Admin' ? '/admin/dashboard' : '/child/dashboard']);
      },
      error: (e) => {
        this.snack.open(e.error?.message || 'Login failed', 'Close', { duration: 4000, panelClass: ['snack-error'] });
        this.loading = false;
      }
    });
  }
}
