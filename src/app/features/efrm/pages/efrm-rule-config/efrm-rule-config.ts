import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

interface RuleParam {
  label: string;
  key: string;
  type: 'text' | 'number' | 'dropdown' | 'textarea';
  value: string | number;
  options?: string[];
}

interface EscalationRecipient {
  employeeId: string;
  designation: string;
  level: string;
}

interface RuleConfig {
  ruleId: string;
  ruleName: string;
  category: string;
  riskLevel: string;
  scenarioDescription: string;
  scenarioLogic: string;
  parameters: RuleParam[];
  ruleStatus: 'Active' | 'Inactive';
  integrationType: string;
  integrationEngine: string;
  alertMethods: { email: boolean; sms: boolean; inApp: boolean; dashboard: boolean };
  priorityLevel: string;
  notificationFrequency: string;
  executionMode: string;
  scheduleTime: string;
  dataSource: string;
  escalationRecipients: EscalationRecipient[];
  sequenceType: string;
  alertRecipients: { first: boolean; second: boolean; third: boolean };
  simulation: {
    testRange: string;
    alertsGenerated: number;
    falsePositives: number;
    accuracy: number;
    processingTime: string;
  };
  monitoring: {
    highRiskAlerts: number;
    mediumRiskAlerts: number;
    detectionAccuracy: number;
    lastUpdated: string;
    totalTransactions: number;
  };
  workflow: {
    makerStatus: 'completed' | 'pending' | 'awaiting';
    makerBy: string;
    checkerStatus: 'completed' | 'pending' | 'awaiting';
    checkerBy: string;
    activationStatus: 'completed' | 'pending' | 'awaiting';
  };
}

@Component({
  selector: 'app-efrm-rule-config',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule],
  templateUrl: './efrm-rule-config.html',
  styleUrl: './efrm-rule-config.scss',
})
export class EfrmRuleConfigComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  ruleId = '';
  config!: RuleConfig;

  private readonly ruleDatabase: Record<string, RuleConfig> = {
    'GB-001': {
      ruleId: 'GB-001',
      ruleName: 'Splitting of Cash Deposits',
      category: 'General Banking',
      riskLevel: 'High',
      scenarioDescription:
        'Monitor cash deposits between BDT 900,000–999,999 occurring more than 2 times in a month to detect structuring/smurfing patterns.',
      scenarioLogic:
        'Transaction_Type = Cash Deposit\nAND Amount BETWEEN 900000 AND 999999\nAND Transaction_Count > 2\nWITHIN 30 Days',
      parameters: [
        {
          label: 'Transaction Type',
          key: 'txnType',
          type: 'dropdown',
          value: 'Cash Deposit',
          options: ['Cash Deposit', 'Wire Transfer', 'Check Deposit', 'Any'],
        },
        { label: 'Minimum Amount', key: 'minAmount', type: 'number', value: 900000 },
        { label: 'Maximum Amount', key: 'maxAmount', type: 'number', value: 999999 },
        { label: 'Frequency Threshold', key: 'freqThreshold', type: 'number', value: 2 },
        {
          label: 'Monitoring Period',
          key: 'monitorPeriod',
          type: 'dropdown',
          value: '30 Days',
          options: ['7 Days', '15 Days', '30 Days', '60 Days', '90 Days'],
        },
        {
          label: 'Account Type',
          key: 'accountType',
          type: 'dropdown',
          value: 'Individual',
          options: ['Individual', 'Corporate', 'Both'],
        },
        {
          label: 'Currency',
          key: 'currency',
          type: 'dropdown',
          value: 'BDT',
          options: ['BDT', 'USD', 'EUR', 'GBP'],
        },
        {
          label: 'Branch Scope',
          key: 'branchScope',
          type: 'dropdown',
          value: 'All',
          options: ['All', 'Head Office', 'Branches Only', 'Agent Banking'],
        },
      ],
      ruleStatus: 'Active',
      integrationType: 'Public Rule',
      integrationEngine: 'Transaction Monitoring Engine',
      alertMethods: { email: true, sms: false, inApp: true, dashboard: true },
      priorityLevel: 'High Priority',
      notificationFrequency: 'Immediate',
      executionMode: 'Real-time',
      scheduleTime: '02:00 AM',
      dataSource: 'Core Banking System',
      escalationRecipients: [
        { employeeId: 'EMP-2024-001', designation: 'Compliance Officer', level: 'Level 1' },
        { employeeId: 'EMP-2024-045', designation: 'AML Manager', level: 'Level 2' },
      ],
      sequenceType: 'Broadcast',
      alertRecipients: { first: true, second: true, third: false },
      simulation: {
        testRange: 'Last 30 days',
        alertsGenerated: 247,
        falsePositives: 23,
        accuracy: 90.7,
        processingTime: '2.3s',
      },
      monitoring: {
        highRiskAlerts: 156,
        mediumRiskAlerts: 89,
        detectionAccuracy: 94.2,
        lastUpdated: '2 minutes ago',
        totalTransactions: 1247893,
      },
      workflow: {
        makerStatus: 'completed',
        makerBy: 'John Doe',
        checkerStatus: 'pending',
        checkerBy: 'Pending review',
        activationStatus: 'awaiting',
      },
    },
    'GB-006': {
      ruleId: 'GB-006',
      ruleName: 'Dormant Account High Activity',
      category: 'General Banking',
      riskLevel: 'High',
      scenarioDescription:
        'Detect dormant accounts that suddenly receive high-value transactions, indicating potential misuse for money laundering.',
      scenarioLogic: 'Account_Status = Dormant\nAND Transaction_Amount >= 500000',
      parameters: [
        { label: 'Dormant Period (Months)', key: 'dormantPeriod', type: 'number', value: 12 },
        { label: 'Minimum Transaction Amount', key: 'minTxnAmount', type: 'number', value: 500000 },
        {
          label: 'Transaction Type',
          key: 'txnType',
          type: 'dropdown',
          value: 'Any',
          options: ['Any', 'Cash Deposit', 'Wire Transfer', 'Check Deposit'],
        },
        {
          label: 'Account Type',
          key: 'accountType',
          type: 'dropdown',
          value: 'Both',
          options: ['Individual', 'Corporate', 'Both'],
        },
        {
          label: 'Currency',
          key: 'currency',
          type: 'dropdown',
          value: 'BDT',
          options: ['BDT', 'USD', 'EUR', 'GBP'],
        },
      ],
      ruleStatus: 'Active',
      integrationType: 'Public Rule',
      integrationEngine: 'Transaction Monitoring Engine',
      alertMethods: { email: true, sms: true, inApp: false, dashboard: true },
      priorityLevel: 'High Priority',
      notificationFrequency: 'Immediate',
      executionMode: 'Real-time',
      scheduleTime: '01:00 AM',
      dataSource: 'Core Banking System',
      escalationRecipients: [
        { employeeId: 'EMP-2024-012', designation: 'Branch Manager', level: 'Level 1' },
        { employeeId: 'EMP-2024-045', designation: 'AML Manager', level: 'Level 2' },
      ],
      sequenceType: 'Sequential',
      alertRecipients: { first: true, second: true, third: false },
      simulation: {
        testRange: 'Last 30 days',
        alertsGenerated: 89,
        falsePositives: 12,
        accuracy: 86.5,
        processingTime: '1.8s',
      },
      monitoring: {
        highRiskAlerts: 67,
        mediumRiskAlerts: 34,
        detectionAccuracy: 91.8,
        lastUpdated: '5 minutes ago',
        totalTransactions: 892340,
      },
      workflow: {
        makerStatus: 'completed',
        makerBy: 'Rahim Ahmed',
        checkerStatus: 'completed',
        checkerBy: 'Karim Hasan',
        activationStatus: 'pending',
      },
    },
    'CR-005': {
      ruleId: 'CR-005',
      ruleName: 'Loan Used Outside Approved Purpose',
      category: 'Credit',
      riskLevel: 'High',
      scenarioDescription:
        'Monitor loan disbursements where proceeds are used for transactions inconsistent with the approved loan purpose, indicating credit misuse or loan diversion.',
      scenarioLogic:
        'Loan_Disbursement = TRUE\nAND Transaction_Category != Approved_Loan_Purpose\nAND Amount > 20% Loan_Value\nWITHIN 30 Days',
      parameters: [
        {
          label: 'Loan Type',
          key: 'loanType',
          type: 'dropdown',
          value: 'All',
          options: ['All', 'Personal', 'Business', 'Home', 'Auto', 'Agricultural'],
        },
        { label: 'Loan Amount Threshold', key: 'loanThreshold', type: 'number', value: 1000000 },
        {
          label: 'Monitoring Period',
          key: 'monitorPeriod',
          type: 'dropdown',
          value: '30 Days',
          options: ['7 Days', '15 Days', '30 Days', '60 Days', '90 Days'],
        },
        {
          label: 'Allowed Transaction Category',
          key: 'allowedCategory',
          type: 'dropdown',
          value: 'Approved Purpose',
          options: ['Approved Purpose', 'Any', 'Restricted'],
        },
        { label: 'Deviation Threshold (%)', key: 'deviationThreshold', type: 'number', value: 20 },
        {
          label: 'Currency',
          key: 'currency',
          type: 'dropdown',
          value: 'BDT',
          options: ['BDT', 'USD', 'EUR', 'GBP'],
        },
      ],
      ruleStatus: 'Active',
      integrationType: 'Public Rule',
      integrationEngine: 'Credit Monitoring Engine',
      alertMethods: { email: true, sms: false, inApp: true, dashboard: false },
      priorityLevel: 'High Priority',
      notificationFrequency: 'Daily',
      executionMode: 'Batch',
      scheduleTime: '03:00 AM',
      dataSource: 'Loan Management System',
      escalationRecipients: [
        { employeeId: 'EMP-2024-023', designation: 'Credit Analyst', level: 'Level 1' },
        { employeeId: 'EMP-2024-067', designation: 'Credit Risk Manager', level: 'Level 2' },
      ],
      sequenceType: 'Sequential',
      alertRecipients: { first: true, second: false, third: false },
      simulation: {
        testRange: 'Last 30 days',
        alertsGenerated: 34,
        falsePositives: 8,
        accuracy: 76.5,
        processingTime: '4.1s',
      },
      monitoring: {
        highRiskAlerts: 28,
        mediumRiskAlerts: 19,
        detectionAccuracy: 88.3,
        lastUpdated: '15 minutes ago',
        totalTransactions: 345210,
      },
      workflow: {
        makerStatus: 'completed',
        makerBy: 'Shila Akter',
        checkerStatus: 'pending',
        checkerBy: 'Pending review',
        activationStatus: 'awaiting',
      },
    },
    'TB-008': {
      ruleId: 'TB-008',
      ruleName: 'Trade Invoice Discrepancy',
      category: 'Trade Based',
      riskLevel: 'High',
      scenarioDescription:
        'Detect trade invoices where the value differs significantly from expected market value or historical price, indicating potential Trade Based Money Laundering (TBML).',
      scenarioLogic: 'ABS(Invoice_Value - Average_Price_Last_6_Months) > 10%',
      parameters: [
        { label: 'Invoice Amount', key: 'invoiceAmount', type: 'number', value: 0 },
        {
          label: 'Price Variation Threshold (%)',
          key: 'priceVariation',
          type: 'number',
          value: 10,
        },
        {
          label: 'Historical Price Window',
          key: 'priceWindow',
          type: 'dropdown',
          value: '6 Months',
          options: ['3 Months', '6 Months', '12 Months', '24 Months'],
        },
        {
          label: 'HS Code',
          key: 'hsCode',
          type: 'dropdown',
          value: 'Product Category',
          options: [
            'Product Category',
            'Raw Materials',
            'Electronics',
            'Textiles',
            'Pharmaceuticals',
          ],
        },
        {
          label: 'Country Risk Level',
          key: 'countryRisk',
          type: 'dropdown',
          value: 'All',
          options: ['All', 'High Risk', 'Medium Risk', 'Low Risk'],
        },
      ],
      ruleStatus: 'Active',
      integrationType: 'Public Rule',
      integrationEngine: 'Trade Finance Engine',
      alertMethods: { email: true, sms: false, inApp: true, dashboard: true },
      priorityLevel: 'Medium Priority',
      notificationFrequency: 'Immediate',
      executionMode: 'Real-time',
      scheduleTime: '00:00 AM',
      dataSource: 'Trade Finance System',
      escalationRecipients: [
        { employeeId: 'EMP-2024-034', designation: 'Trade Compliance Officer', level: 'Level 1' },
        { employeeId: 'EMP-2024-078', designation: 'AML Manager', level: 'Level 2' },
      ],
      sequenceType: 'Broadcast',
      alertRecipients: { first: true, second: true, third: true },
      simulation: {
        testRange: 'Last 30 days',
        alertsGenerated: 112,
        falsePositives: 31,
        accuracy: 72.3,
        processingTime: '5.7s',
      },
      monitoring: {
        highRiskAlerts: 78,
        mediumRiskAlerts: 56,
        detectionAccuracy: 85.1,
        lastUpdated: '8 minutes ago',
        totalTransactions: 567432,
      },
      workflow: {
        makerStatus: 'completed',
        makerBy: 'Tanvir Islam',
        checkerStatus: 'completed',
        checkerBy: 'Rahim Ahmed',
        activationStatus: 'completed',
      },
    },
    'RM-003': {
      ruleId: 'RM-003',
      ruleName: 'Incoming Remittance from High Risk Country',
      category: 'Remittance',
      riskLevel: 'High',
      scenarioDescription:
        'Monitor incoming remittances originating from high-risk jurisdictions to detect cross-border AML threats.',
      scenarioLogic:
        'Transaction_Type = Remittance\nAND Origin_Country IN High_Risk_Country_List\nAND Amount >= 100000',
      parameters: [
        {
          label: 'Transaction Type',
          key: 'txnType',
          type: 'dropdown',
          value: 'Remittance',
          options: ['Remittance', 'Wire Transfer', 'Any'],
        },
        {
          label: 'Country Risk List',
          key: 'countryRiskList',
          type: 'dropdown',
          value: 'High Risk Countries',
          options: ['High Risk Countries', 'FATF Grey List', 'FATF Black List', 'Custom List'],
        },
        { label: 'Minimum Amount', key: 'minAmount', type: 'number', value: 100000 },
        {
          label: 'Monitoring Period',
          key: 'monitorPeriod',
          type: 'dropdown',
          value: '30 Days',
          options: ['7 Days', '15 Days', '30 Days', '60 Days', '90 Days'],
        },
        {
          label: 'Customer Type',
          key: 'customerType',
          type: 'dropdown',
          value: 'All',
          options: ['All', 'Individual', 'Corporate', 'NRB'],
        },
      ],
      ruleStatus: 'Active',
      integrationType: 'Public Rule',
      integrationEngine: 'Transaction Monitoring Engine',
      alertMethods: { email: true, sms: true, inApp: true, dashboard: true },
      priorityLevel: 'High Priority',
      notificationFrequency: 'Immediate',
      executionMode: 'Real-time',
      scheduleTime: '00:00 AM',
      dataSource: 'Remittance Gateway',
      escalationRecipients: [
        { employeeId: 'EMP-2024-001', designation: 'Compliance Officer', level: 'Level 1' },
        { employeeId: 'EMP-2024-045', designation: 'AML Manager', level: 'Level 2' },
        { employeeId: 'EMP-2024-090', designation: 'CAMLCO', level: 'Level 3' },
      ],
      sequenceType: 'Sequential',
      alertRecipients: { first: true, second: true, third: true },
      simulation: {
        testRange: 'Last 30 days',
        alertsGenerated: 189,
        falsePositives: 15,
        accuracy: 92.1,
        processingTime: '1.9s',
      },
      monitoring: {
        highRiskAlerts: 134,
        mediumRiskAlerts: 67,
        detectionAccuracy: 96.4,
        lastUpdated: '1 minute ago',
        totalTransactions: 2134567,
      },
      workflow: {
        makerStatus: 'completed',
        makerBy: 'Karim Hasan',
        checkerStatus: 'pending',
        checkerBy: 'Pending review',
        activationStatus: 'awaiting',
      },
    },
  };

  categoryOptions = [
    'General Banking',
    'Credit',
    'Trade Based',
    'Remittance',
    'Transaction Monitoring',
  ];
  riskOptions = ['High', 'Medium', 'Low'];
  priorityOptions = ['High Priority', 'Medium Priority', 'Low Priority'];
  frequencyOptions = ['Immediate', 'Hourly', 'Daily', 'Weekly'];
  executionOptions = ['Real-time', 'Batch'];
  dataSourceOptions = [
    'Core Banking System',
    'Trade Finance System',
    'Loan Management System',
    'Remittance Gateway',
    'Card Management System',
  ];
  integrationEngineOptions = [
    'Transaction Monitoring Engine',
    'Credit Monitoring Engine',
    'Trade Finance Engine',
    'Behavioral Analytics Engine',
  ];
  sequenceOptions = ['Broadcast', 'Sequential'];
  designationOptions = [
    'Compliance Officer',
    'AML Manager',
    'Branch Manager',
    'Credit Analyst',
    'Credit Risk Manager',
    'Trade Compliance Officer',
    'CAMLCO',
  ];
  levelOptions = ['Level 1', 'Level 2', 'Level 3'];
  testRangeOptions = [
    'Last 7 days',
    'Last 30 days',
    'Last 90 days',
    'Last 6 months',
    'Last 1 year',
  ];

  ngOnInit() {
    this.ruleId = this.route.snapshot.paramMap.get('ruleId') ?? '';
    this.config = this.ruleDatabase[this.ruleId] ?? this.getDefaultConfig();
  }

  private getDefaultConfig(): RuleConfig {
    return {
      ruleId: this.ruleId || 'NEW-001',
      ruleName: '',
      category: 'General Banking',
      riskLevel: 'Medium',
      scenarioDescription: '',
      scenarioLogic: '',
      parameters: [],
      ruleStatus: 'Inactive',
      integrationType: 'Public Rule',
      integrationEngine: 'Transaction Monitoring Engine',
      alertMethods: { email: false, sms: false, inApp: false, dashboard: false },
      priorityLevel: 'Medium Priority',
      notificationFrequency: 'Daily',
      executionMode: 'Batch',
      scheduleTime: '02:00 AM',
      dataSource: 'Core Banking System',
      escalationRecipients: [],
      sequenceType: 'Broadcast',
      alertRecipients: { first: false, second: false, third: false },
      simulation: {
        testRange: 'Last 30 days',
        alertsGenerated: 0,
        falsePositives: 0,
        accuracy: 0,
        processingTime: '0s',
      },
      monitoring: {
        highRiskAlerts: 0,
        mediumRiskAlerts: 0,
        detectionAccuracy: 0,
        lastUpdated: 'N/A',
        totalTransactions: 0,
      },
      workflow: {
        makerStatus: 'pending',
        makerBy: 'Not submitted',
        checkerStatus: 'awaiting',
        checkerBy: 'Awaiting',
        activationStatus: 'awaiting',
      },
    };
  }

  addRecipient() {
    this.config.escalationRecipients.push({
      employeeId: '',
      designation: 'Compliance Officer',
      level: 'Level 1',
    });
  }

  removeRecipient(index: number) {
    this.config.escalationRecipients.splice(index, 1);
  }

  runSimulation() {
    this.config.simulation.alertsGenerated = Math.floor(Math.random() * 300) + 50;
    this.config.simulation.falsePositives = Math.floor(Math.random() * 40) + 5;
    this.config.simulation.accuracy =
      Math.round(
        ((this.config.simulation.alertsGenerated - this.config.simulation.falsePositives) /
          this.config.simulation.alertsGenerated) *
          1000,
      ) / 10;
    this.config.simulation.processingTime = (Math.random() * 5 + 0.5).toFixed(1) + 's';
  }

  goBack() {
    this.router.navigate(['/dashboard/efrm']);
  }

  saveDraft() {
    console.log('Saving draft:', this.config);
  }

  submitRule() {
    console.log('Submitting rule:', this.config);
  }
}
