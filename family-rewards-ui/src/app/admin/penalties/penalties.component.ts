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
import { MatTableModule } from '@angular/material/table';
import { PenaltyService } from '../../core/services/reward-wallet-penalty.service';
import { UserService } from '../../core/services/user.service';
import { Penalty } from '../../core/models/reward.model';
import { User } from '../../core/models/user.model';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-penalties',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatSnackBarModule,
    MatProgressSpinnerModule, MatTableModule],
  template: `
    <div class="animate-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">⚠️ {{ i18n.t('penalties.title') }}</h1>
          <p class="page-subtitle">{{ i18n.t('penalties.subtitle') }}</p>
        </div>
      </div>

      <mat-card class="add-form-card">
        <mat-card-header><mat-card-title>➖ {{ i18n.t('penalties.issuePenalty') }}</mat-card-title></mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="createPenalty()" class="form-grid">
            <div class="child-cards-selector">
              <p>{{ i18n.t('common.selectChild') }}:</p>
              <div class="child-cards-grid">
                @for (c of children; track c.id) {
                  <div class="child-select-card" 
                       [class.selected]="form.get('childId')?.value === c.id"
                       (click)="form.patchValue({childId: c.id})">
                    <img [src]="getAvatar(c)" [alt]="c.fullName" class="mini-avatar">
                    <div class="child-name">{{ c.fullName }}</div>
                  </div>
                }
              </div>
            </div>
            <mat-form-field appearance="outline">
              <mat-label>{{ i18n.t('penalties.starsToDeduct') }}</mat-label>
              <mat-icon matPrefix>remove_circle</mat-icon>
              <input matInput type="number" formControlName="starsDeducted" min="1">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ i18n.t('penalties.reason') }}</mat-label>
              <mat-icon matPrefix>warning</mat-icon>
              <input matInput formControlName="reason">
            </mat-form-field>
            <div class="form-actions">
              <button mat-raised-button class="btn-danger" type="submit" [disabled]="submitting || form.invalid">
                @if (submitting) { <mat-spinner diameter="20"></mat-spinner> }
                @else { <mat-icon>report</mat-icon> {{ i18n.t('penalties.issuePenalty') }} }
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      @if (selectedChild) {
        <h3 class="sub-heading">{{ i18n.t('penalties.title') }} - {{ selectedChild.fullName }}</h3>
        <mat-card>
          <table mat-table [dataSource]="penalties" class="full-table">
            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef>{{ i18n.t('penalties.date') }}</th>
              <td mat-cell *matCellDef="let p">{{ p.createdAt | date:'MMM d, y' }}</td>
            </ng-container>
            <ng-container matColumnDef="stars">
              <th mat-header-cell *matHeaderCellDef>{{ i18n.t('common.stars') }}</th>
              <td mat-cell *matCellDef="let p"><span class="text-red">-{{ p.starsDeducted }} ⭐</span></td>
            </ng-container>
            <ng-container matColumnDef="reason">
              <th mat-header-cell *matHeaderCellDef>{{ i18n.t('penalties.reason') }}</th>
              <td mat-cell *matCellDef="let p">{{ p.reason }}</td>
            </ng-container>
            <ng-container matColumnDef="by">
              <th mat-header-cell *matHeaderCellDef>{{ i18n.t('penalties.issuedBy') }}</th>
              <td mat-cell *matCellDef="let p">{{ p.createdByName }}</td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="cols"></tr>
            <tr mat-row *matRowDef="let row; columns: cols;"></tr>
          </table>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .add-form-card { margin-bottom: 24px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 16px; }
    .full-width { grid-column: 1/-1; }
    .form-actions { grid-column: 1/-1; display: flex; justify-content: flex-end; }
    .sub-heading { font-size: 1rem; font-weight: 700; color: #636e72; margin: 24px 0 16px; text-transform: uppercase; letter-spacing: 1px; }
    .btn-danger { background: linear-gradient(135deg, #ef5350, #e57373) !important; color: white !important; border-radius: 14px !important; font-family: 'Fredoka', sans-serif !important; font-weight: 600 !important; }
    .text-red { color: #c62828; font-weight: 700; }
    
    .child-cards-selector { grid-column: 1/-1; margin-bottom: 16px; }
    .child-cards-selector p { font-weight: 600; color: #636e72; margin: 0 0 12px; }
    .child-cards-grid { display: flex; gap: 12px; flex-wrap: wrap; }
    .child-select-card {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      background: white; border: 2px solid #edf2f7; border-radius: 16px;
      padding: 12px; width: 100px; cursor: pointer; transition: all 0.2s;
    }
    .child-select-card:hover { border-color: #ef9a9a; transform: translateY(-2px); }
    .child-select-card.selected { border-color: #e53935; background: #ffebee; box-shadow: 0 4px 12px rgba(229,57,53,0.2); }
    .mini-avatar { width: 44px; height: 44px; border-radius: 50%; margin-bottom: 8px; border: 2px solid #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .child-name { font-weight: 600; font-size: 0.85rem; color: #2d3436; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }
    
    @media(max-width: 768px) {
      .form-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class PenaltiesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private penaltySvc = inject(PenaltyService);
  private userSvc = inject(UserService);
  private snack = inject(MatSnackBar);
  public i18n = inject(I18nService);

  children: User[] = [];
  penalties: Penalty[] = [];
  selectedChild: User | null = null;
  submitting = false;
  cols = ['date', 'stars', 'reason', 'by'];
  form = this.fb.group({
    childId: [null as number | null, Validators.required],
    starsDeducted: [5, [Validators.required, Validators.min(1)]],
    reason: ['', Validators.required]
  });

  constructor() {}

  ngOnInit() {
    this.userSvc.getChildren().subscribe(c => this.children = c);
    this.form.get('childId')?.valueChanges.subscribe(id => {
      if (id) {
        this.selectedChild = this.children.find(c => c.id === id) || null;
        this.penaltySvc.getPenalties(id).subscribe(p => this.penalties = p);
      }
    });
  }

  createPenalty() {
    if (this.form.invalid) return;
    this.submitting = true;
    this.penaltySvc.createPenalty(this.form.value as any).subscribe({
      next: () => {
        this.snack.open(this.i18n.t('common.success') + '!', this.i18n.t('common.close'), { duration: 3000 });
        const id = Number(this.form.value.childId);
        this.penaltySvc.getPenalties(id).subscribe(p => this.penalties = p);
        this.form.patchValue({ starsDeducted: 5, reason: '' });
        this.submitting = false;
      },
      error: (e) => { this.snack.open(e.error?.message || this.i18n.t('common.error'), this.i18n.t('common.close'), { duration: 4000 }); this.submitting = false; }
    });
  }

  getAvatar(child: User): string {
    const url = child.avatarUrl;
    if (url?.startsWith('/uploads')) {
      return `http://localhost:5000${url}`;
    }
    return url || 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=' + encodeURIComponent(child.fullName);
  }
}
