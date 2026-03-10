import { Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AppHeaderComponent } from '../components/app-header/app-header';
import { AppSidebarComponent } from '../components/app-sidebar/app-sidebar';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AppHeaderComponent, AppSidebarComponent, ToastModule, ConfirmDialogModule],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss',
})
export class DashboardLayoutComponent {
  private readonly router = inject(Router);

  readonly sidebarCollapsed = signal(false);
  readonly sidebarMobileOpen = signal(false);
  readonly showSidebar = signal(false);

  constructor() {
    this.updateSidebarVisibility(this.router.url);

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => this.updateSidebarVisibility(e.urlAfterRedirects));
  }

  private updateSidebarVisibility(url: string): void {
    const isDashboardHome = url === '/dashboard' || url === '/dashboard/';
    this.showSidebar.set(!isDashboardHome);
  }

  private isMobile(): boolean {
    return typeof window !== 'undefined' && window.innerWidth <= 991;
  }

  toggleSidebar(): void {
    if (this.isMobile()) {
      this.sidebarMobileOpen.update(v => !v);
    } else {
      this.sidebarCollapsed.update(v => !v);
    }
  }

  closeMobileSidebar(): void {
    this.sidebarMobileOpen.set(false);
  }

  @HostListener('window:resize')
  onResize(): void {
    if (!this.isMobile()) {
      this.sidebarMobileOpen.set(false);
    }
  }
}
