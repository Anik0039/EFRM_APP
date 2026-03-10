import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../../core/services/auth.service';

interface ModuleCard {
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  accentColor: string;
  route: string;
  externalUrl?: string;
  tags: string[];
}

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.scss',
})
export class DashboardHomeComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  get userName(): string {
    return this.authService.getUser()?.username ?? 'User';
  }

  get userRole(): string {
    return this.authService.getUser()?.role ?? '';
  }

  modules: ModuleCard[] = [
    {
      title: 'EFRM',
      description:
        'Enterprise Fraud Detection & Risk Management — Real-time transaction monitoring, AI/ML behavioral analytics, alert management, and case investigation across all banking channels.',
      icon: 'pi pi-shield',
      iconColor: '#1b498a',
      iconBg: '#eef3fa',
      accentColor: '#1b498a',
      route: '/dashboard/efrm',
      tags: ['Real-time Monitoring', 'AI/ML Analytics', 'Case Management'],
    },
    {
      title: 'User Management',
      description:
        'Centralized user account administration with role-based access control, maker-checker workflows, Active Directory integration, and comprehensive audit trails.',
      icon: 'pi pi-users',
      iconColor: '#1b498a',
      iconBg: '#eef3fa',
      accentColor: '#1b498a',
      route: '/dashboard',
      tags: ['RBAC', 'Audit Trail', 'AD / LDAP'],
    },
    {
      title: 'EFRM Rule Engine',
      description:
        'Anti-Money Laundering policy configuration, risk scoring, STR/SAR report generation, and regulatory compliance monitoring aligned with Bangladesh Bank and BFIU directives.',
      icon: 'pi pi-book',
      iconColor: '#1b498a',
      iconBg: '#eef3fa',
      accentColor: '#1b498a',
      route: '',
      externalUrl: 'https://efrm-rule-engine.vercel.app/gorules',
      tags: ['STR / SAR', 'Risk Scoring', 'Compliance'],
    },
  ];

  navigate(mod: ModuleCard): void {
    if (mod.externalUrl) {
      window.open(mod.externalUrl, '_blank', 'noopener,noreferrer');
    } else {
      this.router.navigate([mod.route]);
    }
  }
}
