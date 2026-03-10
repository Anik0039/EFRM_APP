import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';

type RuleCategory = 'General Banking' | 'Credit' | 'Trade Based' | 'Remittance';
type RuleType = 'Built-in' | 'Dynamic';
type RiskLevel = 'High' | 'Medium';

interface Rule {
  id: string;
  name: string;
  category: RuleCategory;
  categoryClass: string;
  type: RuleType;
  risk: RiskLevel;
  active: boolean;
}

@Component({
  selector: 'app-efrm-rules',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule],
  templateUrl: './efrm-rules.html',
  styleUrl: './efrm-rules.scss',
})
export class EfrmRulesComponent {
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly goRulesUrl =
    'https://efrm-rule-engine.vercel.app/gorules';

  allRules: Rule[] = [
    // ── 5 Primary Rules (from Bangladesh Bank Guideline) ──
    {
      id: 'GB-001',
      name: 'Splitting of Cash Deposits — Cash deposits between BDT 900,000–999,999 occurring more than 2 times in a month',
      category: 'General Banking',
      categoryClass: 'general-banking',
      type: 'Built-in',
      risk: 'High',
      active: true,
    },
    {
      id: 'GB-006',
      name: 'Dormant Account High Activity — Long inactive account suddenly receives high value transaction ≥ BDT 500,000',
      category: 'General Banking',
      categoryClass: 'general-banking',
      type: 'Dynamic',
      risk: 'High',
      active: true,
    },
    {
      id: 'CR-005',
      name: 'Loan Used Outside Approved Purpose — Loan proceeds used for transactions inconsistent with the approved loan purpose',
      category: 'Credit',
      categoryClass: 'credit',
      type: 'Built-in',
      risk: 'High',
      active: true,
    },
    {
      id: 'TB-008',
      name: 'Trade Invoice Discrepancy — Trade invoice value differs significantly (>10%) from expected market value or historical price',
      category: 'Trade Based',
      categoryClass: 'trade-based',
      type: 'Dynamic',
      risk: 'High',
      active: true,
    },
    {
      id: 'RM-003',
      name: 'Incoming Remittance from High Risk Country — Incoming remittance originating from high-risk jurisdictions ≥ BDT 100,000',
      category: 'Remittance',
      categoryClass: 'remittance',
      type: 'Built-in',
      risk: 'High',
      active: true,
    },
    // ── Other Rules ──
    {
      id: 'GB-002',
      name: 'Sudden high value transaction for the client',
      category: 'General Banking',
      categoryClass: 'general-banking',
      type: 'Built-in',
      risk: 'High',
      active: true,
    },
    {
      id: 'GB-003',
      name: 'Number of transactions exceeds 30 in a single day',
      category: 'General Banking',
      categoryClass: 'general-banking',
      type: 'Built-in',
      risk: 'High',
      active: true,
    },
    {
      id: 'GB-004',
      name: 'Number of transactions > 30 in 7 calendar days AND total amount ≥ BDT 2,000,000',
      category: 'General Banking',
      categoryClass: 'general-banking',
      type: 'Dynamic',
      risk: 'High',
      active: true,
    },
    {
      id: 'GB-005',
      name: 'Positive balance in Credit Card',
      category: 'General Banking',
      categoryClass: 'general-banking',
      type: 'Built-in',
      risk: 'Medium',
      active: false,
    },
    {
      id: 'CR-001',
      name: 'Utilization of loan fraud by the borrower for purposes other than those for which the loan was approved',
      category: 'Credit',
      categoryClass: 'credit',
      type: 'Built-in',
      risk: 'High',
      active: true,
    },
    {
      id: 'CR-002',
      name: 'Fake collateral documents identification',
      category: 'Credit',
      categoryClass: 'credit',
      type: 'Built-in',
      risk: 'High',
      active: true,
    },
    {
      id: 'TB-001',
      name: 'Over/under invoicing – variation of quoted price with standard price by 10%',
      category: 'Trade Based',
      categoryClass: 'trade-based',
      type: 'Dynamic',
      risk: 'High',
      active: true,
    },
    {
      id: 'TB-002',
      name: 'Shifting or changing of import/export goods',
      category: 'Trade Based',
      categoryClass: 'trade-based',
      type: 'Built-in',
      risk: 'High',
      active: true,
    },
    {
      id: 'RM-001',
      name: 'Single receiver but senders from multiple countries',
      category: 'Remittance',
      categoryClass: 'remittance',
      type: 'Built-in',
      risk: 'High',
      active: true,
    },
    {
      id: 'RM-002',
      name: 'Single receiver but multiple senders from same country',
      category: 'Remittance',
      categoryClass: 'remittance',
      type: 'Built-in',
      risk: 'High',
      active: true,
    },
  ];

  categories: RuleCategory[] = ['General Banking', 'Credit', 'Trade Based', 'Remittance'];
  ruleTypes: RuleType[] = ['Built-in', 'Dynamic'];

  searchTerm = '';
  selectedCategory = 'All Categories';
  selectedRuleType = 'All Types';
  selectedStatus = 'All Status';

  get stats() {
    const totalRules = this.allRules.length;
    const activeRules = this.allRules.filter((rule) => rule.active).length;
    const builtInRules = this.allRules.filter((rule) => rule.type === 'Built-in').length;
    const dynamicRules = this.allRules.filter((rule) => rule.type === 'Dynamic').length;

    return { totalRules, activeRules, builtInRules, dynamicRules };
  }

  get filteredRules() {
    let rules = [...this.allRules];

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.trim().toLowerCase();
      rules = rules.filter(
        (rule) => rule.id.toLowerCase().includes(term) || rule.name.toLowerCase().includes(term),
      );
    }

    if (this.selectedCategory !== 'All Categories') {
      rules = rules.filter((rule) => rule.category === this.selectedCategory);
    }

    if (this.selectedRuleType !== 'All Types') {
      rules = rules.filter((rule) => rule.type === this.selectedRuleType);
    }

    if (this.selectedStatus === 'Active') {
      rules = rules.filter((rule) => rule.active);
    } else if (this.selectedStatus === 'Inactive') {
      rules = rules.filter((rule) => !rule.active);
    }

    return rules;
  }

  toggleStatus(rule: Rule) {
    rule.active = !rule.active;
    this.messageService.add({
      severity: rule.active ? 'success' : 'info',
      summary: rule.active ? 'Rule Activated' : 'Rule Deactivated',
      detail: `Rule ${rule.id} has been ${rule.active ? 'activated' : 'deactivated'}.`,
    });
  }

  openRule(rule: Rule) {
    this.router.navigate(['/dashboard/efrm/rule-config', rule.id]);
  }

  goToRuleEngine() {
    if (typeof window !== 'undefined') {
      window.open(this.goRulesUrl, '_blank', 'noopener,noreferrer');
    }
  }
}
