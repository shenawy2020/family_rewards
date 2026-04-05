import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RewardService } from '../../core/services/reward-wallet-penalty.service';
import { Reward } from '../../core/models/reward.model';

@Component({
  selector: 'app-rewards',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSnackBarModule, MatProgressSpinnerModule],
  template: `
    <div class="animate-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">🎁 Rewards Management</h1>
          <p class="page-subtitle">Create exciting rewards for your children</p>
        </div>
        <button mat-raised-button class="btn-primary" (click)="showForm = !showForm">
          <mat-icon>{{ showForm ? 'close' : 'add' }}</mat-icon>
          {{ showForm ? 'Cancel' : 'New Reward' }}
        </button>
      </div>

      @if (showForm) {
        <mat-card class="add-form-card animate-in">
          <mat-card-header><mat-card-title>🎀 Create Reward</mat-card-title></mat-card-header>
          <mat-card-content>
            <form [formGroup]="form" (ngSubmit)="createReward()" class="form-grid">
              <mat-form-field appearance="outline">
                <mat-label>Reward Title</mat-label>
                <mat-icon matPrefix>card_giftcard</mat-icon>
                <input matInput formControlName="title" placeholder="Extra Screen Time">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Stars Cost</mat-label>
                <mat-icon matPrefix>star</mat-icon>
                <input matInput type="number" formControlName="starsCost" min="1">
              </mat-form-field>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Description</mat-label>
                <textarea matInput formControlName="description" rows="2"></textarea>
              </mat-form-field>
              <div class="form-actions">
                <button mat-raised-button class="btn-gold" type="submit" [disabled]="submitting || form.invalid">
                  @if (submitting) { <mat-spinner diameter="20"></mat-spinner> }
                  @else { <mat-icon>save</mat-icon> Save Reward }
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
      }

      <div class="cards-grid">
        @for (reward of rewards; track reward.id) {
          <mat-card class="reward-card animate-in">
            <div class="reward-icon">🎁</div>
            <h3 class="reward-title">{{ reward.title }}</h3>
            <p class="reward-desc">{{ reward.description }}</p>
            <div class="reward-cost">
              <mat-icon>star</mat-icon>
              <span>{{ reward.starsCost }} Stars</span>
            </div>
          </mat-card>
        }
      </div>
    </div>
  `,
  styles: [`
    .add-form-card { margin-bottom: 24px; }
    .form-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 0 16px; }
    .full-width { grid-column: 1/-1; }
    .form-actions { grid-column: 1/-1; display: flex; justify-content: flex-end; }
    .reward-card { text-align: center; padding: 28px 20px !important; transition: all 0.3s; }
    .reward-card:hover { transform: translateY(-6px); border-color: #ffd700 !important; box-shadow: 0 12px 40px rgba(255,215,0,0.2) !important; }
    .reward-icon { font-size: 3rem; margin-bottom: 12px; }
    .reward-title { font-size: 1.1rem; font-weight: 700; margin-bottom: 8px; }
    .reward-desc { color: #94a3b8; font-size: 0.85rem; margin-bottom: 16px; min-height: 40px; }
    .reward-cost { display: flex; align-items: center; justify-content: center; gap: 4px; color: #ffd700; font-size: 1.2rem; font-weight: 700; }
  `]
})
export class RewardsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private rewardSvc = inject(RewardService);
  private snack = inject(MatSnackBar);

  rewards: Reward[] = [];
  showForm = false;
  submitting = false;
  form = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    starsCost: [20, [Validators.required, Validators.min(1)]]
  });

  constructor() {}
  ngOnInit() { this.load(); }
  load() { this.rewardSvc.getRewards().subscribe(r => this.rewards = r); }
  createReward() {
    if (this.form.invalid) return;
    this.submitting = true;
    this.rewardSvc.createReward(this.form.value as any).subscribe({
      next: () => { this.snack.open('Reward created! 🎀', 'Close', { duration: 3000 }); this.form.reset({ starsCost: 20 }); this.showForm = false; this.submitting = false; this.load(); },
      error: (e) => { this.snack.open(e.error?.message || 'Error', 'Close', { duration: 4000 }); this.submitting = false; }
    });
  }
}
