import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../../core/services/user.service';
import { WalletService } from '../../core/services/reward-wallet-penalty.service';
import { User } from '../../core/models/user.model';
import { AddStarsDto, DeliverGiftDto } from '../../core/models/reward.model';

@Component({
  selector: 'app-stars-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule,
    MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatSnackBarModule, MatProgressSpinnerModule],
  template: `
    <div class="animate-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">🌟 Stars & Gifts Hub</h1>
          <p class="page-subtitle">Add stars, deduct stars, or deliver special gifts.</p>
        </div>
      </div>

      <div class="stars-layout">
        <!-- Add/Deduct Stars Section -->
        <mat-card class="stars-card animate-in" style="animation-delay: 0.1s">
          <mat-card-header>
            <mat-icon mat-card-avatar class="card-icon">star_half</mat-icon>
            <mat-card-title>Manage Stars</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <form [formGroup]="starsForm" (ngSubmit)="manageStars()" class="form-grid">
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Select Child</mat-label>
                <mat-select formControlName="childId">
                  @for (c of children; track c.id) {
                    <mat-option [value]="c.id">{{ c.fullName }} ({{ c.starBalance }} ⭐)</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <div class="quick-stars full-width" *ngIf="starsForm.get('childId')?.value">
                <button type="button" mat-raised-button color="primary" (click)="setAmount(1)">+1 ⭐</button>
                <button type="button" mat-raised-button color="primary" (click)="setAmount(5)">+5 ⭐</button>
                <button type="button" mat-raised-button color="primary" (click)="setAmount(10)">+10 ⭐</button>
                <button type="button" mat-raised-button color="warn" (click)="setAmount(-5)">-5 ⭐</button>
              </div>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Amount (Use negative to deduct)</mat-label>
                <input matInput type="number" formControlName="amount">
              </mat-form-field>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Reason</mat-label>
                <input matInput formControlName="reason" placeholder="Excellent behavior">
              </mat-form-field>

              <div class="form-actions full-width">
                <button mat-raised-button class="btn-primary" type="submit" [disabled]="submittingStars || starsForm.invalid">
                  @if (submittingStars) { <mat-spinner diameter="20"></mat-spinner> }
                  @else { <mat-icon>send</mat-icon> Submit Transaction }
                </button>
              </div>

            </form>
          </mat-card-content>
        </mat-card>

        <!-- Deliver Gift Section -->
        <mat-card class="gift-card animate-in" style="animation-delay: 0.2s">
          <mat-card-header>
            <mat-icon mat-card-avatar class="card-icon">card_giftcard</mat-icon>
            <mat-card-title>Deliver Gift</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <form [formGroup]="giftForm" (ngSubmit)="deliverGift()" class="form-grid">
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Select Child</mat-label>
                <mat-select formControlName="childId">
                  @for (c of children; track c.id) {
                    <mat-option [value]="c.id">{{ c.fullName }} ({{ c.starBalance }} ⭐)</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Gift Name</mat-label>
                <mat-icon matPrefix>card_giftcard</mat-icon>
                <input matInput formControlName="giftName" placeholder="New Toy Car">
              </mat-form-field>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Stars to Deduct</mat-label>
                <mat-icon matPrefix>star</mat-icon>
                <input matInput type="number" formControlName="starsCost" placeholder="50">
              </mat-form-field>

              <div class="form-actions full-width">
                <button mat-raised-button class="btn-green" type="submit" [disabled]="submittingGift || giftForm.invalid">
                  @if (submittingGift) { <mat-spinner diameter="20"></mat-spinner> }
                  @else { <mat-icon>redeem</mat-icon> Deliver & Deduct Stars }
                </button>
              </div>

            </form>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .stars-layout { display: grid; gap: 24px; grid-template-columns: 1fr; }
    @media (min-width: 900px) { .stars-layout { grid-template-columns: 1fr 1fr; } }
    .stars-card, .gift-card { padding: 16px; border: 2px solid rgba(77,201,214,0.3) !important; border-radius: 20px; }
    .gift-card { border-color: rgba(67, 198, 126, 0.4) !important; }
    .card-icon { background: #e0f7fa; color: #4dc9d6; display: flex; align-items: center; justify-content: center; border-radius: 50%; width: 44px; height: 44px; }
    .gift-card .card-icon { background: #e8f5e9; color: #4cc388; }
    .form-grid { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 16px; }
    .full-width { width: 100%; }
    .half-width { width: calc(50% - 8px); }
    .form-actions { display: flex; justify-content: flex-end; margin-top: 8px; }
    .quick-stars { display: flex; gap: 8px; justify-content: center; margin-bottom: 8px; }
    .quick-stars button { border-radius: 20px; }
  `]
})
export class StarsComponent implements OnInit {
  private userSvc = inject(UserService);
  private walletSvc = inject(WalletService);
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);

  children: User[] = [];
  
  starsForm = this.fb.group({
    childId: [null as number | null, Validators.required],
    amount: [0, Validators.required],
    reason: ['', Validators.required]
  });
  submittingStars = false;

  giftForm = this.fb.group({
    childId: [null as number | null, Validators.required],
    giftName: ['', Validators.required],
    starsCost: [null as number | null, [Validators.required, Validators.min(1)]]
  });
  submittingGift = false;

  ngOnInit() { this.loadChildren(); }

  loadChildren() {
    this.userSvc.getChildren().subscribe(c => this.children = c);
  }

  setAmount(amt: number) {
    this.starsForm.patchValue({ amount: amt });
  }

  manageStars() {
    if (this.starsForm.invalid) return;
    this.submittingStars = true;
    const dto: AddStarsDto = this.starsForm.value as any;
    
    this.walletSvc.addStars(dto).subscribe({
      next: () => {
        this.snack.open('Stars updated successfully! 🌟', 'Close', { duration: 3000 });
        this.starsForm.reset({ childId: dto.childId, amount: 0, reason: '' });
        this.submittingStars = false;
        this.loadChildren();
      },
      error: (e) => {
        this.snack.open(e.error?.message || 'Error updating stars', 'Close', { duration: 4000 });
        this.submittingStars = false;
      }
    });
  }

  deliverGift() {
    if (this.giftForm.invalid) return;
    this.submittingGift = true;
    const dto: DeliverGiftDto = this.giftForm.value as any;
    
    this.walletSvc.deliverGift(dto).subscribe({
      next: () => {
        this.snack.open('Gift delivered and stars deducted! 🎁', 'Close', { duration: 3000 });
        this.giftForm.reset({ childId: dto.childId });
        this.submittingGift = false;
        this.loadChildren();
      },
      error: (e) => {
        this.snack.open(e.error?.message || 'Error delivering gift', 'Close', { duration: 4000 });
        this.submittingGift = false;
      }
    });
  }
}
