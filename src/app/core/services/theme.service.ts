import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Theme = 'light' | 'dark' | 'auto';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'restaurant-app-theme';
  private themeSubject = new BehaviorSubject<Theme>('light');
  
  constructor() {
    this.initializeTheme();
  }

  get theme$(): Observable<Theme> {
    return this.themeSubject.asObservable();
  }

  get currentTheme(): Theme {
    return this.themeSubject.value;
  }

  private initializeTheme(): void {
    const savedTheme = this.getSavedTheme();
    const systemTheme = this.getSystemTheme();
    
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else if (systemTheme) {
      this.setTheme('auto');
    } else {
      this.setTheme('light');
    }
  }

  setTheme(theme: Theme): void {
    this.themeSubject.next(theme);
    this.saveTheme(theme);
    this.applyTheme(theme);
  }

  toggleTheme(): void {
    const currentTheme = this.currentTheme;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  private applyTheme(theme: Theme): void {
    const htmlElement = document.documentElement;
    
    // Remove existing theme classes
    htmlElement.removeAttribute('data-bs-theme');
    htmlElement.classList.remove('light-theme', 'dark-theme');
    
    if (theme === 'auto') {
      const systemTheme = this.getSystemTheme();
      htmlElement.setAttribute('data-bs-theme', systemTheme);
      htmlElement.classList.add(`${systemTheme}-theme`);
    } else {
      htmlElement.setAttribute('data-bs-theme', theme);
      htmlElement.classList.add(`${theme}-theme`);
    }
  }

  private getSystemTheme(): 'light' | 'dark' {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }

  private getSavedTheme(): Theme | null {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(this.THEME_KEY);
      return saved as Theme || null;
    }
    return null;
  }

  private saveTheme(theme: Theme): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.THEME_KEY, theme);
    }
  }

  // Listen for system theme changes when auto mode is enabled
  watchSystemTheme(): void {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', () => {
        if (this.currentTheme === 'auto') {
          this.applyTheme('auto');
        }
      });
    }
  }

  isDarkMode(): boolean {
    const currentTheme = this.currentTheme;
    if (currentTheme === 'auto') {
      return this.getSystemTheme() === 'dark';
    }
    return currentTheme === 'dark';
  }

  isLightMode(): boolean {
    return !this.isDarkMode();
  }
}
