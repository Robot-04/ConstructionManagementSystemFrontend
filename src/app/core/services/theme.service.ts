import { Injectable } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})

export class ThemeService {

  private readonly storageKey = 'construction-theme';

  constructor() {
    this.initializeTheme();
  }

  setTheme(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.storageKey, theme);
  }

  getTheme(): Theme {
    const storedTheme = localStorage.getItem(this.storageKey);

    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }

    return this.getSystemTheme();
  }

  toggleTheme(): void {
    const currentTheme = this.getTheme();

    this.setTheme(
      currentTheme === 'light' ? 'dark' : 'light'
    );
  }

  private initializeTheme(): void {
    this.setTheme(this.getTheme());
  }

  private getSystemTheme(): Theme {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
}
