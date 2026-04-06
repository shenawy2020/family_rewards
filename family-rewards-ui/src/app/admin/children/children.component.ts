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
import { UserService } from '../../core/services/user.service';
import { User, UpdateChildDto, ResetPasswordDto } from '../../core/models/user.model';

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
          <h1 class="page-title">👨‍👩‍👧‍👦 Manage Family Members</h1>
          <p class="page-subtitle">Add and manage your family accounts (Children and Admins)</p>
        </div>
        <button mat-raised-button class="btn-primary" (click)="showForm = !showForm">
          <mat-icon>{{ showForm ? 'close' : 'person_add' }}</mat-icon>
          {{ showForm ? 'Cancel' : 'Add Member' }}
        </button>
      </div>

      @if (showForm) {
        <mat-card class="add-form-card animate-in">
          <mat-card-header><mat-card-title>➕ Add New Member</mat-card-title></mat-card-header>
          <mat-card-content>
            <form [formGroup]="form" (ngSubmit)="addChild()" class="form-grid">
              <mat-form-field appearance="outline">
                <mat-label>Full Name</mat-label>
                <mat-icon matPrefix>person</mat-icon>
                <input matInput formControlName="fullName" placeholder="Emma Smith">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Password</mat-label>
                <mat-icon matPrefix>lock</mat-icon>
                <input matInput type="password" formControlName="password">
              </mat-form-field>
              <div class="role-selector" style="grid-column: 1/-1; margin-bottom: 16px;">
                <label>
                  <input type="checkbox" formControlName="isAdmin" style="margin-right: 8px;">
                  Give this member Admin Privileges? (e.g. for Parents, allowing them to manage the system but log in like a child)
                </label>
              </div>
              <div class="form-actions">
                <p class="helper-text" style="grid-column: 1/-1; text-align: left; color: #636e72;">
                  * A unique login code will be automatically generated.
                </p>
                <button mat-raised-button class="btn-primary" type="submit" [disabled]="submitting || form.invalid">
                  @if (submitting) { <mat-spinner diameter="20"></mat-spinner> }
                  @else { <span><mat-icon>save</mat-icon> Add Member</span> }
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
          <h3>No children yet</h3>
          <p>Add your first child to get started!</p>
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
                  <span>Edit Name</span>
                </button>
                <button mat-menu-item (click)="uploadAvatarPrompt(child)">
                  <mat-icon>photo_camera</mat-icon>
                  <span>Upload Avatar</span>
                </button>
                <button mat-menu-item (click)="resetPassword(child)">
                  <mat-icon>lock_reset</mat-icon>
                  <span>Reset Password</span>
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
                  <span class="label">Login Code:</span>
                  <span class="code">{{ child.loginCode }}</span>
                </div>
                <!-- Hide stars for admins since they don't use them -->
                @if (child.role !== 'Admin') {
                  <div class="stars-display mt-2">
                    <mat-icon>star</mat-icon>
                    <span>{{ child.starBalance }} Stars</span>
                  </div>
                }
              </div>
            </mat-card>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .add-form-card { margin-bottom: 24px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 16px; }
    .form-actions { grid-column: 1/-1; display: flex; justify-content: space-between; align-items: center; }
    .child-card { cursor: default; transition: all 0.3s; text-align: center; padding: 24px !important; position: relative; }
    .child-card:hover { transform: translateY(-6px); border-color: #4dc9d6 !important; box-shadow: 0 8px 24px rgba(77,201,214,0.15) !important; }
    .child-menu-btn { position: absolute; top: 8px; right: 8px; color: #b2bec3; }
    .child-avatar-wrap { position: relative; display: inline-block; margin-bottom: 16px; }
    .child-avatar { width: 80px; height: 80px; border-radius: 50%; border: 3px solid #4dc9d6; background: white; }
    .child-rank { position: absolute; bottom: -4px; right: -4px; font-size: 1.2rem; }
    .child-info h3 { font-size: 1.2rem; font-weight: 700; margin-bottom: 8px; }
    .login-code-box { background: #f1f2f6; padding: 6px 12px; border-radius: 8px; display: inline-block; margin-bottom: 12px; border: 1px dashed #ced6e0; }
    .login-code-box .label { font-size: 0.75rem; color: #636e72; margin-right: 4px; }
    .login-code-box .code { font-weight: 700; color: #2d3436; font-family: monospace; font-size: 0.9rem; }
    .mt-2 { margin-top: 8px; }
    .badge-admin { background: #e0e0e0; color: #616161; font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; vertical-align: middle; margin-left: 4px; }
    .child-card.is-admin { border-top: 4px solid #9e9e9e !important; }
  `]
})
export class ChildrenComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userSvc = inject(UserService);
  private snack = inject(MatSnackBar);

  children: User[] = [];
  loading = true;
  showForm = false;
  submitting = false;
  
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
      return `http://localhost:5000${child.avatarUrl}`; // local backend URL
    }
    return child.avatarUrl || 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=' + child.fullName;
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
}
