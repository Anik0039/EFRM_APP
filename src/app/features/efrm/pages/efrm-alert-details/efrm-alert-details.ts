import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MessageService, ConfirmationService } from 'primeng/api';

type AlertSection = 'customer' | 'transaction';

interface Transaction {
  date: string;
  type: string;
  amount: string;
  channel: string;
  location: string;
}

interface AlertDetail {
  alertId: string;
  ruleId: string;
  ruleName: string;
  category: string;
  alertStatus: string;
  statusClass: string;
  variance: number;
  alertDate: string;
  customerId: string;
  customerName: string;
  nomineeName: string;
  accountNumber: string;
  branchName: string;
  accountType: string;
  customerRiskLevel: string;
  riskClass: string;
  sections: AlertSection[];
  transactions: Transaction[];
  ruleLogic: string;
  systemObservation: string;
  observationHighlight: string;
}

@Component({
  selector: 'app-efrm-alert-details',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule],
  templateUrl: './efrm-alert-details.html',
  styleUrl: './efrm-alert-details.scss',
})
export class EfrmAlertDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  alertId = '';
  analystComments = '';
  investigationStatus = 'Triggered';
  statusOptions = ['Triggered', 'Under Review', 'Closed', 'Escalated'];

  alert: AlertDetail = {
    alertId: '',
    ruleId: '',
    ruleName: '',
    category: '',
    alertStatus: '',
    statusClass: '',
    variance: 0,
    alertDate: '',
    customerId: '',
    customerName: '',
    nomineeName: '',
    accountNumber: '',
    branchName: '',
    accountType: '',
    customerRiskLevel: '',
    riskClass: '',
    sections: [],
    transactions: [],
    ruleLogic: '',
    systemObservation: '',
    observationHighlight: '',
  };

  private alertsData: Record<string, AlertDetail> = {
    'ALT-GB001-01': {
      alertId: 'ALT-GB001-01',
      ruleId: 'GB-001',
      ruleName: 'Splitting of Cash Deposits',
      category: 'General Banking',
      alertStatus: 'Triggered',
      statusClass: 'triggered',
      variance: 85,
      alertDate: '02-Mar-2026',
      customerId: 'CUST-45213',
      customerName: 'Rahim Ahmed',
      nomineeName: 'Karim Ahmed',
      accountNumber: 'ACC-104578321',
      branchName: 'Motijheel Branch',
      accountType: 'Savings',
      customerRiskLevel: 'Medium',
      riskClass: 'medium',
      sections: ['customer', 'transaction'],
      transactions: [
        { date: '02-Mar-2026', type: 'Cash Deposit', amount: '৳ 950,000', channel: 'Branch', location: 'Motijheel' },
        { date: '10-Mar-2026', type: 'Cash Deposit', amount: '৳ 970,000', channel: 'Branch', location: 'Motijheel' },
        { date: '18-Mar-2026', type: 'Cash Deposit', amount: '৳ 980,000', channel: 'Branch', location: 'Motijheel' },
      ],
      ruleLogic: 'Cash deposits between BDT 900,000 and 999,999 occurring more than 2 times within 30 days.',
      systemObservation: ' detected within the monitoring period.',
      observationHighlight: '3 deposits',
    },
    'ALT-GB001-02': {
      alertId: 'ALT-GB001-02',
      ruleId: 'GB-001',
      ruleName: 'Splitting of Cash Deposits',
      category: 'General Banking',
      alertStatus: 'Closed',
      statusClass: 'closed',
      variance: 45,
      alertDate: '27-Mar-2026',
      customerId: 'CUST-78432',
      customerName: 'Sufia Begum',
      nomineeName: 'Nasir Uddin',
      accountNumber: 'ACC-209876543',
      branchName: 'Gulshan Branch',
      accountType: 'Current',
      customerRiskLevel: 'Low',
      riskClass: 'low',
      sections: ['customer', 'transaction'],
      transactions: [
        { date: '15-Mar-2026', type: 'Cash Deposit', amount: '৳ 920,000', channel: 'Branch', location: 'Gulshan' },
        { date: '22-Mar-2026', type: 'Cash Deposit', amount: '৳ 940,000', channel: 'Branch', location: 'Gulshan' },
        { date: '27-Mar-2026', type: 'Cash Deposit', amount: '৳ 910,000', channel: 'Branch', location: 'Gulshan' },
      ],
      ruleLogic: 'Cash deposits between BDT 900,000 and 999,999 occurring more than 2 times within 30 days.',
      systemObservation: ' detected within the monitoring period.',
      observationHighlight: '3 deposits',
    },
    'ALT-GB002-01': {
      alertId: 'ALT-GB002-01',
      ruleId: 'GB-002',
      ruleName: 'Sudden High Value Transaction',
      category: 'General Banking',
      alertStatus: 'Under Review',
      statusClass: 'under-review',
      variance: 92,
      alertDate: '15-Mar-2026',
      customerId: 'CUST-33210',
      customerName: 'Kamal Hossain',
      nomineeName: 'Jamal Hossain',
      accountNumber: 'ACC-305612789',
      branchName: 'Dhanmondi Branch',
      accountType: 'Savings',
      customerRiskLevel: 'High',
      riskClass: 'high',
      sections: ['customer', 'transaction'],
      transactions: [
        { date: '15-Mar-2026', type: 'Wire Transfer', amount: '৳ 4,500,000', channel: 'Online', location: 'Dhanmondi' },
      ],
      ruleLogic: 'Transaction amount exceeds twice the customer\'s largest transaction in the last six months.',
      systemObservation: ' exceeding historical maximum by 120%.',
      observationHighlight: 'Single transaction of ৳ 4,500,000',
    },
    'ALT-GB002-02': {
      alertId: 'ALT-GB002-02',
      ruleId: 'GB-002',
      ruleName: 'Sudden High Value Transaction',
      category: 'General Banking',
      alertStatus: 'Closed',
      statusClass: 'closed',
      variance: 38,
      alertDate: '21-Mar-2026',
      customerId: 'CUST-56781',
      customerName: 'Fatema Khatun',
      nomineeName: 'Rashed Khan',
      accountNumber: 'ACC-401234567',
      branchName: 'Uttara Branch',
      accountType: 'Current',
      customerRiskLevel: 'Low',
      riskClass: 'low',
      sections: ['customer', 'transaction'],
      transactions: [
        { date: '21-Mar-2026', type: 'Check Deposit', amount: '৳ 3,200,000', channel: 'Branch', location: 'Uttara' },
      ],
      ruleLogic: 'Transaction amount exceeds twice the customer\'s largest transaction in the last six months.',
      systemObservation: ' with property sale documentation provided.',
      observationHighlight: 'Single high-value deposit',
    },
    'ALT-CR005-01': {
      alertId: 'ALT-CR005-01',
      ruleId: 'CR-005',
      ruleName: 'Loan Used Outside Approved Purpose',
      category: 'Credit',
      alertStatus: 'Under Review',
      statusClass: 'under-review',
      variance: 78,
      alertDate: '10-Apr-2026',
      customerId: 'CUST-89012',
      customerName: 'Abdul Matin',
      nomineeName: 'Salma Akter',
      accountNumber: 'ACC-507890123',
      branchName: 'Banani Branch',
      accountType: 'Loan',
      customerRiskLevel: 'High',
      riskClass: 'high',
      sections: ['customer', 'transaction'],
      transactions: [
        { date: '05-Apr-2026', type: 'Fund Transfer', amount: '৳ 2,800,000', channel: 'Online', location: 'Banani' },
        { date: '10-Apr-2026', type: 'Fund Transfer', amount: '৳ 1,500,000', channel: 'Branch', location: 'Banani' },
      ],
      ruleLogic: 'Loan proceeds used for transactions inconsistent with the approved loan purpose.',
      systemObservation: ' directed to luxury car dealership account.',
      observationHighlight: 'Loan disbursement of ৳ 4,300,000',
    },
    'ALT-CR005-02': {
      alertId: 'ALT-CR005-02',
      ruleId: 'CR-005',
      ruleName: 'Loan Used Outside Approved Purpose',
      category: 'Credit',
      alertStatus: 'Closed',
      statusClass: 'closed',
      variance: 40,
      alertDate: '15-Apr-2026',
      customerId: 'CUST-34567',
      customerName: 'Nusrat Jahan',
      nomineeName: 'Imran Hossain',
      accountNumber: 'ACC-603456789',
      branchName: 'Mirpur Branch',
      accountType: 'Loan',
      customerRiskLevel: 'Low',
      riskClass: 'low',
      sections: ['customer', 'transaction'],
      transactions: [
        { date: '12-Apr-2026', type: 'Fund Transfer', amount: '৳ 1,800,000', channel: 'Branch', location: 'Mirpur' },
      ],
      ruleLogic: 'Loan proceeds used for transactions inconsistent with the approved loan purpose.',
      systemObservation: ' to an approved supplier through a logistics intermediary.',
      observationHighlight: 'Payment of ৳ 1,800,000',
    },
    'ALT-TB008-01': {
      alertId: 'ALT-TB008-01',
      ruleId: 'TB-008',
      ruleName: 'Trade Invoice Discrepancy',
      category: 'Trade Based',
      alertStatus: 'Escalated',
      statusClass: 'escalated',
      variance: 90,
      alertDate: '18-Apr-2026',
      customerId: 'CUST-12345',
      customerName: 'Mizanur Rahman',
      nomineeName: 'Shahidul Islam',
      accountNumber: 'ACC-701234567',
      branchName: 'Chittagong Branch',
      accountType: 'Current',
      customerRiskLevel: 'High',
      riskClass: 'high',
      sections: ['customer', 'transaction'],
      transactions: [
        { date: '15-Apr-2026', type: 'LC Payment', amount: '৳ 12,500,000', channel: 'Trade Desk', location: 'Chittagong' },
      ],
      ruleLogic: 'Trade invoice value differs significantly (>10%) from expected market value or historical price.',
      systemObservation: ' at 25% above historical average.',
      observationHighlight: 'Steel rod invoice priced',
    },
    'ALT-TB008-02': {
      alertId: 'ALT-TB008-02',
      ruleId: 'TB-008',
      ruleName: 'Trade Invoice Discrepancy',
      category: 'Trade Based',
      alertStatus: 'Closed',
      statusClass: 'closed',
      variance: 35,
      alertDate: '22-Apr-2026',
      customerId: 'CUST-67890',
      customerName: 'Rafiqul Islam',
      nomineeName: 'Aminul Haque',
      accountNumber: 'ACC-802345678',
      branchName: 'Narayanganj Branch',
      accountType: 'Current',
      customerRiskLevel: 'Low',
      riskClass: 'low',
      sections: ['customer', 'transaction'],
      transactions: [
        { date: '20-Apr-2026', type: 'LC Payment', amount: '৳ 8,700,000', channel: 'Trade Desk', location: 'Narayanganj' },
      ],
      ruleLogic: 'Trade invoice value differs significantly (>10%) from expected market value or historical price.',
      systemObservation: ' attributed to global steel price increase.',
      observationHighlight: 'Price variance of 12%',
    },
    'ALT-RM003-01': {
      alertId: 'ALT-RM003-01',
      ruleId: 'RM-003',
      ruleName: 'Incoming Remittance from High Risk Country',
      category: 'Remittance',
      alertStatus: 'Triggered',
      statusClass: 'triggered',
      variance: 83,
      alertDate: '25-Apr-2026',
      customerId: 'CUST-54321',
      customerName: 'Shahana Parveen',
      nomineeName: 'Monir Hossain',
      accountNumber: 'ACC-903456789',
      branchName: 'Sylhet Branch',
      accountType: 'Savings',
      customerRiskLevel: 'High',
      riskClass: 'high',
      sections: ['customer', 'transaction'],
      transactions: [
        { date: '23-Apr-2026', type: 'Inward Remittance', amount: '৳ 350,000', channel: 'Remittance', location: 'Sylhet' },
        { date: '25-Apr-2026', type: 'Inward Remittance', amount: '৳ 420,000', channel: 'Remittance', location: 'Sylhet' },
      ],
      ruleLogic: 'Incoming remittance originating from high-risk jurisdictions ≥ BDT 100,000.',
      systemObservation: ' from high-risk jurisdiction with unclear sender relationship.',
      observationHighlight: '2 remittances totaling ৳ 770,000',
    },
    'ALT-RM003-02': {
      alertId: 'ALT-RM003-02',
      ruleId: 'RM-003',
      ruleName: 'Incoming Remittance from High Risk Country',
      category: 'Remittance',
      alertStatus: 'Closed',
      statusClass: 'closed',
      variance: 42,
      alertDate: '27-Apr-2026',
      customerId: 'CUST-98765',
      customerName: 'Jahanara Begum',
      nomineeName: 'Delwar Hossain',
      accountNumber: 'ACC-104567890',
      branchName: 'Comilla Branch',
      accountType: 'Savings',
      customerRiskLevel: 'Low',
      riskClass: 'low',
      sections: ['customer', 'transaction'],
      transactions: [
        { date: '27-Apr-2026', type: 'Inward Remittance', amount: '৳ 180,000', channel: 'Remittance', location: 'Comilla' },
      ],
      ruleLogic: 'Incoming remittance originating from high-risk jurisdictions ≥ BDT 100,000.',
      systemObservation: ' identified as regular salary remittance from overseas employment.',
      observationHighlight: 'Monthly remittance of ৳ 180,000',
    },
  };

  hasSection(section: AlertSection): boolean {
    return this.alert.sections.includes(section);
  }

  ngOnInit(): void {
    this.alertId = this.route.snapshot.paramMap.get('alertId') || '';
    this.alert = this.alertsData[this.alertId] || this.alert;
    this.investigationStatus = this.alert.alertStatus;
  }

  goBack() {
    this.router.navigate(['/dashboard/efrm/alert']);
  }

  saveInvestigation() {
    this.alert.alertStatus = this.investigationStatus;
    this.messageService.add({
      severity: 'success',
      summary: 'Saved',
      detail: `Investigation for ${this.alert.alertId} saved successfully.`,
    });
  }

  closeAlert() {
    this.confirmationService.confirm({
      message: `Are you sure you want to close alert "${this.alert.alertId}"? This will mark the investigation as complete.`,
      header: 'Confirm Close Alert',
      icon: 'pi pi-check-circle',
      accept: () => {
        this.alert.alertStatus = 'Closed';
        this.alert.statusClass = 'closed';
        this.investigationStatus = 'Closed';
        this.messageService.add({
          severity: 'success',
          summary: 'Alert Closed',
          detail: `Alert ${this.alert.alertId} has been closed.`,
        });
      },
    });
  }

  escalateCase() {
    this.confirmationService.confirm({
      message: `Are you sure you want to escalate alert "${this.alert.alertId}"? This will notify senior management.`,
      header: 'Confirm Escalation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.alert.alertStatus = 'Escalated';
        this.alert.statusClass = 'escalated';
        this.investigationStatus = 'Escalated';
        this.messageService.add({
          severity: 'warn',
          summary: 'Escalated',
          detail: `Alert ${this.alert.alertId} has been escalated to senior management.`,
        });
      },
    });
  }

  downloadReport() {
    this.messageService.add({
      severity: 'info',
      summary: 'Download Started',
      detail: `Report for ${this.alert.alertId} is being generated.`,
    });
  }
}
