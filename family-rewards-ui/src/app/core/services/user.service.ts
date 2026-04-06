import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, AddChildDto, UpdateChildDto, ResetPasswordDto, ChangePasswordDto } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly API = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  addChild(dto: AddChildDto): Observable<User> {
    return this.http.post<User>(`${this.API}/add-child`, dto);
  }

  updateChild(id: number, dto: UpdateChildDto): Observable<User> {
    return this.http.put<User>(`${this.API}/update-child/${id}`, dto);
  }

  uploadAvatar(id: number, file: File): Observable<User> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<User>(`${this.API}/${id}/avatar`, formData);
  }

  resetPassword(id: number, dto: ResetPasswordDto): Observable<any> {
    return this.http.put(`${this.API}/reset-child-password/${id}`, dto);
  }

  changePassword(dto: ChangePasswordDto): Observable<any> {
    return this.http.put(`${this.API}/change-password`, dto);
  }

  getChildren(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API}/children`);
  }

  getLeaderboard(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API}/leaderboard`);
  }
}
