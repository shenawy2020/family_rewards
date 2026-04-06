import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import en from '../../../assets/i18n/en.json';
import ar from '../../../assets/i18n/ar.json';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private _en = en;
  private _ar = ar;
  private translations: any = this._en;
  
  private langSubject = new BehaviorSubject<string>('en');
  lang$ = this.langSubject.asObservable();

  constructor() {
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
    
    this.translations = lang === 'ar' ? this._ar : this._en;
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
