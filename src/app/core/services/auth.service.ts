import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface User {
  username: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly loggedIn = signal(false);
  private readonly currentUser = signal<User | null>(null);

  private readonly USERS: { username: string; password: string; role: string }[] = [
    {
      username: 'admin',
      password: '123',
      role: 'Administrator',
    },
    { username: 'analyst', password: 'Analyst@123', role: 'Analyst' },
    { username: 'compliance', password: 'Comply@123', role: 'Compliance Officer' },
  ];

  isLoggedIn(): boolean {
    return this.loggedIn();
  }

  getUser(): User | null {
    return this.currentUser();
  }

  login(username: string, password: string): boolean {
    const match = this.USERS.find((u) => u.username === username && u.password === password);
    if (match) {
      this.loggedIn.set(true);
      this.currentUser.set({ username: match.username, role: match.role });
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('efrm-auth', 'true');
        localStorage.setItem(
          'efrm-user',
          JSON.stringify({ username: match.username, role: match.role }),
        );
      }
      return true;
    }
    return false;
  }

  logout(): void {
    this.loggedIn.set(false);
    this.currentUser.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('efrm-auth');
      localStorage.removeItem('efrm-user');
    }
  }

  restoreSession(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const saved = localStorage.getItem('efrm-auth') === 'true';
    this.loggedIn.set(saved);
    if (saved) {
      const userJson = localStorage.getItem('efrm-user');
      if (userJson) {
        this.currentUser.set(JSON.parse(userJson));
      }
    }
  }
}
