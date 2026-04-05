import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-children',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule,
    MatIconModule, MatFormFieldModule, MatInputModule, MatDialogModule,
    MatSnackBarModule, MatProgressSpinnerModule],
  template: `
    <div class="animate-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">👨‍👩‍👧‍👦 Manage Children</h1>
          <p class="page-subtitle">Add and manage your children's accounts</p>
        </div>
        <button mat-raised-button class="btn-primary" (click)="showForm = !showForm">
          <mat-icon>{{ showForm ? 'close' : 'person_add' }}</mat-icon>
          {{ showForm ? 'Cancel' : 'Add Child' }}
        </button>
      </div>

      @if (showForm) {
        <mat-card class="add-form-card animate-in">
          <mat-card-header><mat-card-title>➕ Add New Child</mat-card-title></mat-card-header>
          <mat-card-content>
            <form [formGroup]="form" (ngSubmit)="addChild()" class="form-grid">
              <mat-form-field appearance="outline">
                <mat-label>Full Name</mat-label>
                <mat-icon matPrefix>person</mat-icon>
                <input matInput formControlName="fullName" placeholder="Emma Smith">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <mat-icon matPrefix>email</mat-icon>
                <input matInput type="email" formControlName="email">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Password</mat-label>
                <mat-icon matPrefix>lock</mat-icon>
                <input matInput type="password" formControlName="password">
              </mat-form-field>
              <div class="form-actions">
                <button mat-raised-button class="btn-primary" type="submit" [disabled]="submitting || form.invalid">
                  @if (submitting) { <mat-spinner diameter="20"></mat-spinner> }
                  @else { <mat-icon>save</mat-icon> Add Child }
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
            <mat-card class="child-card animate-in">
              <div class="child-avatar-wrap">
                <img [src]="child.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + child.fullName"
                     [alt]="child.fullName" class="child-avatar">
                <div class="child-rank">⭐</div>
              </div>
              <div class="child-info">
                <h3>{{ child.fullName }}</h3>
                <p class="child-email">{{ child.email }}</p>
                <div class="stars-display">
                  <mat-icon>star</mat-icon>
                  <span>{{ child.starBalance }} Stars</span>
                </div>
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
    .form-actions { grid-column: 1/-1; display: flex; justify-content: flex-end; }
    .child-card { cursor: default; transition: all 0.3s; text-align: center; padding: 24px !important; }
    .child-card:hover { transform: translateY(-6px); border-color: #7c3aed !important; }
    .child-avatar-wrap { position: relative; display: inline-block; margin-bottom: 16px; }
    .child-avatar { width: 80px; height: 80px; border-radius: 50%; border: 3px solid #7c3aed; }
    .child-rank { position: absolute; bottom: -4px; right: -4px; font-size: 1.2rem; }
    .child-info h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: 4px; }
    .child-email { color: #64748b; font-size: 0.85rem; margin-bottom: 12px; }
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
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor() {}

  ngOnInit() { this.load(); }
  load() {
    this.loading = true;
    this.userSvc.getChildren().subscribe({ next: c => { this.children = c; this.loading = false; }, error: () => this.loading = false });
  }
  addChild() {
    if (this.form.invalid) return;
    this.submitting = true;
    this.userSvc.addChild(this.form.value as any).subscribe({
      next: () => {
        this.snack.open('Child added! 🎉', 'Close', { duration: 3000 });
        this.form.reset(); this.showForm = false; this.submitting = false; this.load();
      },
      error: (e) => { this.snack.open(e.error?.message || 'Error', 'Close', { duration: 4000 }); this.submitting = false; }
    });
  }
}
