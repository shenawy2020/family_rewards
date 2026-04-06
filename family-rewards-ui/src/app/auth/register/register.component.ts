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

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatCardModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatSnackBarModule],
  template: `
    <div class="auth-page">
      <div class="auth-bg"></div>
      <div class="auth-container animate-in">
        <div class="auth-logo">
          <span class="logo-icon float">👨‍👩‍👧‍👦</span>
          <h1>{{ i18n.t('auth.createAccount') }}</h1>
          <!-- Language Selection Toggle -->
          <button mat-button (click)="toggleLang()" class="lang-toggle">
             🌐 {{ i18n.currentLang === 'ar' ? 'English' : 'عربي' }}
          </button>
        </div>
        <mat-card class="auth-card">
          <mat-card-content>
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <mat-form-field appearance="outline">
                <mat-label>{{ i18n.t('auth.familyName') }}</mat-label>
                <mat-icon matPrefix>home</mat-icon>
                <input matInput formControlName="familyName">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>{{ i18n.t('common.fullName') }}</mat-label>
                <mat-icon matPrefix>person</mat-icon>
                <input matInput formControlName="fullName">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>{{ i18n.t('auth.email') }}</mat-label>
                <mat-icon matPrefix>email</mat-icon>
                <input matInput type="email" formControlName="email">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>{{ i18n.t('common.password') }}</mat-label>
                <mat-icon matPrefix>lock</mat-icon>
                <input matInput [type]="hidePass ? 'password' : 'text'" formControlName="password">
                <button mat-icon-button matSuffix type="button" (click)="hidePass = !hidePass">
                  <mat-icon>{{ hidePass ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
              </mat-form-field>
              <button mat-raised-button class="btn-green submit-btn" type="submit" [disabled]="loading || form.invalid">
                @if (loading) {
                  <mat-spinner diameter="20"></mat-spinner>
                } @else {
                  🏠 {{ i18n.t('auth.createAccount') }}
                }
              </button>
            </form>
            <div class="auth-footer">
              {{ i18n.t('auth.alreadyHave') }} <a routerLink="/auth/login">{{ i18n.t('auth.login') }}</a>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; }
    .auth-bg { position: fixed; inset: 0; background: linear-gradient(135deg, #e8f6f8 0%, #d4f0f5 30%, #c8e6f5 60%, #e0f0ff 100%); }
    .auth-container { position: relative; z-index: 1; width: 100%; max-width: 480px; padding: 24px; }
    .auth-logo { text-align: center; margin-bottom: 28px; }
    .logo-icon { font-size: 56px; display: block; margin-bottom: 8px; }
    .auth-logo h1 { font-size: 1.8rem; font-weight: 700; color: #2d3436; margin: 8px 0 4px; }
    .auth-logo p { color: #636e72; }
    .auth-card { border: 2px solid rgba(77,201,214,0.3) !important; padding: 20px !important; }
    .lang-toggle { font-family: 'Fredoka', sans-serif; }
    mat-form-field { width: 100%; margin-bottom: 4px; }
    .submit-btn { width: 100%; height: 52px; font-size: 1rem; margin-top: 8px; display: flex; align-items: center; justify-content: center; gap: 8px; border-radius: 16px !important; font-family: 'Fredoka', sans-serif !important; }
    .auth-footer { text-align: center; margin-top: 20px; color: #636e72; }
    .auth-footer a { color: var(--accent-teal); text-decoration: none; font-weight: 600; }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);
  public i18n = inject(I18nService);

  form = this.fb.group({
    familyName: ['', Validators.required],
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
  loading = false;
  hidePass = true;

  constructor() {}
  
  toggleLang() {
     this.i18n.setLanguage(this.i18n.currentLang === 'en' ? 'ar' : 'en');
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.auth.register(this.form.value as any).subscribe({
      next: (res) => {
        this.snack.open(`Family created! Code: ${res.familyCode} 🎉`, this.i18n.t('common.close'), { duration: 6000 });
        this.router.navigate(['/admin/dashboard']);
      },
      error: (e) => {
        this.snack.open(e.error?.message || this.i18n.t('common.error'), this.i18n.t('common.close'), { duration: 4000 });
        this.loading = false;
      }
    });
  }
}
