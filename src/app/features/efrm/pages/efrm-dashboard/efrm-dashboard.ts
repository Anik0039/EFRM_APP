import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

interface OverviewCard {
  label: string;
  value: string;
  accentClass: string;
  subtitle: string;
}

interface QuickLink {
  title: string;
  description: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-efrm-dashboard',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './efrm-dashboard.html',
  styleUrl: './efrm-dashboard.scss',
})
export class EfrmDashboardComponent {
  private readonly router = inject(Router);

  overviewCards: OverviewCard[] = [
    {
      label: 'Monitored Rules',
      value: '42',
      accentClass: 'rules',
      subtitle: 'Active across all channels',
    },
    {
      label: 'Alerts Today',
      value: '18',
      accentClass: 'alerts',
      subtitle: 'Triggered in last 24 hours',
    },
    {
      label: 'Open Alerts',
      value: '37',
      accentClass: 'open-alerts',
      subtitle: 'In investigation queue',
    },
    {
      label: 'Pending Approvals',
      value: '9',
      accentClass: 'approvals',
      subtitle: 'Rules and categories',
    },
  ];

  quickLinks: QuickLink[] = [
    {
      title: 'Rule Dashboard',
      description: 'View, activate and configure transaction monitoring rules.',
      icon: 'pi pi-sliders-h',
      route: '/dashboard/efrm/rules',
    },
    {
      title: 'Alert Monitoring',
      description: 'Monitor generated alerts and prioritize investigations.',
      icon: 'pi pi-bell',
      route: '/dashboard/efrm/alert',
    },
    {
      title: 'Category Setup',
      description: 'Maintain suspicious transaction categories and risk domains.',
      icon: 'pi pi-list',
      route: '/dashboard/efrm/categories',
    },
    {
      title: 'Approvals',
      description: 'Review and approve rule and category changes.',
      icon: 'pi pi-check-circle',
      route: '/dashboard/efrm/approvals',
    },
    {
      title: 'AI Assistant',
      description: 'Ask questions and get recommendations for EFRM tuning.',
      icon: 'pi pi-robot',
      route: '/dashboard/efrm/ai-assistant',
    },
  ];

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  gotoAlerts(): void {
    this.router.navigate(['/dashboard/efrm/alert']);
  }

  gotoRules(): void {
    this.router.navigate(['/dashboard/efrm/rules']);
  }
}

