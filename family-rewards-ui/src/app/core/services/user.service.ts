import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, AddChildDto } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly API = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  addChild(dto: AddChildDto): Observable<User> {
    return this.http.post<User>(`${this.API}/add-child`, dto);
  }

  getChildren(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API}/children`);
  }

  getLeaderboard(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API}/leaderboard`);
  }
}
