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
    // ══════════════════════════════════════════════
    // 5 Primary Rules (Active)
    // ══════════════════════════════════════════════
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

    // ══════════════════════════════════════════════
    // Other Existing Rules (Inactive)
    // ══════════════════════════════════════════════
    { id: 'GB-007', name: 'Number of transactions in a month is more than 200% of the average number for the client in the last 6 months with min. no. of transactions being 20 in a single day', category: 'General Banking', categoryClass: 'general-banking', type: 'Dynamic', risk: 'High', active: false },
    { id: 'GB-008', name: 'Unusual or Repetitive Donations — If donations to charitable organizations exceed amounts > BDT 20,00,000 in a month or exceed frequency > 5', category: 'General Banking', categoryClass: 'general-banking', type: 'Dynamic', risk: 'High', active: false },
    { id: 'GB-009', name: 'Clustered Small Transactions — In personal accounts, if ≥ 10 transactions below BDT 10,000 within a day from different counterparties', category: 'General Banking', categoryClass: 'general-banking', type: 'Dynamic', risk: 'High', active: false },
    { id: 'GB-010', name: 'Quick Withdrawals after Deposits — If funds are withdrawn/transferred in the same day for five times in a week', category: 'General Banking', categoryClass: 'general-banking', type: 'Built-in', risk: 'High', active: false },
    { id: 'GB-011', name: 'Smurfing Patterns — Fragmented deposits of > BDT 100,000 from multiple branches (online deposit) five times in a single day', category: 'General Banking', categoryClass: 'general-banking', type: 'Dynamic', risk: 'High', active: false },
    {
      id: 'GB-002',
      name: 'Sudden high value transaction for the client',
      category: 'General Banking',
      categoryClass: 'general-banking',
      type: 'Built-in',
      risk: 'High',
      active: false,
    },
    {
      id: 'GB-003',
      name: 'Number of transactions exceeds 30 in a single day',
      category: 'General Banking',
      categoryClass: 'general-banking',
      type: 'Built-in',
      risk: 'High',
      active: false,
    },
    {
      id: 'GB-004',
      name: 'Number of transactions > 30 in 7 calendar days AND total amount ≥ BDT 2,000,000',
      category: 'General Banking',
      categoryClass: 'general-banking',
      type: 'Dynamic',
      risk: 'High',
      active: false,
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
      active: false,
    },
    {
      id: 'CR-002',
      name: 'Fake collateral documents identification',
      category: 'Credit',
      categoryClass: 'credit',
      type: 'Built-in',
      risk: 'High',
      active: false,
    },
    {
      id: 'TB-001',
      name: 'Over/under invoicing – variation of quoted price with standard price by 10%',
      category: 'Trade Based',
      categoryClass: 'trade-based',
      type: 'Dynamic',
      risk: 'High',
      active: false,
    },
    {
      id: 'TB-002',
      name: 'Shifting or changing of import/export goods',
      category: 'Trade Based',
      categoryClass: 'trade-based',
      type: 'Built-in',
      risk: 'High',
      active: false,
    },
    {
      id: 'RM-001',
      name: 'Single receiver but senders from multiple countries',
      category: 'Remittance',
      categoryClass: 'remittance',
      type: 'Built-in',
      risk: 'High',
      active: false,
    },
    {
      id: 'RM-002',
      name: 'Single receiver but multiple senders from same country',
      category: 'Remittance',
      categoryClass: 'remittance',
      type: 'Built-in',
      risk: 'High',
      active: false,
    },

    // ══════════════════════════════════════════════
    // General Banking — New Rules from BB Guideline
    // ══════════════════════════════════════════════
    
    { id: 'GB-012', name: 'Suspicious Withdrawal Timing or Location — Transactions made between 10 PM and 6 AM five times in the same day', category: 'General Banking', categoryClass: 'general-banking', type: 'Built-in', risk: 'High', active: false },
    { id: 'GB-013', name: 'Crypto-like Behavior — A transaction description where mentioned keyword related to Crypto transactions', category: 'General Banking', categoryClass: 'general-banking', type: 'Dynamic', risk: 'High', active: false },
    { id: 'GB-014', name: 'Early High Transactions — New account (< 30 days old) sees single transaction > BDT 10,00,000 OR ≥ 10 transactions totaling > BDT 20,00,000', category: 'General Banking', categoryClass: 'general-banking', type: 'Built-in', risk: 'High', active: false },
    { id: 'GB-015', name: 'Cheque Bounce — If bounces 5 times in a day in a same account', category: 'General Banking', categoryClass: 'general-banking', type: 'Built-in', risk: 'Medium', active: false },
    { id: 'GB-016', name: 'Account Freezing/Suspension — If any kind of transaction observed in freezed account or withdrawal observed in suspended account', category: 'General Banking', categoryClass: 'general-banking', type: 'Built-in', risk: 'High', active: false },
    { id: 'GB-017', name: 'Proprietorship Account Transactions — If in a proprietorship account, in a single day, more than 30 transactions amounting 20,00,000 or more', category: 'General Banking', categoryClass: 'general-banking', type: 'Built-in', risk: 'High', active: false },
    { id: 'GB-018', name: 'Any TP Violation — Violation of TP by 3 times of the declared amount 2 times a month', category: 'General Banking', categoryClass: 'general-banking', type: 'Built-in', risk: 'High', active: false },
    { id: 'GB-019', name: 'A/c to A/c Transfers from Unrelated Parties — Account to account transfer from unrelated parties in amounts more than 20 times in 5 days followed by immediate withdrawals (withdrawal 80% of the amount deposited)', category: 'General Banking', categoryClass: 'general-banking', type: 'Dynamic', risk: 'High', active: false },
    { id: 'GB-020', name: 'High Value Transactions with a Country with High ML Risk — Transaction greater than BDT 500,000 for Individuals and BDT 1,000,000 for Non-Individuals, involving a country considered to be high risk', category: 'General Banking', categoryClass: 'general-banking', type: 'Built-in', risk: 'High', active: false },
    { id: 'GB-021', name: 'Frequent Low Cash Deposits or Withdrawals — Cash deposits or withdrawals of not more than BDT 100,000 greater than 20 times in 30 days (for Individuals)', category: 'General Banking', categoryClass: 'general-banking', type: 'Built-in', risk: 'Medium', active: false },
    { id: 'GB-022', name: 'Many to One Fund Transfer — Funds sent by more than 5 senders to one recipient with aggregate amount more than BDT 500,000 for individuals and BDT 1,000,000 for proprietor in the same day', category: 'General Banking', categoryClass: 'general-banking', type: 'Dynamic', risk: 'High', active: false },
    { id: 'GB-023', name: 'One to Many Fund Transfer — Funds sent by one sender to more than 5 recipients with min. aggregate amount BDT 500,000 for Individuals and BDT 1,000,000 for proprietor', category: 'General Banking', categoryClass: 'general-banking', type: 'Dynamic', risk: 'High', active: false },
    { id: 'GB-024', name: 'Repeated Small Cash Deposits Followed by Immediate ATM Withdrawals in Different Location — Cash deposits between 5,000 to 50,000 greater than 5 times in 3 days followed by immediate withdrawals in different location', category: 'General Banking', categoryClass: 'general-banking', type: 'Dynamic', risk: 'High', active: false },
    { id: 'GB-025', name: 'High Value Transactions by High Risk Customers — Transactions greater than BDT 50,000,000 by individuals/proprietor in a month', category: 'General Banking', categoryClass: 'general-banking', type: 'Built-in', risk: 'High', active: false },
    { id: 'GB-026', name: 'High Value Cash Transactions by Dealer in Precious Metal or Stone — Cash transactions greater than BDT 2,000,000 by dealer in precious metal, precious stone or high value goods', category: 'General Banking', categoryClass: 'general-banking', type: 'Built-in', risk: 'High', active: false },
    { id: 'GB-027', name: 'High Value Transactions in Products/Services with High ML Risk — Transactions greater than BDT 500,000 for Individuals and BDT 1,000,000 for Non-Individuals using products/services with high ML risk', category: 'General Banking', categoryClass: 'general-banking', type: 'Built-in', risk: 'High', active: false },
    { id: 'GB-028', name: 'High Value Activity in Housewife, Student, Farmer, Minor Accounts — Transactions of more than BDT 5,00,000 in a month in accounts (non term deposit) of customer with housewife, student, farmer, minor as occupation', category: 'General Banking', categoryClass: 'general-banking', type: 'Built-in', risk: 'High', active: false },
    { id: 'GB-029', name: 'High Value Cash Withdrawals or Deposit in a Month — Cash withdrawals or deposits greater than BDT 10,000,000 in a month (for individual/proprietorship)', category: 'General Banking', categoryClass: 'general-banking', type: 'Built-in', risk: 'High', active: false },
    { id: 'GB-030', name: 'High Value Cash Deposits in Staff Accounts — Cash deposits aggregating to minimum BDT 5,00,000 within 30 days', category: 'General Banking', categoryClass: 'general-banking', type: 'Built-in', risk: 'High', active: false },
    { id: 'GB-031', name: 'High Value Pay Order Purchased Without Proper Purpose — Pay order purchased without proper purpose, reason and its remaining in the parking for long period (minimum 6 Months)', category: 'General Banking', categoryClass: 'general-banking', type: 'Built-in', risk: 'Medium', active: false },
    { id: 'GB-032', name: 'Customer Who Changes the Static Data Frequently — Customer who changes the static data (like address, mobile no etc.) at least 3 times in 2 months', category: 'General Banking', categoryClass: 'general-banking', type: 'Dynamic', risk: 'Medium', active: false },
    { id: 'GB-033', name: 'Round-tripping / Circular Transactions — Money going out and coming back in similar amounts at least 5 times with minimum value BDT 100,000 within 15 days (for individuals/proprietor)', category: 'General Banking', categoryClass: 'general-banking', type: 'Dynamic', risk: 'High', active: false },

    // ══════════════════════════════════════════════
    // Credit — New Rules from BB Guideline
    // ══════════════════════════════════════════════
    { id: 'CR-003', name: 'Source of fund validation for onetime/bulk', category: 'Credit', categoryClass: 'credit', type: 'Built-in', risk: 'High', active: false },
    { id: 'CR-004', name: 'Customers apply for credit facilities with little or no legitimate financial history', category: 'Credit', categoryClass: 'credit', type: 'Dynamic', risk: 'High', active: false },
    { id: 'CR-006', name: 'Credit Report is Inconsistent with customer\'s loan portfolio', category: 'Credit', categoryClass: 'credit', type: 'Dynamic', risk: 'High', active: false },
    { id: 'CR-007', name: 'Customer income or business activity doesn\'t match the loan size requested', category: 'Credit', categoryClass: 'credit', type: 'Dynamic', risk: 'High', active: false },
    { id: 'CR-008', name: 'Borrower takes new loans to repay older ones, creating circular transactions', category: 'Credit', categoryClass: 'credit', type: 'Dynamic', risk: 'High', active: false },
    { id: 'CR-009', name: 'Customer suddenly pays off a large problem loan with no plausible explanation regarding the source of funds', category: 'Credit', categoryClass: 'credit', type: 'Dynamic', risk: 'High', active: false },
    { id: 'CR-010', name: 'Customer\'s loan proceeds are unexpectedly transferred offshore', category: 'Credit', categoryClass: 'credit', type: 'Built-in', risk: 'High', active: false },
    { id: 'CR-011', name: 'Customer taking loan and adjusted immediately without showing due explanations', category: 'Credit', categoryClass: 'credit', type: 'Dynamic', risk: 'High', active: false },
    { id: 'CR-012', name: 'Borrower is willing to not repay loan having a sound payment capacity', category: 'Credit', categoryClass: 'credit', type: 'Dynamic', risk: 'High', active: false },
    { id: 'CR-013', name: 'A customer\'s financial statement makes representations that do not conform to accounting principles', category: 'Credit', categoryClass: 'credit', type: 'Dynamic', risk: 'High', active: false },
    { id: 'CR-014', name: 'Unwilling to submit required documents for credit facilities', category: 'Credit', categoryClass: 'credit', type: 'Built-in', risk: 'High', active: false },
    { id: 'CR-015', name: 'Using front Companies', category: 'Credit', categoryClass: 'credit', type: 'Dynamic', risk: 'High', active: false },
    { id: 'CR-016', name: 'Using Shell Companies', category: 'Credit', categoryClass: 'credit', type: 'Dynamic', risk: 'High', active: false },
    { id: 'CR-017', name: 'Loan Repayments by third parties', category: 'Credit', categoryClass: 'credit', type: 'Built-in', risk: 'High', active: false },
    { id: 'CR-018', name: 'Loan proceeds used to purchase property in the name of third party', category: 'Credit', categoryClass: 'credit', type: 'Built-in', risk: 'High', active: false },
    { id: 'CR-019', name: 'Creation of Force loan without valid reason (LC, B2B, BG)', category: 'Credit', categoryClass: 'credit', type: 'Built-in', risk: 'High', active: false },
    { id: 'CR-020', name: 'Customer requests to disburse loan by issuing cheques/Instruments in favor of another bank/FI/Third party', category: 'Credit', categoryClass: 'credit', type: 'Built-in', risk: 'High', active: false },
    { id: 'CR-021', name: 'Large cash transaction inconsistent with Customer\'s business/Profession', category: 'Credit', categoryClass: 'credit', type: 'Dynamic', risk: 'High', active: false },
    { id: 'CR-022', name: 'Huge Credit balance in the loan Account', category: 'Credit', categoryClass: 'credit', type: 'Built-in', risk: 'High', active: false },
    { id: 'CR-023', name: 'Over valuation of primary security', category: 'Credit', categoryClass: 'credit', type: 'Dynamic', risk: 'High', active: false },
    { id: 'CR-024', name: 'Offering third party property as collateral', category: 'Credit', categoryClass: 'credit', type: 'Built-in', risk: 'High', active: false },
    { id: 'CR-025', name: 'Adjustment of long-term loan like home loan within short period of time', category: 'Credit', categoryClass: 'credit', type: 'Dynamic', risk: 'High', active: false },
    { id: 'CR-026', name: 'Not determining the loan limit with exact required cushion against the collateral value', category: 'Credit', categoryClass: 'credit', type: 'Dynamic', risk: 'Medium', active: false },
    { id: 'CR-027', name: 'Under valuation of primary/collateral security', category: 'Credit', categoryClass: 'credit', type: 'Dynamic', risk: 'High', active: false },
    { id: 'CR-028', name: 'Exaggerated report of Credit Rating Agency', category: 'Credit', categoryClass: 'credit', type: 'Dynamic', risk: 'High', active: false },
    { id: 'CR-029', name: 'Client has dual citizenship', category: 'Credit', categoryClass: 'credit', type: 'Built-in', risk: 'Medium', active: false },
    { id: 'CR-030', name: 'Relationship with PEP/IP', category: 'Credit', categoryClass: 'credit', type: 'Built-in', risk: 'High', active: false },
    { id: 'CR-031', name: 'Client has connection with any Tax Heaven Country/Country those are under sanction', category: 'Credit', categoryClass: 'credit', type: 'Built-in', risk: 'High', active: false },
    { id: 'CR-032', name: 'The loan or stated purpose is ambiguous', category: 'Credit', categoryClass: 'credit', type: 'Dynamic', risk: 'High', active: false },
    { id: 'CR-033', name: 'Tempered Financial Statement presented to mislead analyst', category: 'Credit', categoryClass: 'credit', type: 'Dynamic', risk: 'High', active: false },
    { id: 'CR-034', name: 'Frequent Formation of different entities under group of company', category: 'Credit', categoryClass: 'credit', type: 'Dynamic', risk: 'High', active: false },
    { id: 'CR-035', name: 'Formation of a new company in the name of an employee', category: 'Credit', categoryClass: 'credit', type: 'Dynamic', risk: 'High', active: false },
    { id: 'CR-036', name: 'Frequent Change of Business Address', category: 'Credit', categoryClass: 'credit', type: 'Dynamic', risk: 'Medium', active: false },
    { id: 'CR-037', name: 'Loan disbursed against business and disbursed fund transferred to individual accounts', category: 'Credit', categoryClass: 'credit', type: 'Built-in', risk: 'High', active: false },
    { id: 'CR-038', name: 'Loan proceeds used to purchase property in the name of third party', category: 'Credit', categoryClass: 'credit', type: 'Built-in', risk: 'High', active: false },
    { id: 'CR-039', name: 'Transfer of fund between irrelevant business', category: 'Credit', categoryClass: 'credit', type: 'Dynamic', risk: 'High', active: false },
    { id: 'CR-040', name: 'Same property mortgaged to different FI\'s Collateral', category: 'Credit', categoryClass: 'credit', type: 'Built-in', risk: 'High', active: false },
    { id: 'CR-041', name: 'Falsified Stock report presentation', category: 'Credit', categoryClass: 'credit', type: 'Dynamic', risk: 'High', active: false },
    { id: 'CR-042', name: 'Excessive cash withdraw and advances', category: 'Credit', categoryClass: 'credit', type: 'Built-in', risk: 'High', active: false },
    { id: 'CR-043', name: 'Excessive and recurring cash payments', category: 'Credit', categoryClass: 'credit', type: 'Built-in', risk: 'High', active: false },
    { id: 'CR-044', name: 'Recurring positive balances', category: 'Credit', categoryClass: 'credit', type: 'Dynamic', risk: 'Medium', active: false },
    { id: 'CR-045', name: 'Excessive overseas spending in high risk geographies', category: 'Credit', categoryClass: 'credit', type: 'Dynamic', risk: 'High', active: false },
    { id: 'CR-046', name: 'Loan proceeds transferred to third-party accounts with no business link; borrower acting as a pass-through', category: 'Credit', categoryClass: 'credit', type: 'Dynamic', risk: 'High', active: false },
    { id: 'CR-047', name: 'Loan sanctioned for business purposes diverted to personal luxury items, Car, Travel, Jewelery, speculative trading, or unrelated real estate', category: 'Credit', categoryClass: 'credit', type: 'Dynamic', risk: 'High', active: false },
    { id: 'CR-048', name: 'Sudden replacement of directors/shareholders before or after loan approval; new owners from high-risk jurisdictions', category: 'Credit', categoryClass: 'credit', type: 'Dynamic', risk: 'High', active: false },
    { id: 'CR-049', name: 'Collateral valuation much higher than market rate; property pledged multiple times', category: 'Credit', categoryClass: 'credit', type: 'Dynamic', risk: 'High', active: false },
    { id: 'CR-050', name: 'Borrower applies for unusually large loans disproportionate to turnover/income', category: 'Credit', categoryClass: 'credit', type: 'Dynamic', risk: 'High', active: false },
    { id: 'CR-051', name: 'Sanctioned entity detection — Any transfer > BDT 1.00 Million involving high-risk jurisdictions triggers escalation', category: 'Credit', categoryClass: 'credit', type: 'Built-in', risk: 'High', active: false },
    { id: 'CR-052', name: 'Inconsistent revenue/income reporting compared to repayment capacity', category: 'Credit', categoryClass: 'credit', type: 'Dynamic', risk: 'High', active: false },
    { id: 'CR-053', name: 'Frequent overdraft usage or check bounces in connected accounts', category: 'Credit', categoryClass: 'credit', type: 'Dynamic', risk: 'Medium', active: false },
    { id: 'CR-054', name: 'Cross-lending within a group of companies showing circular transactions', category: 'Credit', categoryClass: 'credit', type: 'Dynamic', risk: 'High', active: false },
    { id: 'CR-055', name: 'Borrower heavily dependent on a single customer/supplier who is also highly leveraged', category: 'Credit', categoryClass: 'credit', type: 'Dynamic', risk: 'High', active: false },
    { id: 'CR-056', name: 'Geo-tag mismatch (loan for rural project, but funds used in urban luxury spending)', category: 'Credit', categoryClass: 'credit', type: 'Dynamic', risk: 'High', active: false },
    { id: 'CR-057', name: 'Social media/adverse news analytics triggering early alerts on borrower risk', category: 'Credit', categoryClass: 'credit', type: 'Dynamic', risk: 'Medium', active: false },
    { id: 'CR-058', name: 'Borrower pays installments on time but rising exposure with other banks', category: 'Credit', categoryClass: 'credit', type: 'Dynamic', risk: 'Medium', active: false },
    { id: 'CR-059', name: 'Guarantor or collateral provider with poor repayment history', category: 'Credit', categoryClass: 'credit', type: 'Dynamic', risk: 'High', active: false },
    { id: 'CR-060', name: 'Loan sanctioned beyond borrower\'s repayment capacity (debt-to-income anomalies)', category: 'Credit', categoryClass: 'credit', type: 'Dynamic', risk: 'High', active: false },
    { id: 'CR-061', name: 'Loans disbursed but funds diverted to unrelated accounts within 48-72 hours', category: 'Credit', categoryClass: 'credit', type: 'Built-in', risk: 'High', active: false },
    { id: 'CR-062', name: 'Sudden drop in borrower\'s account turnover or revenue flow', category: 'Credit', categoryClass: 'credit', type: 'Dynamic', risk: 'High', active: false },
    { id: 'CR-063', name: 'Loan repayments are made from suspicious/unrelated sources', category: 'Credit', categoryClass: 'credit', type: 'Dynamic', risk: 'High', active: false },
    { id: 'CR-064', name: 'Cash withdrawal > 30% of loan amount within a short time (esp business/project loans)', category: 'Credit', categoryClass: 'credit', type: 'Built-in', risk: 'High', active: false },
    { id: 'CR-065', name: 'Collateral Value Erosion > 25% in 6 months (real estate/stock)', category: 'Credit', categoryClass: 'credit', type: 'Dynamic', risk: 'High', active: false },
    { id: 'CR-066', name: 'Multiple loans sanctioned under different names/related parties without group exposure analysis', category: 'Credit', categoryClass: 'credit', type: 'Dynamic', risk: 'High', active: false },
    { id: 'CR-067', name: 'Inflated collateral valuation (land, real estate) accepted without independent verification', category: 'Credit', categoryClass: 'credit', type: 'Dynamic', risk: 'High', active: false },

    // ══════════════════════════════════════════════
    // Trade Based — New Rules from BB Guideline
    // ══════════════════════════════════════════════
    { id: 'TB-003', name: 'Change of beneficiaries — Change of beneficiaries by amendment at any stage of transaction', category: 'Trade Based', categoryClass: 'trade-based', type: 'Built-in', risk: 'High', active: false },
    { id: 'TB-004', name: 'Presenting/negotiating bank differs with payment receiving bank', category: 'Trade Based', categoryClass: 'trade-based', type: 'Built-in', risk: 'High', active: false },
    { id: 'TB-005', name: 'Trade with high risk/trade heaven countries at any stage of transaction', category: 'Trade Based', categoryClass: 'trade-based', type: 'Built-in', risk: 'High', active: false },
    { id: 'TB-006', name: 'Frequent amendments in L/C — Amendments more than three times', category: 'Trade Based', categoryClass: 'trade-based', type: 'Built-in', risk: 'High', active: false },
    { id: 'TB-007', name: 'Address of beneficiaries and document presenters differs — Difference of beneficiaries and document presenters\' country/address', category: 'Trade Based', categoryClass: 'trade-based', type: 'Built-in', risk: 'High', active: false },
    { id: 'TB-009', name: 'Transaction Volume Follow Up — Significant growth (above a threshold) in a particular month compared to last one-year average for a customer', category: 'Trade Based', categoryClass: 'trade-based', type: 'Dynamic', risk: 'High', active: false },
    { id: 'TB-010', name: 'Transaction Profile Violation — Review based on frequency/recurrence and percentage on different parameters like country, item, value and volume of transactions', category: 'Trade Based', categoryClass: 'trade-based', type: 'Dynamic', risk: 'High', active: false },
    { id: 'TB-011', name: 'Change in Line of Business — Sudden change in business nature and approached new item for trade. Monitoring with any H.S Code other than declared in TTP should raise alert', category: 'Trade Based', categoryClass: 'trade-based', type: 'Dynamic', risk: 'High', active: false },
    { id: 'TB-012', name: 'Price Variance of the Products — A certain % high or low from last 6-month average unit price for a particular customer', category: 'Trade Based', categoryClass: 'trade-based', type: 'Dynamic', risk: 'High', active: false },
    { id: 'TB-013', name: 'Dual Use Goods and Restricted items', category: 'Trade Based', categoryClass: 'trade-based', type: 'Built-in', risk: 'High', active: false },
    { id: 'TB-014', name: 'Payment to Third country other than the exporter/importers country', category: 'Trade Based', categoryClass: 'trade-based', type: 'Built-in', risk: 'High', active: false },
    { id: 'TB-015', name: 'When a customer opens an import LC, if he exceeds his maximum threshold for monthly average value mentioned in the TP, an alert will be generated', category: 'Trade Based', categoryClass: 'trade-based', type: 'Dynamic', risk: 'High', active: false },
    { id: 'TB-016', name: 'When an export LC is advised, if it exceeds the customer\'s maximum threshold for monthly average value mentioned in the TP, an alert will be generated', category: 'Trade Based', categoryClass: 'trade-based', type: 'Dynamic', risk: 'High', active: false },
    { id: 'TB-017', name: 'Probable list of imported goods — If the imported goods, identified by HS code, is inconsistent with the goods mentioned in TTP (Trade Transaction Profile), an alert will be generated', category: 'Trade Based', categoryClass: 'trade-based', type: 'Dynamic', risk: 'High', active: false },
    { id: 'TB-018', name: 'Probable list of exported goods — If the exported goods, identified by HS code, is inconsistent with the goods mentioned in TTP (Trade Transaction Profile), an alert will be generated', category: 'Trade Based', categoryClass: 'trade-based', type: 'Dynamic', risk: 'High', active: false },
    { id: 'TB-019', name: 'Probable countries from which the goods will be imported — If the country of import is inconsistent with the countries mentioned in the TTP, an alert will be generated', category: 'Trade Based', categoryClass: 'trade-based', type: 'Dynamic', risk: 'High', active: false },
    { id: 'TB-020', name: 'Probable countries from which the goods will be exported — If the country of export is inconsistent with the countries mentioned in the TTP, an alert will be generated', category: 'Trade Based', categoryClass: 'trade-based', type: 'Dynamic', risk: 'High', active: false },
    { id: 'TB-021', name: 'Alert for Restricted goods by the current Import policy', category: 'Trade Based', categoryClass: 'trade-based', type: 'Built-in', risk: 'High', active: false },
    { id: 'TB-022', name: 'If the commission (bank) of a trade transaction exceeds threshold (4%), an alert will be generated', category: 'Trade Based', categoryClass: 'trade-based', type: 'Built-in', risk: 'Medium', active: false },
    { id: 'TB-023', name: 'If freight charges for an LC exceeds a certain threshold (5%), an alert will be generated', category: 'Trade Based', categoryClass: 'trade-based', type: 'Built-in', risk: 'Medium', active: false },
    { id: 'TB-024', name: 'If the destination/origin country is situated in a land locked country, an alert should be generated for further assessment of full voyage of the vessel', category: 'Trade Based', categoryClass: 'trade-based', type: 'Built-in', risk: 'High', active: false },
    { id: 'TB-025', name: 'If LC is overdrawn up to a certain threshold (10%), an alert will be generated', category: 'Trade Based', categoryClass: 'trade-based', type: 'Built-in', risk: 'High', active: false },
    { id: 'TB-026', name: 'If LC is opened in round figures up to 5 digits, an alert will be generated', category: 'Trade Based', categoryClass: 'trade-based', type: 'Built-in', risk: 'Medium', active: false },
    { id: 'TB-027', name: 'If Bill of lading is future dated or within 10 days from present date, an alert will be generated', category: 'Trade Based', categoryClass: 'trade-based', type: 'Built-in', risk: 'High', active: false },
    { id: 'TB-028', name: 'In case of Import LC, if port of loading doesn\'t match with the country from which goods are being imported, then it will give an alert', category: 'Trade Based', categoryClass: 'trade-based', type: 'Built-in', risk: 'High', active: false },
    { id: 'TB-029', name: 'The volume of purchases and/or imports grossly exceeds the expected sales amount', category: 'Trade Based', categoryClass: 'trade-based', type: 'Dynamic', risk: 'High', active: false },
    { id: 'TB-030', name: 'A single bank account is used by multiple businesses', category: 'Trade Based', categoryClass: 'trade-based', type: 'Dynamic', risk: 'High', active: false },
    { id: 'TB-031', name: 'A single bank account has multiple deposit handlers (retail and wholesale)', category: 'Trade Based', categoryClass: 'trade-based', type: 'Dynamic', risk: 'High', active: false },
    { id: 'TB-032', name: 'The exporter doesn\'t receive money from the buyer, but from someone else who pays on behalf of the buyer', category: 'Trade Based', categoryClass: 'trade-based', type: 'Dynamic', risk: 'High', active: false },
    { id: 'TB-033', name: 'Funds are received/transferred for import/export, and the ordering customer/beneficiary is an MSB', category: 'Trade Based', categoryClass: 'trade-based', type: 'Built-in', risk: 'High', active: false },
    { id: 'TB-034', name: 'Media reports that the account holder is linked to a known terrorist organization or engaged in terrorist activities', category: 'Trade Based', categoryClass: 'trade-based', type: 'Dynamic', risk: 'High', active: false },
    { id: 'TB-035', name: 'Beneficial owner of the account is not properly identified', category: 'Trade Based', categoryClass: 'trade-based', type: 'Built-in', risk: 'High', active: false },
    { id: 'TB-036', name: 'Identification Similarity with related documents (LC, BL, Invoice etc.) in case of Govt. LC', category: 'Trade Based', categoryClass: 'trade-based', type: 'Dynamic', risk: 'High', active: false },
    { id: 'TB-037', name: 'Weight/description of the loaded goods mismatching with BL', category: 'Trade Based', categoryClass: 'trade-based', type: 'Built-in', risk: 'High', active: false },
    { id: 'TB-038', name: 'Custom Procedure Codes (CPC) mismatching with Bill of Entry', category: 'Trade Based', categoryClass: 'trade-based', type: 'Built-in', risk: 'High', active: false },
    { id: 'TB-039', name: 'Any involvement of Frustrated Cargo/Container Issues are raised and try to get custom clearance', category: 'Trade Based', categoryClass: 'trade-based', type: 'Dynamic', risk: 'High', active: false },
    { id: 'TB-040', name: 'Any Advance ruling issues are raised and settled from ruling authority', category: 'Trade Based', categoryClass: 'trade-based', type: 'Dynamic', risk: 'Medium', active: false },
    { id: 'TB-041', name: 'Required Credit report of the seller with PI $30,000 and with Indent $40,000 are not collected', category: 'Trade Based', categoryClass: 'trade-based', type: 'Built-in', risk: 'High', active: false },
    { id: 'TB-042', name: 'There are discrepancies between the description of goods or commodity in the Invoice and the actual goods shipped', category: 'Trade Based', categoryClass: 'trade-based', type: 'Dynamic', risk: 'High', active: false },
    { id: 'TB-043', name: 'There is no apparent business relationship between the parties and transactions', category: 'Trade Based', categoryClass: 'trade-based', type: 'Dynamic', risk: 'High', active: false },
    { id: 'TB-044', name: 'There is a lack of appropriate documentation to support transactions', category: 'Trade Based', categoryClass: 'trade-based', type: 'Built-in', risk: 'High', active: false },
    { id: 'TB-045', name: 'Imported Goods or items originates from a country where there is limited production or no sources at all', category: 'Trade Based', categoryClass: 'trade-based', type: 'Dynamic', risk: 'High', active: false },
    { id: 'TB-046', name: 'Required Three quotations from two different Countries for import above $15,000 are not collected', category: 'Trade Based', categoryClass: 'trade-based', type: 'Built-in', risk: 'High', active: false },
    { id: 'TB-047', name: 'Using offshore account to settle import payment', category: 'Trade Based', categoryClass: 'trade-based', type: 'Built-in', risk: 'High', active: false },
    { id: 'TB-048', name: 'Unusual HS Code of the imported Goods', category: 'Trade Based', categoryClass: 'trade-based', type: 'Dynamic', risk: 'High', active: false },
    { id: 'TB-049', name: 'Incoterms DDP, CIF and CIP used in case of Private party', category: 'Trade Based', categoryClass: 'trade-based', type: 'Built-in', risk: 'Medium', active: false },
    { id: 'TB-050', name: 'In Vessel Tracking/Container Tracking any discrepancies/sign like spoofing, Loitering and stripping', category: 'Trade Based', categoryClass: 'trade-based', type: 'Dynamic', risk: 'High', active: false },
    { id: 'TB-051', name: 'Exports proceed Repatriation time frame expired', category: 'Trade Based', categoryClass: 'trade-based', type: 'Built-in', risk: 'High', active: false },
    { id: 'TB-052', name: 'Invoice splitting / multiple invoicing', category: 'Trade Based', categoryClass: 'trade-based', type: 'Dynamic', risk: 'High', active: false },
    { id: 'TB-053', name: 'In case of import via land port multiple land port mentioned', category: 'Trade Based', categoryClass: 'trade-based', type: 'Built-in', risk: 'High', active: false },
    { id: 'TB-054', name: 'Goods import through Israeli flag bearing vessel', category: 'Trade Based', categoryClass: 'trade-based', type: 'Built-in', risk: 'High', active: false },
    { id: 'TB-055', name: 'Import from which country that has attributed sanction by different stakeholder or organization', category: 'Trade Based', categoryClass: 'trade-based', type: 'Built-in', risk: 'High', active: false },
    { id: 'TB-056', name: 'Import from a country that is involved with war', category: 'Trade Based', categoryClass: 'trade-based', type: 'Built-in', risk: 'High', active: false },
    { id: 'TB-057', name: 'Owners lacking relevant experience', category: 'Trade Based', categoryClass: 'trade-based', type: 'Dynamic', risk: 'Medium', active: false },
    { id: 'TB-058', name: 'Inconsistent staff count and trading volume', category: 'Trade Based', categoryClass: 'trade-based', type: 'Dynamic', risk: 'Medium', active: false },
    { id: 'TB-059', name: 'Relationship with PEP/IP', category: 'Trade Based', categoryClass: 'trade-based', type: 'Built-in', risk: 'High', active: false },
    { id: 'TB-060', name: 'Frequently Changing ownership or Signatories', category: 'Trade Based', categoryClass: 'trade-based', type: 'Dynamic', risk: 'High', active: false },
    { id: 'TB-061', name: 'Financing from unrelated sources — Commodity purchases are funded by sudden capital influxes from unrelated third parties', category: 'Trade Based', categoryClass: 'trade-based', type: 'Dynamic', risk: 'High', active: false },
    { id: 'TB-062', name: 'Invoice showing significant amount of misc charges e.g. handling charges', category: 'Trade Based', categoryClass: 'trade-based', type: 'Dynamic', risk: 'High', active: false },
    { id: 'TB-063', name: 'Transshipment through a country for no apparent reason', category: 'Trade Based', categoryClass: 'trade-based', type: 'Dynamic', risk: 'High', active: false },
    { id: 'TB-064', name: 'Vessel/Container number cannot be verified or tracked', category: 'Trade Based', categoryClass: 'trade-based', type: 'Dynamic', risk: 'High', active: false },
    { id: 'TB-065', name: 'Spare parts import with inconsistent documentation', category: 'Trade Based', categoryClass: 'trade-based', type: 'Built-in', risk: 'High', active: false },
    { id: 'TB-066', name: 'Price mentioned in KG whereas in open source prices are mentioned in pieces or in sets or in dozens', category: 'Trade Based', categoryClass: 'trade-based', type: 'Dynamic', risk: 'High', active: false },
    { id: 'TB-067', name: 'Price determination in case of capital machinery', category: 'Trade Based', categoryClass: 'trade-based', type: 'Dynamic', risk: 'Medium', active: false },
    { id: 'TB-068', name: 'Refund manipulation', category: 'Trade Based', categoryClass: 'trade-based', type: 'Dynamic', risk: 'High', active: false },
    { id: 'TB-069', name: 'LC or TT Value below the range for which Credit report is required', category: 'Trade Based', categoryClass: 'trade-based', type: 'Built-in', risk: 'Medium', active: false },
    { id: 'TB-070', name: 'Same address of Beneficiary/Applicant, Drawer/Drawee, Related parties/other address inconsistencies', category: 'Trade Based', categoryClass: 'trade-based', type: 'Dynamic', risk: 'High', active: false },
    { id: 'TB-071', name: 'Misrepresentation of quantity or type of goods imported or exported — Quantity declared during opening of LC differs with quantity in commercial Invoice more than 10% and/or type of goods differs (HS Code different in shipping documents for LC)', category: 'Trade Based', categoryClass: 'trade-based', type: 'Dynamic', risk: 'High', active: false },
    { id: 'TB-072', name: 'The Bill of lading describes containerized cargo but without container numbers or with sequential container numbers', category: 'Trade Based', categoryClass: 'trade-based', type: 'Built-in', risk: 'High', active: false },
    { id: 'TB-073', name: 'The port of loading or date of loading does not match the bill of lading', category: 'Trade Based', categoryClass: 'trade-based', type: 'Built-in', risk: 'High', active: false },
    { id: 'TB-074', name: 'Alternation of PI Information after remitting advance TT or issuing DA/DP Number', category: 'Trade Based', categoryClass: 'trade-based', type: 'Dynamic', risk: 'High', active: false },
    { id: 'TB-075', name: 'During Settlement, obtaining huge amount of discount on bill value from beneficiary', category: 'Trade Based', categoryClass: 'trade-based', type: 'Dynamic', risk: 'High', active: false },
    { id: 'TB-076', name: 'Different HS code found in the Bill of Entry as compared to the respective commercial Invoice', category: 'Trade Based', categoryClass: 'trade-based', type: 'Built-in', risk: 'High', active: false },
    { id: 'TB-077', name: 'Single HS Code for various items', category: 'Trade Based', categoryClass: 'trade-based', type: 'Dynamic', risk: 'High', active: false },
    { id: 'TB-078', name: 'No Mother LC is found against B2B LC', category: 'Trade Based', categoryClass: 'trade-based', type: 'Built-in', risk: 'High', active: false },

    // ══════════════════════════════════════════════
    // Remittance — New Rules from BB Guideline
    // ══════════════════════════════════════════════
    { id: 'RM-004', name: 'Single Sender but multiple Receiver', category: 'Remittance', categoryClass: 'remittance', type: 'Built-in', risk: 'High', active: false },
    { id: 'RM-005', name: 'Remittance coming from a country with no relevance with Beneficial Owner', category: 'Remittance', categoryClass: 'remittance', type: 'Dynamic', risk: 'High', active: false },
    { id: 'RM-006', name: 'Remittances timed with political or economic events to disguise intent', category: 'Remittance', categoryClass: 'remittance', type: 'Dynamic', risk: 'High', active: false },
    { id: 'RM-007', name: 'Remittances via mobile wallets or fintech apps from high-risk jurisdictions', category: 'Remittance', categoryClass: 'remittance', type: 'Dynamic', risk: 'High', active: false },
    { id: 'RM-008', name: 'Remittance sent via shell companies / third-party intermediaries', category: 'Remittance', categoryClass: 'remittance', type: 'Dynamic', risk: 'High', active: false },
  ];

  categories: RuleCategory[] = ['General Banking', 'Credit', 'Trade Based', 'Remittance'];
  ruleTypes: RuleType[] = ['Built-in', 'Dynamic'];

  searchTerm = '';
  selectedCategory = 'All Categories';
  selectedRuleType = 'All Types';
  selectedStatus = 'All Status';
  currentPage = 1;
  pageSize = 20;

  get stats() {
    const totalRules = this.allRules.length;
    const activeRules = this.allRules.filter((rule) => rule.active).length;
    const builtInRules = this.allRules.filter((rule) => rule.type === 'Built-in').length;
    const dynamicRules = this.allRules.filter((rule) => rule.type === 'Dynamic').length;

    return { totalRules, activeRules, builtInRules, dynamicRules };
  }

  get allFilteredRules() {
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

  get filteredRules() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.allFilteredRules.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.allFilteredRules.length / this.pageSize);
  }

  get pageNumbers(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const pages: number[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push(-1);
      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (current < total - 2) pages.push(-1);
      pages.push(total);
    }

    return pages;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  resetPage() {
    this.currentPage = 1;
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
