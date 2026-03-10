import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

type RiskDomain = 'Operational' | 'Credit' | 'ML-TF' | 'Trade' | 'Remittance';

type CategoryStatus = 'Active' | 'Inactive';

interface Category {
  id: string;
  name: string;
  code: string;
  riskDomain: RiskDomain;
  status: CategoryStatus;
  rulesLinked: number;
  description: string;
  createdBy: string;
  createdDate: string;
  lastModified: string;
}

@Component({
  selector: 'app-efrm-category-setup',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule],
  templateUrl: './efrm-category-setup.html',
  styleUrl: './efrm-category-setup.scss',
})
export class EfrmCategorySetupComponent {
  categories: Category[] = [
    {
      id: 'general-banking',
      name: 'General Banking',
      code: 'GB-001',
      riskDomain: 'Operational',
      status: 'Active',
      rulesLinked: 12,
      description:
        'Standard banking transaction monitoring for general banking activities including deposits, withdrawals, and transfers.',
      createdBy: 'Admin User',
      createdDate: 'Jan 15, 2024',
      lastModified: 'Mar 02, 2024',
    },
    {
      id: 'credit',
      name: 'Credit',
      code: 'CR-001',
      riskDomain: 'Credit',
      status: 'Active',
      rulesLinked: 9,
      description:
        'Credit portfolio monitoring for loans, overdrafts, and card facilities with exposure and repayment risk checks.',
      createdBy: 'Admin User',
      createdDate: 'Jan 18, 2024',
      lastModified: 'Mar 04, 2024',
    },
    {
      id: 'trade-based',
      name: 'Trade Based',
      code: 'TB-001',
      riskDomain: 'Trade',
      status: 'Active',
      rulesLinked: 11,
      description:
        'Trade finance monitoring covering letters of credit, import and export bills, and documentary collections.',
      createdBy: 'Admin User',
      createdDate: 'Jan 20, 2024',
      lastModified: 'Mar 05, 2024',
    },
    {
      id: 'remittance',
      name: 'Remittance',
      code: 'RM-001',
      riskDomain: 'Remittance',
      status: 'Active',
      rulesLinked: 0,
      description:
        'Inbound and outbound remittance monitoring for migrant workers, foreign exchange, and cross-border transfers.',
      createdBy: 'Admin User',
      createdDate: 'Jan 22, 2024',
      lastModified: 'Mar 06, 2024',
    },
  ];

  riskDomains: RiskDomain[] = ['Operational', 'Credit', 'ML-TF', 'Trade', 'Remittance'];

  searchQuery = '';
  statusFilter: 'All Status' | CategoryStatus = 'All Status';
  selectedCategoryId: string | null = null;

  showAddModal = false;

  newCategoryName = '';
  newCategoryRiskDomain: RiskDomain | '' = '';
  newCategoryDescription = '';
  newCategoryEffectiveDate = '';
  newCategoryStatus: CategoryStatus = 'Active';

  get totalCategories(): number {
    return this.categories.length;
  }

  get activeCategories(): number {
    return this.categories.filter(c => c.status === 'Active').length;
  }

  get categoriesWithNoRules(): number {
    return this.categories.filter(c => c.rulesLinked === 0).length;
  }

  get filteredCategories(): Category[] {
    let items = [...this.categories];

    if (this.searchQuery.trim()) {
      const term = this.searchQuery.trim().toLowerCase();
      items = items.filter(c => c.name.toLowerCase().includes(term));
    }

    if (this.statusFilter !== 'All Status') {
      items = items.filter(c => c.status === this.statusFilter);
    }

    return items;
  }

  get selectedCategory(): Category | null {
    return this.categories.find(c => c.id === this.selectedCategoryId) ?? null;
  }

  openAddModal(): void {
    this.newCategoryName = '';
    this.newCategoryRiskDomain = '';
    this.newCategoryDescription = '';
    this.newCategoryEffectiveDate = '';
    this.newCategoryStatus = 'Active';
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }
}

