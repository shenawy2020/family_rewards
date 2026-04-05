import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FamilyTask, CreateTaskDto, TaskCompletion, CompleteTaskDto, ApproveTaskDto } from '../models/task.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly API = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  getTasks(): Observable<FamilyTask[]> {
    return this.http.get<FamilyTask[]>(this.API);
  }

  createTask(dto: CreateTaskDto): Observable<FamilyTask> {
    return this.http.post<FamilyTask>(this.API, dto);
  }

  getPendingCompletions(): Observable<TaskCompletion[]> {
    return this.http.get<TaskCompletion[]>(`${this.API}/pending`);
  }

  getMyCompletions(): Observable<TaskCompletion[]> {
    return this.http.get<TaskCompletion[]>(`${this.API}/my-completions`);
  }

  completeTask(dto: CompleteTaskDto): Observable<TaskCompletion> {
    return this.http.post<TaskCompletion>(`${this.API}/complete`, dto);
  }

  approveTask(dto: ApproveTaskDto): Observable<TaskCompletion> {
    return this.http.post<TaskCompletion>(`${this.API}/approve`, dto);
  }
}
