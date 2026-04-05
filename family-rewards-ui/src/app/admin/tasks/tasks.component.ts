import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { TaskService } from '../../core/services/task.service';
import { FamilyTask, TaskCompletion } from '../../core/models/task.model';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatTabsModule,
    MatSnackBarModule, MatProgressSpinnerModule, MatChipsModule],
  template: `
    <div class="animate-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">✅ Task Management</h1>
          <p class="page-subtitle">Create tasks and approve completions</p>
        </div>
      </div>

      <mat-tab-group mat-stretch-tabs="false" animationDuration="300ms">
        <!-- Create Task Tab -->
        <mat-tab label="Create Task">
          <div class="tab-content">
            <mat-card class="add-form-card">
              <mat-card-header><mat-card-title>📝 New Task</mat-card-title></mat-card-header>
              <mat-card-content>
                <form [formGroup]="taskForm" (ngSubmit)="createTask()" class="form-grid-3">
                  <mat-form-field appearance="outline">
                    <mat-label>Title</mat-label>
                    <mat-icon matPrefix>title</mat-icon>
                    <input matInput formControlName="title" placeholder="Clean your room">
                  </mat-form-field>
                  <mat-form-field appearance="outline">
                    <mat-label>Stars Reward</mat-label>
                    <mat-icon matPrefix>star</mat-icon>
                    <input matInput type="number" formControlName="stars" min="1" max="100">
                  </mat-form-field>
                  <mat-form-field appearance="outline">
                    <mat-label>Type</mat-label>
                    <mat-select formControlName="type">
                      <mat-option [value]="1">🌅 Daily</mat-option>
                      <mat-option [value]="2">📅 Weekly</mat-option>
                      <mat-option [value]="3">✨ Custom</mat-option>
                    </mat-select>
                  </mat-form-field>
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Description</mat-label>
                    <textarea matInput formControlName="description" rows="2" placeholder="Task details..."></textarea>
                  </mat-form-field>
                  <div class="form-actions">
                    <button mat-raised-button class="btn-primary" type="submit" [disabled]="submitting || taskForm.invalid">
                      @if (submitting) { <mat-spinner diameter="20"></mat-spinner> }
                      @else { <mat-icon>add_task</mat-icon> Create Task }
                    </button>
                  </div>
                </form>
              </mat-card-content>
            </mat-card>

            <h3 class="sub-heading">All Tasks ({{ tasks.length }})</h3>
            <div class="cards-grid">
              @for (task of tasks; track task.id) {
                <mat-card class="task-card animate-in">
                  <div class="task-header">
                    <span class="badge" [class]="'badge-' + task.type.toLowerCase()">{{ task.type }}</span>
                    <div class="stars-display"><mat-icon>star</mat-icon> {{ task.stars }}</div>
                  </div>
                  <h3 class="task-title">{{ task.title }}</h3>
                  <p class="task-desc">{{ task.description }}</p>
                  <p class="task-meta">By {{ task.createdByName }}</p>
                </mat-card>
              }
            </div>
          </div>
        </mat-tab>

        <!-- Pending Approvals Tab -->
        <mat-tab label="Pending Approvals ({{ pending.length }})">
          <div class="tab-content">
            @if (pending.length === 0) {
              <div class="empty-state">
                <mat-icon>check_circle</mat-icon>
                <h3>All caught up!</h3>
                <p>No pending task completions to review</p>
              </div>
            } @else {
              <div class="completions-list">
                @for (comp of pending; track comp.id) {
                  <mat-card class="completion-card animate-in">
                    <div class="comp-left">
                      <img [src]="comp.childAvatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + comp.childName"
                           [alt]="comp.childName" class="comp-avatar">
                      <div>
                        <h3>{{ comp.childName }}</h3>
                        <p class="comp-task">{{ comp.taskTitle }}</p>
                        <p class="comp-meta">{{ comp.completedAt | date:'short' }}</p>
                        @if (comp.notes) { <p class="comp-notes">💬 {{ comp.notes }}</p> }
                      </div>
                    </div>
                    <div class="comp-right">
                      <div class="stars-display"><mat-icon>star</mat-icon> {{ comp.stars }}</div>
                      <div class="comp-actions">
                        <button mat-raised-button class="btn-approve" (click)="approve(comp.id, 2)" [disabled]="processingId === comp.id">
                          <mat-icon>check</mat-icon> Approve
                        </button>
                        <button mat-raised-button class="btn-reject" (click)="approve(comp.id, 3)" [disabled]="processingId === comp.id">
                          <mat-icon>close</mat-icon> Reject
                        </button>
                      </div>
                    </div>
                  </mat-card>
                }
              </div>
            }
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .tab-content { padding: 24px 0; }
    .add-form-card { margin-bottom: 24px; }
    .form-grid-3 { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 0 16px; }
    .full-width { grid-column: 1/-1; }
    .form-actions { grid-column: 1/-1; display: flex; justify-content: flex-end; }
    .sub-heading { font-size: 1rem; font-weight: 700; color: #94a3b8; margin: 24px 0 16px; text-transform: uppercase; letter-spacing: 1px; }
    .task-card { padding: 20px !important; transition: all 0.3s; }
    .task-card:hover { transform: translateY(-4px); border-color: #7c3aed !important; }
    .task-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .task-title { font-size: 1.05rem; font-weight: 700; margin-bottom: 6px; }
    .task-desc { color: #94a3b8; font-size: 0.85rem; margin-bottom: 8px; }
    .task-meta { color: #64748b; font-size: 0.75rem; }
    .completions-list { display: flex; flex-direction: column; gap: 16px; }
    .completion-card { display: flex; align-items: center; justify-content: space-between; padding: 20px !important; flex-wrap: wrap; gap: 16px; }
    .comp-left { display: flex; align-items: center; gap: 16px; }
    .comp-avatar { width: 56px; height: 56px; border-radius: 50%; border: 2px solid #7c3aed; }
    .comp-task { color: #94a3b8; font-size: 0.9rem; margin: 2px 0; }
    .comp-meta { color: #64748b; font-size: 0.8rem; }
    .comp-notes { color: #f59e0b; font-size: 0.85rem; margin-top: 4px; }
    .comp-right { display: flex; flex-direction: column; align-items: flex-end; gap: 12px; }
    .comp-actions { display: flex; gap: 8px; }
    .btn-approve { background: rgba(16,185,129,0.2) !important; color: #10b981 !important; border-radius: 10px !important; }
    .btn-reject { background: rgba(239,68,68,0.2) !important; color: #ef4444 !important; border-radius: 10px !important; }
  `]
})
export class TasksComponent implements OnInit {
  private fb = inject(FormBuilder);
  private taskSvc = inject(TaskService);
  private snack = inject(MatSnackBar);

  tasks: FamilyTask[] = [];
  pending: TaskCompletion[] = [];
  submitting = false;
  processingId: number | null = null;
  taskForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    stars: [10, [Validators.required, Validators.min(1)]],
    type: [1, Validators.required]
  });

  constructor() {}

  ngOnInit() { this.load(); }
  load() {
    this.taskSvc.getTasks().subscribe(t => this.tasks = t);
    this.taskSvc.getPendingCompletions().subscribe(p => this.pending = p);
  }

  createTask() {
    if (this.taskForm.invalid) return;
    this.submitting = true;
    this.taskSvc.createTask(this.taskForm.value as any).subscribe({
      next: () => { this.snack.open('Task created! ✅', 'Close', { duration: 3000 }); this.taskForm.reset({ stars: 10, type: 1 }); this.submitting = false; this.load(); },
      error: (e) => { this.snack.open(e.error?.message || 'Error', 'Close', { duration: 4000 }); this.submitting = false; }
    });
  }

  approve(id: number, status: number) {
    this.processingId = id;
    this.taskSvc.approveTask({ completionId: id, status }).subscribe({
      next: () => {
        const msg = status === 2 ? 'Task approved! ⭐ Stars awarded!' : 'Task rejected.';
        this.snack.open(msg, 'Close', { duration: 3000 });
        this.processingId = null; this.load();
      },
      error: () => this.processingId = null
    });
  }
}
