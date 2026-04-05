import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reward, CreateRewardDto, Wallet, Transaction, Penalty, CreatePenaltyDto } from '../models/reward.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RewardService {
  private readonly API = `${environment.apiUrl}/rewards`;
  constructor(private http: HttpClient) {}

  getRewards(): Observable<Reward[]> { return this.http.get<Reward[]>(this.API); }
  createReward(dto: CreateRewardDto): Observable<Reward> { return this.http.post<Reward>(this.API, dto); }
  redeemReward(rewardId: number): Observable<any> { return this.http.post(`${this.API}/redeem`, { rewardId }); }
}

@Injectable({ providedIn: 'root' })
export class WalletService {
  private readonly API = `${environment.apiUrl}/wallet`;
  constructor(private http: HttpClient) {}

  getWallet(childId: number): Observable<Wallet> { return this.http.get<Wallet>(`${this.API}/${childId}`); }
  getMyWallet(): Observable<Wallet> { return this.http.get<Wallet>(`${this.API}/my-wallet`); }
  getTransactions(childId: number): Observable<Transaction[]> { return this.http.get<Transaction[]>(`${this.API}/transactions/${childId}`); }
}

@Injectable({ providedIn: 'root' })
export class PenaltyService {
  private readonly API = `${environment.apiUrl}/penalties`;
  constructor(private http: HttpClient) {}

  createPenalty(dto: CreatePenaltyDto): Observable<Penalty> { return this.http.post<Penalty>(this.API, dto); }
  getPenalties(childId: number): Observable<Penalty[]> { return this.http.get<Penalty[]>(`${this.API}/${childId}`); }
  getMyPenalties(): Observable<Penalty[]> { return this.http.get<Penalty[]>(`${this.API}/my-penalties`); }
}
