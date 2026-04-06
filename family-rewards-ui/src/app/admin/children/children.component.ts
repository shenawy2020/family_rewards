import { environment } from '../../../environments/environment';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { forkJoin } from 'rxjs';
import { UserService } from '../../core/services/user.service';
import { WalletService, PenaltyService } from '../../core/services/reward-wallet-penalty.service';
import { User, UpdateChildDto, ResetPasswordDto } from '../../core/models/user.model';
import { Transaction, Penalty } from '../../core/models/reward.model';
import { I18nService } from '../../core/services/i18n.service';

interface ActivityItem {
  date: string;
  type: 'reward' | 'penalty';
  amount: number;
  description: string;
}

@Component({
  selector: 'app-children',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule,
    MatIconModule, MatFormFieldModule, MatInputModule, MatDialogModule,
    MatSnackBarModule, MatProgressSpinnerModule, MatMenuModule],
  template: `
    <div class="animate-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">👨‍👩‍👧‍👦 {{ i18n.t('children.title') }}</h1>
          <p class="page-subtitle">{{ i18n.t('children.subtitle') }}</p>
        </div>
        <button mat-raised-button class="btn-primary" (click)="showForm = !showForm">
          <mat-icon>{{ showForm ? 'close' : 'person_add' }}</mat-icon>
          {{ showForm ? i18n.t('common.cancel') : i18n.t('children.addMember') }}
        </button>
      </div>

      @if (showForm) {
        <mat-card class="add-form-card animate-in">
          <mat-card-header><mat-card-title>➕ {{ i18n.t('children.addNew') }}</mat-card-title></mat-card-header>
          <mat-card-content>
            <form [formGroup]="form" (ngSubmit)="addChild()" class="form-grid">
              <mat-form-field appearance="outline">
                <mat-label>{{ i18n.t('common.fullName') }}</mat-label>
                <mat-icon matPrefix>person</mat-icon>
                <input matInput formControlName="fullName">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>{{ i18n.t('common.password') }}</mat-label>
                <mat-icon matPrefix>lock</mat-icon>
                <input matInput type="password" formControlName="password">
              </mat-form-field>
              <div class="role-selector" style="grid-column: 1/-1; margin-bottom: 16px;">
                <label>
                  <input type="checkbox" formControlName="isAdmin" style="margin-right: 8px;">
                  {{ i18n.t('children.adminPrivileges') }}
                </label>
              </div>
              <div class="form-actions">
                <p class="helper-text" style="grid-column: 1/-1; text-align: start; color: #636e72;">
                  * {{ i18n.t('children.autoLoginCode') }}
                </p>
                <button mat-raised-button class="btn-primary" type="submit" [disabled]="submitting || form.invalid">
                  @if (submitting) { <mat-spinner diameter="20"></mat-spinner> }
                  @else { <span><mat-icon>save</mat-icon> {{ i18n.t('children.addMember') }}</span> }
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
      }

      @if (loading) {
        <div style="text-align:center;padding:64px"><mat-spinner></mat-spinner></div>
      } @else if (children.length === 0) {
        <div class="empty-state">
          <mat-icon>child_care</mat-icon>
          <h3>{{ i18n.t('children.noChildren') }}</h3>
          <p>{{ i18n.t('children.addFirst') }}</p>
        </div>
      } @else {
        <div class="cards-grid">
          @for (child of children; track child.id) {
            <mat-card class="child-card animate-in" [class.is-admin]="child.role === 'Admin'">
              <button mat-icon-button class="child-menu-btn" [matMenuTriggerFor]="menu">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #menu="matMenu">
                <button mat-menu-item (click)="editName(child)">
                  <mat-icon>edit</mat-icon>
                  <span>{{ i18n.t('children.editName') }}</span>
                </button>
                <button mat-menu-item (click)="uploadAvatarPrompt(child)">
                  <mat-icon>photo_camera</mat-icon>
                  <span>{{ i18n.t('children.uploadAvatar') }}</span>
                </button>
                <button mat-menu-item (click)="resetPassword(child)">
                  <mat-icon>lock_reset</mat-icon>
                  <span>{{ i18n.t('children.resetPassword') }}</span>
                </button>
                <button mat-menu-item (click)="toggleLog(child)">
                  <mat-icon>history</mat-icon>
                  <span>{{ i18n.t('children.viewLog') }}</span>
                </button>
              </mat-menu>

              <div class="child-avatar-wrap">
                <img [src]="getAvatar(child)"
                     [alt]="child.fullName" class="child-avatar">
                <div class="child-rank">⭐</div>
              </div>
              <div class="child-info">
                <h3>{{ child.fullName }} @if (child.role === 'Admin') { <span class="badge-admin">Admin</span> }</h3>
                <div class="login-code-box">
                  <span class="label">{{ i18n.t('common.loginCode') }}:</span>
                  <span class="code">{{ child.loginCode }}</span>
                </div>
                @if (child.role !== 'Admin') {
                  <div class="stars-display mt-2">
                    <mat-icon>star</mat-icon>
                    <span>{{ child.starBalance }} {{ i18n.t('common.stars') }}</span>
                  </div>
                }
                <!-- Activity Log Button -->
                <button mat-stroked-button class="log-btn" (click)="toggleLog(child)">
                  <mat-icon>history</mat-icon> {{ i18n.t('children.viewLog') }}
                </button>
              </div>
            </mat-card>
          }
        </div>
      }

      <!-- Activity Log Panel -->
      @if (logChild) {
        <mat-card class="activity-log-card animate-in">
          <mat-card-header>
            <mat-card-title>📋 {{ i18n.t('children.activityLog') }} {{ logChild.fullName }}</mat-card-title>
            <button mat-icon-button style="margin-inline-start: auto;" (click)="logChild = null; activityLog = []">
              <mat-icon>close</mat-icon>
            </button>
          </mat-card-header>
          <mat-card-content>
            @if (logLoading) {
              <div style="text-align:center;padding:32px"><mat-spinner diameter="32"></mat-spinner></div>
            } @else if (activityLog.length === 0) {
              <div style="text-align:center;padding:32px;color:#b2bec3">
                <p>{{ i18n.t('children.noActivity') }}</p>
              </div>
            } @else {
              <div class="log-list">
                @for (item of activityLog; track item.date + item.description) {
                  <div class="log-item" [class.log-reward]="item.type === 'reward'" [class.log-penalty]="item.type === 'penalty'">
                    <div class="log-icon">{{ item.type === 'reward' ? '⭐' : '⚠️' }}</div>
                    <div class="log-details">
                      <div class="log-desc">{{ item.description }}</div>
                      <div class="log-date">{{ item.date | date:'MMM d, y - h:mm a' }}</div>
                    </div>
                    <div class="log-amount" [class.positive]="item.type === 'reward'" [class.negative]="item.type === 'penalty'">
                      {{ item.type === 'reward' ? '+' : '-' }}{{ item.amount }}
                    </div>
                  </div>
                }
              </div>
            }
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .add-form-card { margin-bottom: 24px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 16px; }
    .form-actions { grid-column: 1/-1; display: flex; justify-content: space-between; align-items: center; }
    .child-card { cursor: default; transition: all 0.3s; text-align: center; padding: 24px !important; position: relative; }
    .child-card:hover { transform: translateY(-6px); border-color: var(--accent-teal) !important; box-shadow: 0 8px 24px rgba(0,0,0,0.1) !important; }
    .child-menu-btn { position: absolute; top: 8px; right: 8px; color: #b2bec3; }
    .child-avatar-wrap { position: relative; display: inline-block; margin-bottom: 16px; }
    .child-avatar { width: 80px; height: 80px; border-radius: 50%; border: 3px solid var(--accent-teal); background: white; object-fit: cover; }
    .child-rank { position: absolute; bottom: -4px; right: -4px; font-size: 1.2rem; }
    .child-info h3 { font-size: 1.2rem; font-weight: 700; margin-bottom: 8px; }
    .login-code-box { background: #f1f2f6; padding: 6px 12px; border-radius: 8px; display: inline-block; margin-bottom: 12px; border: 1px dashed #ced6e0; }
    .login-code-box .label { font-size: 0.75rem; color: #636e72; margin-right: 4px; }
    .login-code-box .code { font-weight: 700; color: #2d3436; font-family: monospace; font-size: 0.9rem; }
    .mt-2 { margin-top: 8px; }
    .badge-admin { background: #e0e0e0; color: #616161; font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; vertical-align: middle; margin-left: 4px; }
    .child-card.is-admin { border-top: 4px solid #9e9e9e !important; }

    .log-btn {
      margin-top: 12px;
      border-radius: 12px !important;
      font-family: 'Fredoka', sans-serif !important;
      font-size: 0.8rem;
    }

    /* Activity Log */
    .activity-log-card { margin-top: 24px; }
    .activity-log-card mat-card-header { display: flex; align-items: center; }
    .log-list { max-height: 400px; overflow-y: auto; }
    .log-item {
      display: flex; align-items: center; gap: 14px;
      padding: 14px 16px;
      border-bottom: 1px solid rgba(0,0,0,0.06);
      transition: background 0.2s;
    }
    .log-item:hover { background: rgba(0,0,0,0.02); }
    .log-item:last-child { border-bottom: none; }
    .log-icon { font-size: 1.5rem; flex-shrink: 0; }
    .log-details { flex: 1; }
    .log-desc { font-weight: 600; font-size: 0.9rem; }
    .log-date { color: #b2bec3; font-size: 0.75rem; margin-top: 2px; }
    .log-amount { font-weight: 700; font-size: 1.1rem; min-width: 60px; text-align: end; }
    .log-amount.positive { color: #2e7d32; }
    .log-amount.negative { color: #c62828; }
    .log-reward { border-left: 3px solid #4caf50; }
    .log-penalty { border-left: 3px solid #ef5350; }

    @media(max-width: 768px) {
      .form-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class ChildrenComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userSvc = inject(UserService);
  private walletSvc = inject(WalletService);
  private penaltySvc = inject(PenaltyService);
  private snack = inject(MatSnackBar);
  public i18n = inject(I18nService);

  children: User[] = [];
  loading = true;
  showForm = false;
  submitting = false;
  
  // Activity log
  logChild: User | null = null;
  activityLog: ActivityItem[] = [];
  logLoading = false;
  
  form = this.fb.group({
    fullName: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    isAdmin: [false]
  });

  ngOnInit() { this.load(); }
  
  load() {
    this.loading = true;
    this.userSvc.getChildren().subscribe({ 
      next: c => { this.children = c; this.loading = false; }, 
      error: () => this.loading = false 
    });
  }

  addChild() {
    if (this.form.invalid) return;
    this.submitting = true;
    this.userSvc.addChild(this.form.value as any).subscribe({
      next: (res) => {
        this.snack.open(`Child added! 🎉 Login Code: ${res.loginCode}`, 'Close', { duration: 8000 });
        this.form.reset(); this.showForm = false; this.submitting = false; this.load();
      },
      error: (e) => { this.snack.open(e.error?.message || 'Error', 'Close', { duration: 4000 }); this.submitting = false; }
    });
  }

  editName(child: User) {
    const newName = prompt("Enter new full name:", child.fullName);
    if (newName && newName.trim() !== child.fullName) {
      const dto: UpdateChildDto = { fullName: newName.trim() };
      this.userSvc.updateChild(child.id, dto).subscribe({
        next: () => {
          this.snack.open('Name updated successfully!', 'Close', { duration: 3000 });
          this.load();
        },
        error: () => this.snack.open('Error updating name', 'Close', { duration: 3000 })
      });
    }
  }

  resetPassword(child: User) {
    const newPass = prompt(`Enter new password for ${child.fullName}:`);
    if (newPass && newPass.length >= 6) {
      const dto: ResetPasswordDto = { newPassword: newPass };
      this.userSvc.resetPassword(child.id, dto).subscribe({
        next: () => this.snack.open('Password reset successfully!', 'Close', { duration: 3000 }),
        error: () => this.snack.open('Error resetting password', 'Close', { duration: 3000 })
      });
    } else if (newPass) {
      alert("Password must be at least 6 characters.");
    }
  }

  getAvatar(child: User): string {
    if (child.avatarUrl?.startsWith('/uploads')) {
      return `${environment.apiUrl.replace('/api', '')}${child.avatarUrl}`;
    }
    return child.avatarUrl || 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=' + encodeURIComponent(child.fullName);
  }

  uploadAvatarPrompt(child: User) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        this.snack.open('Uploading avatar...', '', { duration: 2000 });
        this.userSvc.uploadAvatar(child.id, file).subscribe({
          next: () => {
            this.snack.open('Avatar uploaded successfully! 📸', 'Close', { duration: 3000 });
            this.load();
          },
          error: () => this.snack.open('Error uploading avatar.', 'Close', { duration: 3000 })
        });
      }
    };
    input.click();
  }

  toggleLog(child: User) {
    if (this.logChild?.id === child.id) {
      this.logChild = null;
      this.activityLog = [];
      return;
    }
    this.logChild = child;
    this.logLoading = true;
    this.activityLog = [];

    forkJoin([
      this.walletSvc.getTransactions(child.id),
      this.penaltySvc.getPenalties(child.id)
    ]).subscribe({
      next: ([transactions, penalties]) => {
        const items: ActivityItem[] = [];
        
        for (const t of transactions) {
          items.push({
            date: t.createdAt,
            type: 'reward',
            amount: Math.abs(t.amount),
            description: t.description
          });
        }
        
        for (const p of penalties) {
          items.push({
            date: p.createdAt,
            type: 'penalty',
            amount: p.starsDeducted,
            description: `${p.reason} (by ${p.createdByName})`
          });
        }

        // Sort by date descending
        items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        this.activityLog = items;
        this.logLoading = false;
      },
      error: () => { this.logLoading = false; }
    });
  }
}
