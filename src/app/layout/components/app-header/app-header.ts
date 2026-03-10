import { Component, EventEmitter, HostListener, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { AuthService } from '../../../core/services/auth.service';

interface Notification {
  id: number;
  icon: string;
  iconClass: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ButtonModule, AvatarModule, BadgeModule],
  templateUrl: './app-header.html',
  styleUrl: './app-header.scss',
})
export class AppHeaderComponent {
  @Input() showMenuToggle = true;
  @Output() menuToggle = new EventEmitter<void>();

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly showNotifications = signal(false);

  readonly notifications = signal<Notification[]>([
    {
      id: 1,
      icon: 'pi pi-exclamation-triangle',
      iconClass: 'notif-icon high',
      title: 'High Risk Alert — GB-001',
      message: 'Splitting of cash deposits detected: Account AC-78234 flagged for 4 deposits between BDT 900K–999K in 7 days.',
      time: '2 min ago',
      read: false,
    },
    {
      id: 2,
      icon: 'pi pi-shield',
      iconClass: 'notif-icon medium',
      title: 'Rule Activation Pending',
      message: 'Rule TB-008 (Trade Invoice Discrepancy) requires Checker Approval before activation.',
      time: '15 min ago',
      read: false,
    },
    {
      id: 3,
      icon: 'pi pi-bell',
      iconClass: 'notif-icon info',
      title: 'Remittance Alert — RM-003',
      message: 'Incoming remittance of BDT 850,000 from high-risk jurisdiction (Country: Myanmar). Investigation required.',
      time: '32 min ago',
      read: false,
    },
    {
      id: 4,
      icon: 'pi pi-user-plus',
      iconClass: 'notif-icon success',
      title: 'New User Created',
      message: 'User "Tanvir Islam" (EMP004) has been added to the system with Analyst role.',
      time: '1 hr ago',
      read: true,
    },
    {
      id: 5,
      icon: 'pi pi-check-circle',
      iconClass: 'notif-icon success',
      title: 'STR Report Filed',
      message: 'Suspicious Transaction Report #STR-2026-0047 has been submitted to BFIU successfully.',
      time: '2 hrs ago',
      read: true,
    },
    {
      id: 6,
      icon: 'pi pi-exclamation-triangle',
      iconClass: 'notif-icon high',
      title: 'Dormant Account Activity — GB-006',
      message: 'Account AC-12890 (dormant 14 months) received BDT 1,200,000 wire transfer. Immediate review needed.',
      time: '3 hrs ago',
      read: true,
    },
  ]);

  get userName(): string {
    return this.authService.getUser()?.username ?? 'User';
  }

  get userRole(): string {
    return this.authService.getUser()?.role ?? '';
  }

  get avatarLabel(): string {
    return this.userName.charAt(0).toUpperCase();
  }

  get unreadCount(): number {
    return this.notifications().filter((n) => !n.read).length;
  }

  onToggleMenu(): void {
    this.menuToggle.emit();
  }

  toggleNotifications(event: Event): void {
    event.stopPropagation();
    this.showNotifications.update((v) => !v);
  }

  markAsRead(notif: Notification): void {
    if (!notif.read) {
      this.notifications.update((list) =>
        list.map((n) => (n.id === notif.id ? { ...n, read: true } : n)),
      );
    }
  }

  markAllRead(): void {
    this.notifications.update((list) => list.map((n) => ({ ...n, read: true })));
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    if (this.showNotifications()) {
      this.showNotifications.set(false);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
