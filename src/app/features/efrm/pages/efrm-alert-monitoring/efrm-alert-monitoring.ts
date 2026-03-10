import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

type AlertStatus = 'Triggered' | 'Under Review' | 'Closed' | 'Escalated';
type AlertCategory = 'General Banking' | 'Credit' | 'Trade Based' | 'Remittance';

interface Alert {
  alertId: string;
  ruleId: string;
  category: AlertCategory;
  categoryClass: string;
  status: AlertStatus;
  statusClass: string;
  variance: number;
  date: string;
  reason: string;
}

@Component({
  selector: 'app-efrm-alert-monitoring',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule],
  templateUrl: './efrm-alert-monitoring.html',
  styleUrl: './efrm-alert-monitoring.scss',
})
export class EfrmAlertMonitoringComponent {
  private readonly router = inject(Router);

  allAlerts: Alert[] = [
    {
      alertId: 'ALT-GB001-01',
      ruleId: 'GB-001',
      category: 'General Banking',
      categoryClass: 'general-banking',
      status: 'Triggered',
      statusClass: 'triggered',
      variance: 85,
      date: '02-Mar-2026',
      reason: 'Customer made three deposits between BDT 900,000 and 999,999 within 30 days which indicates structuring to avoid regulatory reporting.',
    },
    {
      alertId: 'ALT-GB001-02',
      ruleId: 'GB-001',
      category: 'General Banking',
      categoryClass: 'general-banking',
      status: 'Closed',
      statusClass: 'closed',
      variance: 45,
      date: '27-Mar-2026',
      reason: 'Deposits correspond to legitimate monthly retail cash collections supported by business records.',
    },
    {
      alertId: 'ALT-GB002-01',
      ruleId: 'GB-002',
      category: 'General Banking',
      categoryClass: 'general-banking',
      status: 'Under Review',
      statusClass: 'under-review',
      variance: 92,
      date: '15-Mar-2026',
      reason: 'Transaction amount BDT 4,500,000 exceeds twice the customer\'s largest transaction in the last six months.',
    },
    {
      alertId: 'ALT-GB002-02',
      ruleId: 'GB-002',
      category: 'General Banking',
      categoryClass: 'general-banking',
      status: 'Closed',
      statusClass: 'closed',
      variance: 38,
      date: '21-Mar-2026',
      reason: 'Customer sold a property and received proceeds supported by legal documents.',
    },
    {
      alertId: 'ALT-CR005-01',
      ruleId: 'CR-005',
      category: 'Credit',
      categoryClass: 'credit',
      status: 'Under Review',
      statusClass: 'under-review',
      variance: 78,
      date: '10-Apr-2026',
      reason: 'Loan intended for SME machinery purchase used to buy a luxury car.',
    },
    {
      alertId: 'ALT-CR005-02',
      ruleId: 'CR-005',
      category: 'Credit',
      categoryClass: 'credit',
      status: 'Closed',
      statusClass: 'closed',
      variance: 40,
      date: '15-Apr-2026',
      reason: 'Payment was actually made to an approved supplier through a logistics intermediary.',
    },
    {
      alertId: 'ALT-TB008-01',
      ruleId: 'TB-008',
      category: 'Trade Based',
      categoryClass: 'trade-based',
      status: 'Escalated',
      statusClass: 'escalated',
      variance: 90,
      date: '18-Apr-2026',
      reason: 'Invoice price of steel rod 25% higher than historical average price.',
    },
    {
      alertId: 'ALT-TB008-02',
      ruleId: 'TB-008',
      category: 'Trade Based',
      categoryClass: 'trade-based',
      status: 'Closed',
      statusClass: 'closed',
      variance: 35,
      date: '22-Apr-2026',
      reason: 'Price difference caused by global steel price increase.',
    },
    {
      alertId: 'ALT-RM003-01',
      ruleId: 'RM-003',
      category: 'Remittance',
      categoryClass: 'remittance',
      status: 'Triggered',
      statusClass: 'triggered',
      variance: 83,
      date: '25-Apr-2026',
      reason: 'Remittance received from high-risk jurisdiction with unclear relationship to sender.',
    },
    {
      alertId: 'ALT-RM003-02',
      ruleId: 'RM-003',
      category: 'Remittance',
      categoryClass: 'remittance',
      status: 'Closed',
      statusClass: 'closed',
      variance: 42,
      date: '27-Apr-2026',
      reason: 'Customer receives regular salary remittance from overseas employment.',
    },
  ];

  categories: AlertCategory[] = ['General Banking', 'Credit', 'Trade Based', 'Remittance'];
  statuses: AlertStatus[] = ['Triggered', 'Under Review', 'Closed', 'Escalated'];

  selectedRuleId = 'All Rules';
  selectedCategory = 'All Categories';
  selectedStatus = 'All Status';
  dateFrom = '';
  dateTo = '';
  searchTerm = '';

  get ruleIds(): string[] {
    return [...new Set(this.allAlerts.map((a) => a.ruleId))];
  }

  get stats() {
    return {
      totalAlerts: this.allAlerts.length,
      highRisk: this.allAlerts.filter((a) => a.variance >= 70).length,
      mediumRisk: this.allAlerts.filter((a) => a.variance >= 40 && a.variance < 70).length,
      investigating: this.allAlerts.filter((a) => a.status === 'Under Review').length,
    };
  }

  get filteredAlerts(): Alert[] {
    let alerts = [...this.allAlerts];

    if (this.selectedRuleId !== 'All Rules') {
      alerts = alerts.filter((a) => a.ruleId === this.selectedRuleId);
    }
    if (this.selectedCategory !== 'All Categories') {
      alerts = alerts.filter((a) => a.category === this.selectedCategory);
    }
    if (this.selectedStatus !== 'All Status') {
      alerts = alerts.filter((a) => a.status === this.selectedStatus);
    }
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.trim().toLowerCase();
      alerts = alerts.filter(
        (a) =>
          a.alertId.toLowerCase().includes(term) ||
          a.ruleId.toLowerCase().includes(term) ||
          a.reason.toLowerCase().includes(term),
      );
    }

    return alerts;
  }

  // Pagination
  currentPage = 1;
  pageSize = 10;

  get totalPages(): number {
    return Math.ceil(this.filteredAlerts.length / this.pageSize);
  }

  get paginatedAlerts(): Alert[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredAlerts.slice(start, start + this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  applyFilters() {
    this.currentPage = 1;
  }

  clearFilters() {
    this.selectedRuleId = 'All Rules';
    this.selectedCategory = 'All Categories';
    this.selectedStatus = 'All Status';
    this.dateFrom = '';
    this.dateTo = '';
    this.searchTerm = '';
    this.currentPage = 1;
  }

  openAlert(alert: Alert) {
    this.router.navigate(['/dashboard/efrm/alert', alert.alertId]);
  }
}
