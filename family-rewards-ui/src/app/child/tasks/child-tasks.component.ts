import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { TaskService } from '../../core/services/task.service';
import { AuthService } from '../../core/services/auth.service';
import { FamilyTask, TaskCompletion } from '../../core/models/task.model';

@Component({
  selector: 'app-child-tasks',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule,
    MatSnackBarModule, MatProgressSpinnerModule, MatTabsModule],
  template: `
    <div class="animate-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">📋 My Tasks</h1>
          <p class="page-subtitle">Complete tasks to earn stars!</p>
        </div>
      </div>

      <mat-tab-group animationDuration="300ms">
        <mat-tab label="Available Tasks">
          <div class="tab-content">
            @if (tasks.length === 0) {
              <div class="empty-state"><mat-icon>celebration</mat-icon><h3>No tasks yet!</h3></div>
            } @else {
              <div class="cards-grid">
                @for (task of tasks; track task.id) {
                  <mat-card class="task-card animate-in">
                    <div class="task-header">
                      <span class="badge" [class]="'badge-' + task.type.toLowerCase()">{{ task.type }}</span>
                      <div class="stars-display"><mat-icon>star</mat-icon> {{ task.stars }}</div>
                    </div>
                    <h3>{{ task.title }}</h3>
                    <p class="task-desc">{{ task.description }}</p>
                    <button mat-raised-button class="btn-primary mark-btn"
                            (click)="markDone(task)" [disabled]="submitting === task.id">
                      @if (submitting === task.id) { <mat-spinner diameter="20"></mat-spinner> }
                      @else { <mat-icon>check_circle</mat-icon> Mark as Done }
                    </button>
                  </mat-card>
                }
              </div>
            }
          </div>
        </mat-tab>
        <mat-tab label="My History">
          <div class="tab-content">
            @if (completions.length === 0) {
              <div class="empty-state"><mat-icon>history</mat-icon><h3>No completions yet</h3></div>
            } @else {
              <div class="completions-list">
                @for (c of completions; track c.id) {
                  <mat-card class="completion-row animate-in">
                    <div class="comp-info">
                      <h3>{{ c.taskTitle }}</h3>
                      <p class="comp-date">{{ c.completedAt | date:'MMM d, y, h:mm a' }}</p>
                    </div>
                    <div class="comp-right">
                      <div class="stars-display"><mat-icon>star</mat-icon> {{ c.stars }}</div>
                      <span class="badge" [class]="'badge-' + c.status.toLowerCase()">{{ c.status }}</span>
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
    .task-card { padding: 20px !important; transition: all 0.3s; }
    .task-card:hover { transform: translateY(-4px); border-color: #7c3aed !important; }
    .task-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
    .task-desc { color: #94a3b8; font-size: 0.85rem; margin: 8px 0 16px; }
    .mark-btn { width: 100%; justify-content: center; display: flex !important; align-items: center; gap: 6px; }
    .completions-list { display: flex; flex-direction: column; gap: 12px; }
    .completion-row { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px !important; }
    .comp-date { color: #64748b; font-size: 0.8rem; margin-top: 4px; }
    .comp-right { display: flex; align-items: center; gap: 12px; }
  `]
})
export class ChildTasksComponent implements OnInit {
  tasks: FamilyTask[] = [];
  completions: TaskCompletion[] = [];
  submitting: number | null = null;

  constructor(public auth: AuthService, private taskSvc: TaskService, private snack: MatSnackBar) {}

  ngOnInit() {
    this.taskSvc.getTasks().subscribe(t => this.tasks = t);
    this.taskSvc.getMyCompletions().subscribe(c => this.completions = c);
  }

  markDone(task: FamilyTask) {
    this.submitting = task.id;
    this.taskSvc.completeTask({ taskId: task.id }).subscribe({
      next: () => {
        this.snack.open(`"${task.title}" submitted for approval! ⭐`, 'Close', { duration: 3000 });
        this.submitting = null;
        this.taskSvc.getMyCompletions().subscribe(c => this.completions = c);
      },
      error: (e) => { this.snack.open(e.error?.message || 'Error', 'Close', { duration: 4000 }); this.submitting = null; }
    });
  }
}
