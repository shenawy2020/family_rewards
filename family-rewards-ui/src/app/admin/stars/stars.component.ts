import { environment } from '../../../environments/environment';
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
import { UserService } from '../../core/services/user.service';
import { WalletService } from '../../core/services/reward-wallet-penalty.service';
import { User } from '../../core/models/user.model';
import { AddStarsDto, DeliverGiftDto } from '../../core/models/reward.model';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-stars-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule,
    MatIconModule, MatFormFieldModule, MatInputModule,
    MatSnackBarModule, MatProgressSpinnerModule],
  template: `
    <div class="animate-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">🌟 {{ i18n.t('stars.title') }}</h1>
          <p class="page-subtitle">{{ i18n.t('stars.subtitle') }}</p>
        </div>
      </div>

      <div class="stars-layout">
        <!-- Add/Deduct Stars Section -->
        <mat-card class="stars-card animate-in" style="animation-delay: 0.1s">
          <mat-card-header>
            <mat-icon mat-card-avatar class="card-icon">star_half</mat-icon>
            <mat-card-title>{{ i18n.t('stars.manageStars') }}</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <form [formGroup]="starsForm" (ngSubmit)="manageStars()" class="form-grid">
              
              <div class="child-cards-selector full-width">
                <p>{{ i18n.t('common.selectChild') }}:</p>
                <div class="child-cards-grid">
                  @for (c of children; track c.id) {
                    <div class="child-select-card" 
                         [class.selected]="starsForm.get('childId')?.value === c.id"
                         (click)="starsForm.patchValue({childId: c.id})">
                      <img [src]="getAvatar(c)" [alt]="c.fullName" class="mini-avatar">
                      <div class="child-name">{{ c.fullName }}</div>
                      <div class="child-stars">{{ c.starBalance }} ⭐</div>
                    </div>
                  }
                </div>
              </div>

              <div class="quick-stars full-width" *ngIf="starsForm.get('childId')?.value">
                <button type="button" mat-raised-button color="primary" (click)="setAmount(1)">+1 ⭐</button>
                <button type="button" mat-raised-button color="primary" (click)="setAmount(5)">+5 ⭐</button>
                <button type="button" mat-raised-button color="primary" (click)="setAmount(10)">+10 ⭐</button>
                <button type="button" mat-raised-button color="warn" (click)="setAmount(-5)">-5 ⭐</button>
              </div>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>{{ i18n.t('stars.amount') }}</mat-label>
                <input matInput type="number" formControlName="amount">
              </mat-form-field>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>{{ i18n.t('stars.reason') }}</mat-label>
                <input matInput formControlName="reason">
              </mat-form-field>

              <div class="form-actions full-width">
                <button mat-raised-button class="btn-primary" type="submit" [disabled]="submittingStars || starsForm.invalid">
                  @if (submittingStars) { <mat-spinner diameter="20"></mat-spinner> }
                  @else { <span><mat-icon>send</mat-icon> {{ i18n.t('stars.submitTransaction') }}</span> }
                </button>
              </div>

            </form>
          </mat-card-content>
        </mat-card>

        <!-- Deliver Gift Section -->
        <mat-card class="gift-card animate-in" style="animation-delay: 0.2s">
          <mat-card-header>
            <mat-icon mat-card-avatar class="card-icon">card_giftcard</mat-icon>
            <mat-card-title>{{ i18n.t('stars.deliverGift') }}</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <form [formGroup]="giftForm" (ngSubmit)="deliverGift()" class="form-grid">
              
              <div class="child-cards-selector full-width">
                <p>{{ i18n.t('common.selectChild') }}:</p>
                <div class="child-cards-grid">
                  @for (c of children; track c.id) {
                    <div class="child-select-card gift-select-card" 
                         [class.selected]="giftForm.get('childId')?.value === c.id"
                         (click)="giftForm.patchValue({childId: c.id})">
                      <img [src]="getAvatar(c)" [alt]="c.fullName" class="mini-avatar">
                      <div class="child-name">{{ c.fullName }}</div>
                      <div class="child-stars">{{ c.starBalance }} ⭐</div>
                    </div>
                  }
                </div>
              </div>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>{{ i18n.t('stars.giftName') }}</mat-label>
                <mat-icon matPrefix>card_giftcard</mat-icon>
                <input matInput formControlName="giftName">
              </mat-form-field>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>{{ i18n.t('stars.starsCost') }}</mat-label>
                <mat-icon matPrefix>star</mat-icon>
                <input matInput type="number" formControlName="starsCost">
              </mat-form-field>

              <div class="form-actions full-width">
                <button mat-raised-button class="btn-green" type="submit" [disabled]="submittingGift || giftForm.invalid">
                  @if (submittingGift) { <mat-spinner diameter="20"></mat-spinner> }
                  @else { <span><mat-icon>redeem</mat-icon> {{ i18n.t('stars.deliverAndDeduct') }}</span> }
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
    
    .child-cards-selector { margin-bottom: 8px; }
    .child-cards-selector p { font-weight: 600; color: #636e72; margin: 0 0 12px; }
    .child-cards-grid { display: flex; gap: 12px; flex-wrap: wrap; }
    .child-select-card {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      background: white; border: 2px solid #edf2f7; border-radius: 16px;
      padding: 12px; width: 85px; cursor: pointer; transition: all 0.2s;
    }
    .child-select-card:hover { border-color: #b2ebf2; transform: translateY(-2px); }
    .child-select-card.selected { border-color: var(--accent-teal); background: var(--bg-secondary); box-shadow: 0 4px 12px rgba(77,201,214,0.2); }
    
    .gift-select-card:hover { border-color: #a5d6a7; }
    .gift-select-card.selected { border-color: #4caf50; background: #e8f5e9; box-shadow: 0 4px 12px rgba(76,175,80,0.2); }
    
    .mini-avatar { width: 40px; height: 40px; border-radius: 50%; margin-bottom: 8px; border: 2px solid #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .child-name { font-weight: 600; font-size: 0.8rem; color: #2d3436; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }
    .child-stars { font-size: 0.75rem; color: #f57f17; font-weight: 600; margin-top: 4px; }
    
    @media(max-width: 768px) {
      .half-width { width: 100%; }
    }
  `]
})
export class StarsComponent implements OnInit {
  private userSvc = inject(UserService);
  private walletSvc = inject(WalletService);
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);
  public i18n = inject(I18nService);

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
    this.userSvc.getChildren().subscribe(c => {
      this.children = c.filter(x => x.role !== 'Admin');
    });
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
        this.snack.open(this.i18n.t('common.success') + ' 🌟', this.i18n.t('common.close'), { duration: 3000 });
        this.starsForm.reset({ childId: dto.childId, amount: 0, reason: '' });
        this.submittingStars = false;
        this.loadChildren();
      },
      error: (e) => {
        this.snack.open(e.error?.message || this.i18n.t('common.error'), this.i18n.t('common.close'), { duration: 4000 });
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
        this.snack.open(this.i18n.t('common.success') + ' 🎁', this.i18n.t('common.close'), { duration: 3000 });
        this.giftForm.reset({ childId: dto.childId });
        this.submittingGift = false;
        this.loadChildren();
      },
      error: (e) => {
        this.snack.open(e.error?.message || this.i18n.t('common.error'), this.i18n.t('common.close'), { duration: 4000 });
        this.submittingGift = false;
      }
    });
  }
  getAvatar(child: User): string {
    const url = child.avatarUrl;
    if (url?.startsWith('/uploads')) {
      return `${environment.apiUrl.replace('/api', '')}${url}`;
    }
    return url || 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=' + encodeURIComponent(child.fullName);
  }
}
