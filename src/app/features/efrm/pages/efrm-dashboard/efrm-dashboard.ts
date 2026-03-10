import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';

interface SummaryCard {
  label: string;
  value: number;
  icon: string;
  iconBg: string;
  iconColor: string;
  valueColor: string;
  route: string;
}

interface AlertAssignment {
  alertId: string;
  customer: string;
  category: string;
  categoryClass: string;
  priority: 'High' | 'Medium' | 'Low';
  status: string;
  statusClass: string;
  ruleId: string;
}

interface CategoryCount {
  name: string;
  color: string;
  count: number;
  route: string;
}

interface PriorityCount {
  name: string;
  color: string;
  count: number;
}

interface AiInsight {
  title: string;
  description: string;
  recommendation: string;
  icon: string;
  iconColor: string;
  borderColor: string;
}

interface RecentAlert {
  alertId: string;
  customer: string;
  account: string;
  rule: string;
  category: string;
  categoryClass: string;
  status: string;
  statusClass: string;
  variance: string;
  dateTime: string;
}

interface PieSlice {
  name: string;
  percentage: number;
  color: string;
  path: string;
  labelX: number;
  labelY: number;
}

@Component({
  selector: 'app-efrm-dashboard',
  standalone: true,
  imports: [CommonModule, ButtonModule, FormsModule],
  templateUrl: './efrm-dashboard.html',
  styleUrl: './efrm-dashboard.scss',
})
export class EfrmDashboardComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  timeFilter = 'Last 24 Hours';

  // Real data from across the project
  private readonly allAlerts = [
    { alertId: 'ALT-GB001-01', ruleId: 'GB-001', customer: 'CUST-4421', account: 'ACC-8901234', category: 'General Banking', status: 'Triggered', variance: '+85%', date: '10 Mar 2026, 2:34 PM', reason: 'Customer made three deposits between BDT 900,000 and 999,999 within 5 business days' },
    { alertId: 'ALT-GB001-02', ruleId: 'GB-001', customer: 'CUST-5531', account: 'ACC-7654321', category: 'General Banking', status: 'Closed', variance: '+45%', date: '09 Mar 2026, 4:10 PM', reason: 'Deposits correspond to legitimate monthly retail cash collections' },
    { alertId: 'ALT-GB002-01', ruleId: 'GB-002', customer: 'CUST-8892', account: 'ACC-5432109', category: 'General Banking', status: 'Under Review', variance: '+92%', date: '10 Mar 2026, 1:22 PM', reason: 'Transaction amount BDT 4,500,000 exceeds twice the customer\'s largest historical transaction' },
    { alertId: 'ALT-GB002-02', ruleId: 'GB-002', customer: 'CUST-3321', account: 'ACC-9876543', category: 'General Banking', status: 'Closed', variance: '+38%', date: '08 Mar 2026, 11:30 AM', reason: 'Customer sold a property and received proceeds' },
    { alertId: 'ALT-CR005-01', ruleId: 'CR-005', customer: 'CUST-7765', account: 'ACC-3456789', category: 'Credit', status: 'Under Review', variance: '+78%', date: '10 Mar 2026, 12:15 PM', reason: 'Loan intended for SME machinery purchase used to buy a luxury car' },
    { alertId: 'ALT-CR005-02', ruleId: 'CR-005', customer: 'CUST-2234', account: 'ACC-6543210', category: 'Credit', status: 'Closed', variance: '+40%', date: '07 Mar 2026, 3:00 PM', reason: 'Payment was actually made to an approved supplier' },
    { alertId: 'ALT-TB008-01', ruleId: 'TB-008', customer: 'CUST-9876', account: 'ACC-1234567', category: 'Trade Based', status: 'Escalated', variance: '+90%', date: '10 Mar 2026, 10:45 AM', reason: 'Invoice price of steel rod 25% higher than historical average' },
    { alertId: 'ALT-TB008-02', ruleId: 'TB-008', customer: 'CUST-6543', account: 'ACC-8765432', category: 'Trade Based', status: 'Closed', variance: '+35%', date: '06 Mar 2026, 9:20 AM', reason: 'Price difference caused by global steel price increase' },
    { alertId: 'ALT-RM003-01', ruleId: 'RM-003', customer: 'CUST-1122', account: 'ACC-2345678', category: 'Remittance', status: 'Triggered', variance: '+83%', date: '10 Mar 2026, 9:15 AM', reason: 'Remittance received from high-risk jurisdiction with unclear relationship' },
    { alertId: 'ALT-RM003-02', ruleId: 'RM-003', customer: 'CUST-3344', account: 'ACC-7654321', category: 'Remittance', status: 'Closed', variance: '+42%', date: '05 Mar 2026, 2:15 PM', reason: 'Customer receives regular salary remittance from overseas employment' },
  ];

  private readonly allRules = [
    { id: 'GB-001', name: 'Splitting of Cash Deposits', category: 'General Banking', type: 'Built-in', priority: 'High', status: 'Active' },
    { id: 'GB-002', name: 'Sudden high value transaction', category: 'General Banking', type: 'Built-in', priority: 'High', status: 'Active' },
    { id: 'GB-003', name: 'Transactions exceed 30 in a day', category: 'General Banking', type: 'Built-in', priority: 'High', status: 'Active' },
    { id: 'GB-004', name: 'Transactions > 30 in 7 days AND >= BDT 2M', category: 'General Banking', type: 'Dynamic', priority: 'High', status: 'Active' },
    { id: 'GB-005', name: 'Positive balance in Credit Card', category: 'General Banking', type: 'Built-in', priority: 'Medium', status: 'Inactive' },
    { id: 'GB-006', name: 'Dormant Account High Activity', category: 'General Banking', type: 'Dynamic', priority: 'High', status: 'Active' },
    { id: 'CR-001', name: 'Loan fraud by borrower', category: 'Credit', type: 'Built-in', priority: 'High', status: 'Active' },
    { id: 'CR-002', name: 'Fake collateral documents', category: 'Credit', type: 'Built-in', priority: 'High', status: 'Active' },
    { id: 'CR-005', name: 'Loan Used Outside Purpose', category: 'Credit', type: 'Built-in', priority: 'High', status: 'Active' },
    { id: 'TB-001', name: 'Over/under invoicing', category: 'Trade Based', type: 'Dynamic', priority: 'High', status: 'Active' },
    { id: 'TB-002', name: 'Shifting import/export goods', category: 'Trade Based', type: 'Built-in', priority: 'High', status: 'Active' },
    { id: 'TB-008', name: 'Trade Invoice Discrepancy', category: 'Trade Based', type: 'Dynamic', priority: 'High', status: 'Active' },
    { id: 'RM-001', name: 'Single receiver, multiple countries', category: 'Remittance', type: 'Built-in', priority: 'High', status: 'Active' },
    { id: 'RM-002', name: 'Single receiver, multiple senders', category: 'Remittance', type: 'Built-in', priority: 'High', status: 'Active' },
    { id: 'RM-003', name: 'Remittance from High Risk Country', category: 'Remittance', type: 'Built-in', priority: 'High', status: 'Active' },
  ];

  private readonly categoryData = [
    { name: 'General Banking', code: 'GB-001', rulesLinked: 6, color: '#1a56db', status: 'Active' },
    { name: 'Credit', code: 'CR-001', rulesLinked: 3, color: '#d97706', status: 'Active' },
    { name: 'Trade Based', code: 'TB-001', rulesLinked: 3, color: '#16a34a', status: 'Active' },
    { name: 'Remittance', code: 'RM-001', rulesLinked: 3, color: '#7c3aed', status: 'Active' },
  ];

  private readonly pendingApprovals = {
    rules: 4,
    categories: 4,
  };

  private readonly systemStats = {
    activeUsers: 28,
    connectedSystems: 12,
    alertsProcessed: 247,
    systemHealth: 100,
  };

  summaryCards: SummaryCard[] = [];
  alertAssignments: AlertAssignment[] = [];
  alertCategories: CategoryCount[] = [];
  alertPriorities: PriorityCount[] = [];
  pieSlices: PieSlice[] = [];
  aiInsights: AiInsight[] = [];
  recentAlerts: RecentAlert[] = [];

  ngOnInit(): void {
    this.computeDashboardData();
  }

  private computeDashboardData(): void {
    const activeRules = this.allRules.filter(r => r.status === 'Active').length;
    const openAlerts = this.allAlerts.filter(a => a.status !== 'Closed');
    const highRiskAlerts = openAlerts.filter(a => {
      const variance = parseInt(a.variance.replace(/[^0-9]/g, ''), 10);
      return variance >= 75;
    });
    const underReview = this.allAlerts.filter(a => a.status === 'Under Review').length;
    const escalated = this.allAlerts.filter(a => a.status === 'Escalated').length;
    const closedAlerts = this.allAlerts.filter(a => a.status === 'Closed').length;
    const totalCategories = this.categoryData.length;

    this.summaryCards = [
      { label: 'Active Rules', value: activeRules, icon: 'pi pi-cog', iconBg: '#eef3fa', iconColor: '#1b498a', valueColor: '#1b498a', route: '/dashboard/efrm/rules' },
      { label: 'Total Alerts', value: this.allAlerts.length, icon: 'pi pi-bell', iconBg: '#fef3c7', iconColor: '#d97706', valueColor: '#d97706', route: '/dashboard/efrm/alert' },
      { label: 'High Risk', value: highRiskAlerts.length, icon: 'pi pi-exclamation-triangle', iconBg: '#fee2e2', iconColor: '#dc2626', valueColor: '#dc2626', route: '/dashboard/efrm/alert' },
      { label: 'Under Review', value: underReview + escalated, icon: 'pi pi-search', iconBg: '#e0edff', iconColor: '#1a56db', valueColor: '#1a56db', route: '/dashboard/efrm/alert' },
      { label: 'Resolved', value: closedAlerts, icon: 'pi pi-check-circle', iconBg: '#dcfce7', iconColor: '#16a34a', valueColor: '#16a34a', route: '/dashboard/efrm/alert' },
      { label: 'Categories', value: totalCategories, icon: 'pi pi-th-large', iconBg: '#f3e8ff', iconColor: '#7c3aed', valueColor: '#7c3aed', route: '/dashboard/efrm/categories' },
    ];

    // Alert Assignments from open alerts
    this.alertAssignments = openAlerts.map(a => ({
      alertId: a.alertId,
      customer: a.customer,
      category: a.category,
      categoryClass: a.category.toLowerCase().replace(/ /g, '-'),
      priority: this.getPriority(a.variance),
      status: a.status,
      statusClass: a.status.toLowerCase().replace(/ /g, '-'),
      ruleId: a.ruleId,
    }));

    // Category counts from real alerts
    const catCounts = new Map<string, number>();
    this.allAlerts.forEach(a => catCounts.set(a.category, (catCounts.get(a.category) || 0) + 1));

    this.alertCategories = this.categoryData.map(c => ({
      name: c.name,
      color: c.color,
      count: catCounts.get(c.name) || 0,
      route: '/dashboard/efrm/categories',
    }));

    // Priority counts
    const priorities = { High: 0, Medium: 0, Low: 0 };
    this.allAlerts.forEach(a => {
      const p = this.getPriority(a.variance);
      priorities[p]++;
    });

    this.alertPriorities = [
      { name: 'High Priority', color: '#dc2626', count: priorities.High },
      { name: 'Medium Priority', color: '#d97706', count: priorities.Medium },
      { name: 'Low Priority', color: '#16a34a', count: priorities.Low },
    ];

    // Pie chart computed from category alert counts
    const totalAlertCount = this.allAlerts.length;
    const sliceData = this.categoryData.map(c => ({
      name: c.name,
      percentage: Math.round(((catCounts.get(c.name) || 0) / totalAlertCount) * 1000) / 10,
      color: c.color,
    }));
    this.pieSlices = this.computePieSlices(sliceData);

    // AI Insights computed from real data
    this.computeAiInsights(openAlerts, priorities, catCounts);

    // Recent alerts — sorted by date, most recent first
    this.recentAlerts = [...this.allAlerts]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6)
      .map(a => ({
        alertId: a.alertId,
        customer: a.customer,
        account: a.account,
        rule: a.ruleId,
        category: a.category,
        categoryClass: a.category.toLowerCase().replace(/ /g, '-'),
        status: a.status,
        statusClass: a.status.toLowerCase().replace(/ /g, '-'),
        variance: a.variance,
        dateTime: a.date,
      }));
  }

  private getPriority(variance: string): 'High' | 'Medium' | 'Low' {
    const v = parseInt(variance.replace(/[^0-9]/g, ''), 10);
    if (v >= 75) return 'High';
    if (v >= 40) return 'Medium';
    return 'Low';
  }

  private computePieSlices(data: { name: string; percentage: number; color: string }[]): PieSlice[] {
    const cx = 100;
    const cy = 100;
    const r = 80;
    let startAngle = -90; // Start from top

    return data.map(d => {
      const angle = (d.percentage / 100) * 360;
      const endAngle = startAngle + angle;
      const midAngle = startAngle + angle / 2;

      // SVG arc path
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;
      const midRad = (midAngle * Math.PI) / 180;

      const x1 = cx + r * Math.cos(startRad);
      const y1 = cy + r * Math.sin(startRad);
      const x2 = cx + r * Math.cos(endRad);
      const y2 = cy + r * Math.sin(endRad);

      const largeArc = angle > 180 ? 1 : 0;

      const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;

      // Label position at midpoint
      const labelR = r * 0.6;
      const labelX = cx + labelR * Math.cos(midRad);
      const labelY = cy + labelR * Math.sin(midRad);

      startAngle = endAngle;

      return {
        name: d.name,
        percentage: d.percentage,
        color: d.color,
        path,
        labelX,
        labelY,
      };
    });
  }

  private computeAiInsights(
    openAlerts: typeof this.allAlerts,
    priorities: { High: number; Medium: number; Low: number },
    catCounts: Map<string, number>,
  ): void {
    // Find the most active category
    let topCat = '';
    let topCatCount = 0;
    catCounts.forEach((count, name) => {
      if (count > topCatCount) {
        topCat = name;
        topCatCount = count;
      }
    });
    const topCatPct = Math.round((topCatCount / this.allAlerts.length) * 100);

    // Find highest variance alert
    const highestVariance = [...openAlerts].sort((a, b) => {
      return parseInt(b.variance.replace(/[^0-9]/g, ''), 10) - parseInt(a.variance.replace(/[^0-9]/g, ''), 10);
    })[0];

    this.aiInsights = [
      {
        title: 'High Priority Alert Surge',
        description: `${priorities.High} out of ${this.allAlerts.length} alerts are high priority — requiring immediate attention.`,
        recommendation: 'Escalate high-priority alerts to senior compliance officers and redistribute analyst workload.',
        icon: 'pi pi-exclamation-triangle',
        iconColor: '#dc2626',
        borderColor: '#dc2626',
      },
      {
        title: 'Dominant Category: ' + topCat,
        description: `${topCat} accounts for ${topCatPct}% of all alerts (${topCatCount} of ${this.allAlerts.length}).`,
        recommendation: `Review ${topCat} rules for potential false positives and assign a dedicated specialist.`,
        icon: 'pi pi-chart-pie',
        iconColor: '#1a56db',
        borderColor: '#1a56db',
      },
      {
        title: 'Highest Variance Alert',
        description: highestVariance
          ? `${highestVariance.alertId} shows ${highestVariance.variance} variance — ${highestVariance.reason}`
          : 'No open alerts currently.',
        recommendation: highestVariance
          ? `Investigate ${highestVariance.alertId} immediately — variance exceeds normal threshold significantly.`
          : 'Continue monitoring.',
        icon: 'pi pi-arrow-up-right',
        iconColor: '#ea580c',
        borderColor: '#ea580c',
      },
      {
        title: 'Pending Approvals',
        description: `${this.pendingApprovals.rules} rules and ${this.pendingApprovals.categories} categories awaiting approval.`,
        recommendation: 'Review and approve pending items to ensure monitoring coverage is up to date.',
        icon: 'pi pi-clock',
        iconColor: '#7c3aed',
        borderColor: '#7c3aed',
      },
      {
        title: 'System Health',
        description: `${this.systemStats.connectedSystems} systems connected, ${this.systemStats.alertsProcessed} alerts processed today. System health at ${this.systemStats.systemHealth}%.`,
        recommendation: 'All systems operational — continue current monitoring cadence.',
        icon: 'pi pi-check-circle',
        iconColor: '#16a34a',
        borderColor: '#16a34a',
      },
    ];
  }

  refreshData(): void {
    this.computeDashboardData();
    this.messageService.add({
      severity: 'success',
      summary: 'Refreshed',
      detail: 'Dashboard data refreshed successfully.',
    });
  }

  exportReport(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Export Started',
      detail: 'Generating monitoring report...',
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  onSummaryCardClick(card: SummaryCard): void {
    this.router.navigate([card.route]);
  }

  onAlertRowClick(alertId: string): void {
    this.router.navigate(['/dashboard/efrm/alert/' + alertId]);
  }

  onCategoryClick(cat: CategoryCount): void {
    this.router.navigate([cat.route]);
  }

  isHighVariance(variance: string): boolean {
    return parseInt(variance.replace(/[^0-9]/g, ''), 10) >= 75;
  }
}
