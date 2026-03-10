import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

type ApprovalTab = 'Rule' | 'Category';
type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected';
type RiskLevel = 'High' | 'Medium' | 'Low';

interface RuleApproval {
  id: string;
  name: string;
  category: string;
  conditionLogic: string;
  threshold: string;
  riskLevel: RiskLevel;
  createdBy: string;
  createdDate: string;
  status: ApprovalStatus;
  description: string;
}

interface CategoryApproval {
  code: string;
  name: string;
  riskDomain: string;
  rulesLinked: number;
  createdBy: string;
  createdDate: string;
  status: ApprovalStatus;
  description: string;
}

@Component({
  selector: 'app-efrm-approvals',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule],
  templateUrl: './efrm-approvals.html',
  styleUrl: './efrm-approvals.scss',
})
export class EfrmApprovalsComponent {
  approvalTab: ApprovalTab = 'Rule';
  statusFilter: ApprovalStatus | 'All' = 'Pending';
  searchTerm = '';

  rules: RuleApproval[] = [
    {
      id: 'GB-001',
      name: 'Large Cash Deposit',
      category: 'General Banking',
      conditionLogic: 'Deposit > 900000 multiple times',
      threshold: '৳900,000',
      riskLevel: 'High',
      createdBy: 'Admin',
      createdDate: '12 Mar 2026',
      status: 'Pending',
      description:
        'Monitors accounts that receive multiple large cash deposits above the reporting threshold within a short period.',
    },
    {
      id: 'ML-002',
      name: 'Rapid Fund Transfer',
      category: 'Money Laundering',
      conditionLogic: 'Transfer > 5 within 24 hours',
      threshold: '৳500,000',
      riskLevel: 'High',
      createdBy: 'J. Smith',
      createdDate: '11 Mar 2026',
      status: 'Pending',
      description:
        'Detects rapid outbound transfers that may indicate layering or money movement between related accounts.',
    },
    {
      id: 'FR-003',
      name: 'Unusual Login Pattern',
      category: 'Fraud Detection',
      conditionLogic: 'Login from 3+ countries in 24h',
      threshold: 'N/A',
      riskLevel: 'Medium',
      createdBy: 'M. Johnson',
      createdDate: '10 Mar 2026',
      status: 'Pending',
      description:
        'Identifies accounts accessed from multiple countries over a short time window, indicating credential compromise.',
    },
    {
      id: 'GB-004',
      name: 'Structured Transactions',
      category: 'General Banking',
      conditionLogic: 'Multiple deposits just below threshold',
      threshold: '৳900,000',
      riskLevel: 'High',
      createdBy: 'Admin',
      createdDate: '09 Mar 2026',
      status: 'Pending',
      description:
        'Flags repeated deposits just under the reporting threshold that may indicate structuring activity.',
    },
  ];

  categories: CategoryApproval[] = [
    {
      code: 'GB-001',
      name: 'General Banking',
      riskDomain: 'Operational',
      rulesLinked: 12,
      createdBy: 'Admin User',
      createdDate: '12 Mar 2026',
      status: 'Pending',
      description: 'General banking transaction monitoring across deposits, withdrawals and transfers.',
    },
    {
      code: 'CR-001',
      name: 'Credit',
      riskDomain: 'Credit',
      rulesLinked: 9,
      createdBy: 'Admin User',
      createdDate: '11 Mar 2026',
      status: 'Pending',
      description: 'Credit portfolio monitoring for loans, cards and overdraft facilities.',
    },
    {
      code: 'TB-001',
      name: 'Trade Based',
      riskDomain: 'Trade',
      rulesLinked: 11,
      createdBy: 'Admin User',
      createdDate: '10 Mar 2026',
      status: 'Pending',
      description: 'Trade finance monitoring for import, export and LC related transactions.',
    },
    {
      code: 'RM-001',
      name: 'Remittance',
      riskDomain: 'Remittance',
      rulesLinked: 5,
      createdBy: 'Admin User',
      createdDate: '09 Mar 2026',
      status: 'Pending',
      description: 'Inbound and outbound remittance transaction monitoring across channels.',
    },
  ];

  selectedRule: RuleApproval | null = null;
  selectedCategory: CategoryApproval | null = null;
  checkerComment = '';

  get activeTabIsRule(): boolean {
    return this.approvalTab === 'Rule';
  }

  get filteredRules(): RuleApproval[] {
    let items = [...this.rules];

    if (this.statusFilter !== 'All') {
      items = items.filter(r => r.status === this.statusFilter);
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.trim().toLowerCase();
      items = items.filter(
        r =>
          r.id.toLowerCase().includes(term) ||
          r.name.toLowerCase().includes(term) ||
          r.createdBy.toLowerCase().includes(term),
      );
    }

    return items;
  }

  get filteredCategories(): CategoryApproval[] {
    let items = [...this.categories];

    if (this.statusFilter !== 'All') {
      items = items.filter(c => c.status === this.statusFilter);
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.trim().toLowerCase();
      items = items.filter(
        c =>
          c.code.toLowerCase().includes(term) ||
          c.name.toLowerCase().includes(term) ||
          c.createdBy.toLowerCase().includes(term),
      );
    }

    return items;
  }

  setTab(tab: ApprovalTab): void {
    if (this.approvalTab === tab) {
      return;
    }
    this.approvalTab = tab;
    this.closeDetails();
  }

  openRuleDetails(rule: RuleApproval): void {
    this.selectedRule = rule;
    this.selectedCategory = null;
    this.checkerComment = '';
  }

  openCategoryDetails(category: CategoryApproval): void {
    this.selectedCategory = category;
    this.selectedRule = null;
    this.checkerComment = '';
  }

  closeDetails(): void {
    this.selectedRule = null;
    this.selectedCategory = null;
    this.checkerComment = '';
  }

  approve(): void {
    if (this.selectedRule) {
      this.selectedRule.status = 'Approved';
    } else if (this.selectedCategory) {
      this.selectedCategory.status = 'Approved';
    }
    this.closeDetails();
  }

  reject(): void {
    if (this.selectedRule) {
      this.selectedRule.status = 'Rejected';
    } else if (this.selectedCategory) {
      this.selectedCategory.status = 'Rejected';
    }
    this.closeDetails();
  }
}

