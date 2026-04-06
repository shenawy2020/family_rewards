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
          <p class="page-subtitle">Complete tasks to earn stars! ⭐</p>
        </div>
      </div>

      <mat-tab-group animationDuration="300ms">
        <mat-tab label="✅ Available Tasks">
          <div class="tab-content">
            @if (tasks.length === 0) {
              <div class="empty-state">
                <span style="font-size:4rem">🎉</span>
                <h3>All done!</h3>
                <p>No tasks available right now</p>
              </div>
            } @else {
              <div class="task-grid">
                @for (task of tasks; track task.id) {
                  <div class="task-card" [style.background]="cardColors[task.id % cardColors.length]">
                    <div class="card-top">
                      <span class="task-type-badge" [class]="'badge-' + task.type.toLowerCase()">{{ task.type }}</span>
                      <span class="card-stars">+{{ task.stars }} ⭐</span>
                    </div>
                    <div class="card-emoji">{{ task.icon || taskEmojis[task.id % taskEmojis.length] }}</div>
                    <h3 class="card-title">{{ task.title }}</h3>
                    <p class="card-desc">{{ task.description }}</p>
                    <button class="done-btn" (click)="markDone(task)" [disabled]="submitting === task.id">
                      @if (submitting === task.id) { ⏳ Submitting... }
                      @else { ✅ Mark as Done }
                    </button>
                  </div>
                }
              </div>
            }
          </div>
        </mat-tab>
        <mat-tab label="📜 My History">
          <div class="tab-content">
            @if (completions.length === 0) {
              <div class="empty-state">
                <span style="font-size:3rem">📜</span>
                <h3>No completions yet</h3>
              </div>
            } @else {
              <div class="history-list">
                @for (c of completions; track c.id) {
                  <div class="history-item">
                    <div class="history-left">
                      <h3>{{ c.taskTitle }}</h3>
                      <p class="history-date">{{ c.completedAt | date:'MMM d, y, h:mm a' }}</p>
                    </div>
                    <div class="history-right">
                      <span class="history-stars">+{{ c.stars }} ⭐</span>
                      <span class="badge" [class]="'badge-' + c.status.toLowerCase()">{{ c.status }}</span>
                    </div>
                  </div>
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
    .task-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 16px;
    }
    .task-card {
      border-radius: 20px;
      padding: 20px;
      text-align: center;
      border: 2px solid rgba(0,0,0,0.05);
      box-shadow: 0 4px 12px rgba(0,0,0,0.06);
      transition: all 0.3s;
    }
    .task-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
    .card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .card-stars { font-weight: 700; color: #f57f17; font-size: 0.95rem; }
    .card-emoji { font-size: 2.8rem; margin: 8px 0; }
    .card-title { font-weight: 700; font-size: 1rem; margin-bottom: 6px; color: #2d3436; }
    .card-desc { color: #636e72; font-size: 0.82rem; margin-bottom: 16px; min-height: 36px; }
    .done-btn {
      width: 100%;
      background: linear-gradient(135deg, #4caf50, #66bb6a);
      color: white; border: none;
      padding: 10px; border-radius: 14px;
      font-family: 'Fredoka', sans-serif; font-weight: 600; font-size: 0.9rem;
      cursor: pointer; transition: all 0.2s;
      box-shadow: 0 2px 8px rgba(76,175,80,0.3);
    }
    .done-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 14px rgba(76,175,80,0.4); }
    .done-btn:disabled { opacity: 0.7; cursor: wait; }

    .history-list { display: flex; flex-direction: column; gap: 12px; }
    .history-item {
      display: flex; align-items: center; justify-content: space-between;
      background: white; border-radius: 16px; padding: 16px 20px;
      border: 2px solid rgba(0,0,0,0.06); box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }
    .history-date { color: #b2bec3; font-size: 0.8rem; margin-top: 4px; }
    .history-right { display: flex; align-items: center; gap: 12px; }
    .history-stars { color: #f57f17; font-weight: 700; }
  `]
})
export class ChildTasksComponent implements OnInit {
  tasks: FamilyTask[] = [];
  completions: TaskCompletion[] = [];
  submitting: number | null = null;

  cardColors = ['#ffe0b2', '#fff9c4', '#c8e6c9', '#b3e5fc', '#f8bbd0', '#d1c4e9', '#b2ebf2', '#ffe082'];
  taskEmojis = ['🪥', '📖', '🛏️', '🎒', '🧹', '📝', '🐕', '🍽️', '🧺', '🎨', '🏃', '🎵'];

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
