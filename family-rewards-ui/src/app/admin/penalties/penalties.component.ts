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
          <h1 class="page-title">⚠️ Penalties</h1>
          <p class="page-subtitle">Deduct stars for misbehavior</p>
        </div>
      </div>

      <mat-card class="add-form-card">
        <mat-card-header><mat-card-title>➖ Issue Penalty</mat-card-title></mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="createPenalty()" class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Select Child</mat-label>
              <mat-icon matPrefix>child_care</mat-icon>
              <mat-select formControlName="childId">
                @for (child of children; track child.id) {
                  <mat-option [value]="child.id">{{ child.fullName }}</mat-option>
                }
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Stars to Deduct</mat-label>
              <mat-icon matPrefix>remove_circle</mat-icon>
              <input matInput type="number" formControlName="starsDeducted" min="1">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Reason</mat-label>
              <mat-icon matPrefix>warning</mat-icon>
              <input matInput formControlName="reason" placeholder="Didn't complete homework...">
            </mat-form-field>
            <div class="form-actions">
              <button mat-raised-button class="btn-danger" type="submit" [disabled]="submitting || form.invalid">
                @if (submitting) { <mat-spinner diameter="20"></mat-spinner> }
                @else { <mat-icon>report</mat-icon> Issue Penalty }
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      @if (selectedChild) {
        <h3 class="sub-heading">Penalties for {{ selectedChild.fullName }}</h3>
        <mat-card>
          <table mat-table [dataSource]="penalties" class="full-table">
            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef>Date</th>
              <td mat-cell *matCellDef="let p">{{ p.createdAt | date:'MMM d, y' }}</td>
            </ng-container>
            <ng-container matColumnDef="stars">
              <th mat-header-cell *matHeaderCellDef>Stars</th>
              <td mat-cell *matCellDef="let p"><span class="text-red">-{{ p.starsDeducted }} ⭐</span></td>
            </ng-container>
            <ng-container matColumnDef="reason">
              <th mat-header-cell *matHeaderCellDef>Reason</th>
              <td mat-cell *matCellDef="let p">{{ p.reason }}</td>
            </ng-container>
            <ng-container matColumnDef="by">
              <th mat-header-cell *matHeaderCellDef>Issued By</th>
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
    .full-table { width: 100%; }
    .text-red { color: #c62828; font-weight: 700; }
  `]
})
export class PenaltiesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private penaltySvc = inject(PenaltyService);
  private userSvc = inject(UserService);
  private snack = inject(MatSnackBar);

  children: User[] = [];
  penalties: Penalty[] = [];
  selectedChild: User | null = null;
  submitting = false;
  cols = ['date', 'stars', 'reason', 'by'];
  form = this.fb.group({
    childId: [null, Validators.required],
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
        this.snack.open('Penalty issued.', 'Close', { duration: 3000 });
        const id = Number(this.form.value.childId);
        this.penaltySvc.getPenalties(id).subscribe(p => this.penalties = p);
        this.form.patchValue({ starsDeducted: 5, reason: '' });
        this.submitting = false;
      },
      error: (e) => { this.snack.open(e.error?.message || 'Error', 'Close', { duration: 4000 }); this.submitting = false; }
    });
  }
}
