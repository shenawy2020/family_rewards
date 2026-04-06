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
import { I18nService } from '../../core/services/i18n.service';

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
          <h1 class="page-title">✅ {{ i18n.t('tasks.title') }}</h1>
          <p class="page-subtitle">{{ i18n.t('tasks.subtitle') }}</p>
        </div>
      </div>

      <mat-tab-group mat-stretch-tabs="false" animationDuration="300ms">
        <mat-tab [label]="i18n.t('tasks.createTask')">
          <div class="tab-content">
            <mat-card class="add-form-card">
              <mat-card-header><mat-card-title>📝 {{ i18n.t('tasks.newTask') }}</mat-card-title></mat-card-header>
              <mat-card-content>
                <form [formGroup]="taskForm" (ngSubmit)="createTask()" class="form-grid-3">
                  <mat-form-field appearance="outline">
                    <mat-label>{{ i18n.t('tasks.taskTitle') }}</mat-label>
                    <mat-icon matPrefix>title</mat-icon>
                    <input matInput formControlName="title">
                  </mat-form-field>
                  <mat-form-field appearance="outline">
                    <mat-label>{{ i18n.t('tasks.starsReward') }}</mat-label>
                    <mat-icon matPrefix>star</mat-icon>
                    <input matInput type="number" formControlName="stars" min="1" max="100">
                  </mat-form-field>
                  <mat-form-field appearance="outline">
                    <mat-label>{{ i18n.t('tasks.type') }}</mat-label>
                    <mat-select formControlName="type">
                      <mat-option [value]="1">🌅 {{ i18n.t('tasks.daily') }}</mat-option>
                      <mat-option [value]="2">📅 {{ i18n.t('tasks.weekly') }}</mat-option>
                      <mat-option [value]="3">✨ {{ i18n.t('tasks.custom') }}</mat-option>
                    </mat-select>
                  </mat-form-field>
                  <mat-form-field appearance="outline">
                    <mat-label>{{ i18n.t('tasks.description') }}</mat-label>
                    <textarea matInput formControlName="description" rows="2"></textarea>
                  </mat-form-field>
                  <div class="icon-picker full-width">
                    <p>{{ i18n.t('tasks.selectIcon') }}:</p>
                    <div class="emoji-list">
                      <button type="button" class="emoji-btn" 
                              *ngFor="let emoji of availableIcons" 
                              [class.selected]="taskForm.get('icon')?.value === emoji"
                              (click)="taskForm.patchValue({icon: emoji})">
                        {{ emoji }}
                      </button>
                    </div>
                  </div>
                  <div class="form-actions">
                    <button mat-raised-button class="btn-primary" type="submit" [disabled]="submitting || taskForm.invalid">
                      @if (submitting) { <mat-spinner diameter="20"></mat-spinner> }
                      @else { <span><mat-icon>add_task</mat-icon> {{ i18n.t('tasks.createTask') }}</span> }
                    </button>
                  </div>
                </form>
              </mat-card-content>
            </mat-card>

            <h3 class="sub-heading">{{ i18n.t('tasks.allTasks') }} ({{ tasks.length }})</h3>
            <div class="cards-grid">
              @for (task of tasks; track task.id) {
                <mat-card class="task-card animate-in">
                  <div class="task-header">
                    <span class="badge" [class]="'badge-' + task.type.toLowerCase()">{{ i18n.t('tasks.' + task.type.toLowerCase()) }}</span>
                    <div class="stars-display"><mat-icon>star</mat-icon> {{ task.stars }}</div>
                  </div>
                  <h3 class="task-title">
                    <span class="task-icon" *ngIf="task.icon">{{ task.icon }}</span> 
                    {{ task.title }}
                  </h3>
                  <p class="task-desc">{{ task.description }}</p>
                  
                  <div class="card-actions">
                     <button mat-icon-button color="warn" (click)="deleteTask(task.id)">
                        <mat-icon>delete</mat-icon>
                     </button>
                  </div>
                </mat-card>
              }
            </div>
          </div>
        </mat-tab>

        <mat-tab [label]="i18n.t('tasks.pendingApprovals') + ' (' + pending.length + ')'">
          <div class="tab-content">
            @if (pending.length === 0) {
              <div class="empty-state">
                <mat-icon>check_circle</mat-icon>
                <h3>{{ i18n.t('tasks.allCaughtUp') }}</h3>
                <p>{{ i18n.t('tasks.noPending') }}</p>
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
                          <mat-icon>check</mat-icon> {{ i18n.t('tasks.approve') }}
                        </button>
                        <button mat-raised-button class="btn-reject" (click)="approve(comp.id, 3)" [disabled]="processingId === comp.id">
                          <mat-icon>close</mat-icon> {{ i18n.t('tasks.reject') }}
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
    .sub-heading { font-size: 1rem; font-weight: 700; color: #636e72; margin: 24px 0 16px; text-transform: uppercase; letter-spacing: 1px; }
    .task-card { padding: 20px !important; transition: all 0.3s; }
    .task-card:hover { transform: translateY(-4px); border-color: #4dc9d6 !important; box-shadow: 0 8px 24px rgba(77,201,214,0.15) !important; }
    .task-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .task-title { font-size: 1.05rem; font-weight: 700; margin-bottom: 6px; }
    .task-desc { color: #636e72; font-size: 0.85rem; margin-bottom: 8px; }
    .task-meta { color: #b2bec3; font-size: 0.75rem; }
    .completions-list { display: flex; flex-direction: column; gap: 16px; }
    .completion-card { display: flex; align-items: center; justify-content: space-between; padding: 20px !important; flex-wrap: wrap; gap: 16px; }
    .comp-left { display: flex; align-items: center; gap: 16px; }
    .comp-avatar { width: 56px; height: 56px; border-radius: 50%; border: 2px solid #4dc9d6; background: white; object-fit: cover; }
    .comp-task { color: #636e72; font-size: 0.9rem; margin: 2px 0; }
    .comp-meta { color: #b2bec3; font-size: 0.8rem; }
    .comp-notes { color: #f57f17; font-size: 0.85rem; margin-top: 4px; }
    .comp-right { display: flex; flex-direction: column; align-items: flex-end; gap: 12px; }
    .comp-actions { display: flex; gap: 8px; }
    .btn-approve { background: #e8f5e9 !important; color: #2e7d32 !important; border-radius: 12px !important; font-family: 'Fredoka', sans-serif !important; font-weight: 600 !important; }
    .btn-reject { background: #ffebee !important; color: #c62828 !important; border-radius: 12px !important; font-family: 'Fredoka', sans-serif !important; font-weight: 600 !important; }
    .icon-picker { margin-bottom: 16px; }
    .icon-picker p { margin: 0 0 8px; font-weight: 600; color: #636e72; font-size: 0.9rem; }
    .emoji-list { display: flex; gap: 8px; flex-wrap: wrap; }
    .emoji-btn { font-size: 1.5rem; background: transparent; border: 2px solid transparent; border-radius: 50%; cursor: pointer; transition: all 0.2s; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; }
    .emoji-btn:hover { background: #f1f2f6; }
    .emoji-btn.selected { border-color: #4dc9d6; background: #e0f7fa; }
    .task-icon { display: inline-block; margin-right: 6px; font-size: 1.2em; }
    .card-actions { position: absolute; right: 8px; bottom: 8px; }
  `]
})
export class TasksComponent implements OnInit {
  private fb = inject(FormBuilder);
  private taskSvc = inject(TaskService);
  private snack = inject(MatSnackBar);
  public i18n = inject(I18nService);

  tasks: FamilyTask[] = [];
  pending: TaskCompletion[] = [];
  submitting = false;
  processingId: number | null = null;
  availableIcons = [
    '🧹', '🛏️', '📚', '🐶', '🗑️', '🌱', '👕', '🍽️', '🏋️', '🧘‍♂️', '🎨', '🎯',
    '🧺', '🧼', '🚗', '🪴', '🛒', '📝', '🏃', '🚿', '🧸', '🪟', '🧽', '🍼'
  ];
  
  taskForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    stars: [10, [Validators.required, Validators.min(1)]],
    type: [1, Validators.required],
    icon: ['🧹']
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
      next: () => { this.snack.open(this.i18n.t('common.success') + ' ✅', this.i18n.t('common.close'), { duration: 3000 }); this.taskForm.reset({ stars: 10, type: 1, icon: '🧹' }); this.submitting = false; this.load(); },
      error: (e) => { this.snack.open(e.error?.message || this.i18n.t('common.error'), this.i18n.t('common.close'), { duration: 4000 }); this.submitting = false; }
    });
  }

  deleteTask(id: number) {
    if (confirm(this.i18n.t('tasks.deleteConfirm'))) {
      this.taskSvc.deleteTask(id).subscribe({
        next: () => {
          this.snack.open(this.i18n.t('common.success'), this.i18n.t('common.close'), { duration: 3000 });
          this.load();
        },
        error: () => this.snack.open(this.i18n.t('common.error'), this.i18n.t('common.close'), { duration: 3000 })
      });
    }
  }

  approve(id: number, status: number) {
    this.processingId = id;
    this.taskSvc.approveTask({ completionId: id, status }).subscribe({
      next: () => {
        this.snack.open(this.i18n.t('common.success'), this.i18n.t('common.close'), { duration: 3000 });
        this.processingId = null; this.load();
      },
      error: () => this.processingId = null
    });
  }
}
