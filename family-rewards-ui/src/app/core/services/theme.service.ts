import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ThemePalette {
  name: string;
  key: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  gradient: string;
  bgPrimary: string;
  bgSecondary: string;
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private themeSubject = new BehaviorSubject<string>('teal');
  theme$ = this.themeSubject.asObservable();

  readonly palettes: ThemePalette[] = [
    { name: 'Teal', key: 'teal', primary: '#4dc9d6', primaryLight: '#b2ebf2', primaryDark: '#00838f', gradient: 'linear-gradient(135deg, #4dc9d6 0%, #45b7d1 40%, #42a5f5 100%)', bgPrimary: '#e8f6f8', bgSecondary: '#d4f0f5' },
    { name: 'Purple', key: 'purple', primary: '#ab47bc', primaryLight: '#e1bee7', primaryDark: '#6a1b9a', gradient: 'linear-gradient(135deg, #ab47bc 0%, #9c27b0 40%, #7b1fa2 100%)', bgPrimary: '#f3e5f5', bgSecondary: '#e8d5f5' },
    { name: 'Blue', key: 'blue', primary: '#42a5f5', primaryLight: '#bbdefb', primaryDark: '#1565c0', gradient: 'linear-gradient(135deg, #42a5f5 0%, #2196f3 40%, #1976d2 100%)', bgPrimary: '#e3f2fd', bgSecondary: '#d0e8fc' },
    { name: 'Green', key: 'green', primary: '#66bb6a', primaryLight: '#c8e6c9', primaryDark: '#2e7d32', gradient: 'linear-gradient(135deg, #66bb6a 0%, #4caf50 40%, #388e3c 100%)', bgPrimary: '#e8f5e9', bgSecondary: '#d5efd7' },
    { name: 'Pink', key: 'pink', primary: '#ec407a', primaryLight: '#f8bbd0', primaryDark: '#c2185b', gradient: 'linear-gradient(135deg, #ec407a 0%, #e91e63 40%, #d81b60 100%)', bgPrimary: '#fce4ec', bgSecondary: '#f8d1dc' },
    { name: 'Orange', key: 'orange', primary: '#ffa726', primaryLight: '#ffe0b2', primaryDark: '#e65100', gradient: 'linear-gradient(135deg, #ffa726 0%, #ff9800 40%, #f57c00 100%)', bgPrimary: '#fff3e0', bgSecondary: '#ffe6c9' },
  ];

  constructor(private http: HttpClient) {
    const saved = localStorage.getItem('app_theme') || 'teal';
    this.applyTheme(saved);
  }

  get currentTheme(): string {
    return this.themeSubject.value;
  }

  getPalette(key?: string): ThemePalette {
    return this.palettes.find(p => p.key === (key || this.currentTheme)) || this.palettes[0];
  }

  applyTheme(key: string) {
    const palette = this.getPalette(key);
    if (!palette) return;

    this.themeSubject.next(key);
    localStorage.setItem('app_theme', key);

    const root = document.documentElement;
    root.style.setProperty('--accent-teal', palette.primary);
    root.style.setProperty('--bg-primary', palette.bgPrimary);
    root.style.setProperty('--bg-secondary', palette.bgSecondary);
    root.style.setProperty('--nav-gradient', palette.gradient);
    root.style.setProperty('--accent-primary', palette.primary);
    root.style.setProperty('--accent-primary-light', palette.primaryLight);
    root.style.setProperty('--accent-primary-dark', palette.primaryDark);
  }

  saveToServer(themeColor: string) {
    return this.http.put(`${environment.apiUrl}/users/preferences`, { themeColor });
  }
}
