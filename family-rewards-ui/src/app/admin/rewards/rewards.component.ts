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
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { RewardService, WalletService } from '../../core/services/reward-wallet-penalty.service';
import { UserService } from '../../core/services/user.service';
import { Reward } from '../../core/models/reward.model';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-rewards',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSnackBarModule, MatProgressSpinnerModule, MatMenuModule, MatSelectModule],
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

      <mat-card class="assign-form-card animate-in" style="margin-bottom: 24px; border: 2px solid rgba(77,201,214,0.3) !important;">
        <mat-card-header><mat-card-title>🌟 Give Bonus Reward</mat-card-title></mat-card-header>
        <mat-card-content>
          <form [formGroup]="assignForm" (ngSubmit)="giveBonusReward()" class="form-grid">
            <div class="child-cards-selector">
              <p>Select Child:</p>
              <div class="child-cards-grid">
                @for (c of children; track c.id) {
                  <div class="child-select-card" 
                       [class.selected]="assignForm.get('childId')?.value === c.id"
                       (click)="assignForm.patchValue({childId: c.id})">
                    <img [src]="getAvatar(c)" [alt]="c.fullName" class="mini-avatar">
                    <div class="child-name">{{ c.fullName }}</div>
                    <div class="child-stars">{{ c.starBalance }} ⭐</div>
                  </div>
                }
              </div>
            </div>
            <mat-form-field appearance="outline">
              <mat-label>Select Reward</mat-label>
              <mat-select formControlName="rewardId">
                @for (r of rewards; track r.id) {
                  <mat-option [value]="r.id">{{ r.title }} (+{{ r.starsCost }} ⭐)</mat-option>
                }
              </mat-select>
            </mat-form-field>
            <div class="form-actions">
              <button mat-raised-button class="btn-green" type="submit" [disabled]="submittingAssign || assignForm.invalid">
                @if (submittingAssign) { <mat-spinner diameter="20"></mat-spinner> }
                @else { <mat-icon>star</mat-icon> Give Reward & Add Stars }
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

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
    .reward-card:hover { transform: translateY(-6px); border-color: #f5b400 !important; box-shadow: 0 8px 24px rgba(245,180,0,0.15) !important; }
    .reward-icon { font-size: 3rem; margin-bottom: 12px; }
    .reward-title { font-size: 1.1rem; font-weight: 700; margin-bottom: 8px; }
    .reward-desc { color: #636e72; font-size: 0.85rem; margin-bottom: 16px; min-height: 40px; }
    .reward-cost { display: flex; align-items: center; justify-content: center; gap: 4px; color: #f57f17; font-size: 1.2rem; font-weight: 700; }
    .btn-green { background: linear-gradient(135deg, #4caf50, #66bb6a) !important; color: white !important; }
    
    .child-cards-selector { grid-column: 1/-1; margin-bottom: 16px; }
    .child-cards-selector p { font-weight: 600; color: #636e72; margin: 0 0 12px; }
    .child-cards-grid { display: flex; gap: 12px; flex-wrap: wrap; }
    .child-select-card {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      background: white; border: 2px solid #edf2f7; border-radius: 16px;
      padding: 12px; width: 100px; cursor: pointer; transition: all 0.2s;
    }
    .child-select-card:hover { border-color: #b2ebf2; transform: translateY(-2px); }
    .child-select-card.selected { border-color: #4dc9d6; background: #e0f7fa; box-shadow: 0 4px 12px rgba(77,201,214,0.2); }
    .mini-avatar { width: 44px; height: 44px; border-radius: 50%; margin-bottom: 8px; border: 2px solid #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .child-name { font-weight: 600; font-size: 0.85rem; color: #2d3436; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }
    .child-stars { font-size: 0.75rem; color: #f57f17; font-weight: 600; margin-top: 4px; }
  `]
})
export class RewardsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private rewardSvc = inject(RewardService);
  private walletSvc = inject(WalletService);
  private userSvc = inject(UserService);
  private snack = inject(MatSnackBar);

  rewards: Reward[] = [];
  children: User[] = [];
  showForm = false;
  submitting = false;
  form = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    starsCost: [20, [Validators.required, Validators.min(1)]]
  });

  assignForm = this.fb.group({
    childId: [null as number | null, Validators.required],
    rewardId: [null as number | null, Validators.required]
  });
  submittingAssign = false;

  constructor() {}
  ngOnInit() { this.load(); }
  load() { 
    this.rewardSvc.getRewards().subscribe(r => this.rewards = r); 
    this.userSvc.getChildren().subscribe(c => this.children = c);
  }
  createReward() {
    if (this.form.invalid) return;
    this.submitting = true;
    this.rewardSvc.createReward(this.form.value as any).subscribe({
      next: () => { this.snack.open('Reward created! 🎀', 'Close', { duration: 3000 }); this.form.reset({ starsCost: 20 }); this.showForm = false; this.submitting = false; this.load(); },
      error: (e) => { this.snack.open(e.error?.message || 'Error', 'Close', { duration: 4000 }); this.submitting = false; }
    });
  }

  giveBonusReward() {
    if (this.assignForm.invalid) return;
    
    const childId = this.assignForm.value.childId!;
    const rewardId = this.assignForm.value.rewardId!;
    
    const reward = this.rewards.find(r => r.id === rewardId);
    if (!reward) return;

    this.submittingAssign = true;
    
    const payload = {
      childId: childId,
      amount: reward.starsCost,
      reason: `Bonus Reward: ${reward.title}`
    };

    this.walletSvc.addStars(payload).subscribe({
      next: () => {
        this.snack.open(`⭐ ${reward.starsCost} stars added to child for "${reward.title}"!`, 'Close', { duration: 5000 });
        this.assignForm.reset();
        this.submittingAssign = false;
        this.load(); 
      },
      error: (e) => {
        this.snack.open(e.error?.message || 'Error adding stars', 'Close', { duration: 4000 });
        this.submittingAssign = false;
      }
    });
  }

  getAvatar(child: User): string {
    const url = child.avatarUrl;
    if (url?.startsWith('/uploads')) {
      return `http://localhost:5000${url}`;
    }
    return url || 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=' + child.fullName;
  }
}
