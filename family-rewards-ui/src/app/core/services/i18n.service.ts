import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private translations: any = {};
  private langSubject = new BehaviorSubject<string>('en');
  lang$ = this.langSubject.asObservable();

  constructor(private http: HttpClient) {
    const saved = localStorage.getItem('app_lang') || 'en';
    this.setLanguage(saved);
  }

  get currentLang(): string {
    return this.langSubject.value;
  }

  get isRtl(): boolean {
    return this.currentLang === 'ar';
  }

  setLanguage(lang: string) {
    this.langSubject.next(lang);
    localStorage.setItem('app_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.body.style.direction = lang === 'ar' ? 'rtl' : 'ltr';

    this.http.get(`/assets/i18n/${lang}.json`).subscribe({
      next: (data) => { this.translations = data; },
      error: () => { console.error(`Failed to load ${lang} translations`); }
    });
  }

  t(key: string): string {
    const keys = key.split('.');
    let result: any = this.translations;
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) return key;
    }
    return result || key;
  }
}
