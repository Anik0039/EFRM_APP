import { Injectable } from '@angular/core';

interface ReportField {
  label: string;
  value: string;
}

interface ReportSection {
  heading: string;
  fields: ReportField[];
}

interface RuleReport {
  subtitle: string;
  positiveAlert: ReportSection;
  negativeAlert: ReportSection;
}

@Injectable({ providedIn: 'root' })
export class ReportGeneratorService {
  private readonly FOOTER_TEXT =
    'Bank Asia PLC | Enterprise Financial Risk Monitoring (EFRM) | Confidential Compliance Report | \u00A9 2026 Bank Asia PLC';

  private logoBase64: string | null = null;
  private logoLoadPromise: Promise<string> | null = null;

  private loadLogo(): Promise<string> {
    if (this.logoBase64) return Promise.resolve(this.logoBase64);
    if (this.logoLoadPromise) return this.logoLoadPromise;

    this.logoLoadPromise = new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        this.logoBase64 = canvas.toDataURL('image/png');
        resolve(this.logoBase64);
      };
      img.onerror = () => {
        // Fallback: no logo
        this.logoBase64 = '';
        resolve('');
      };
      img.src = 'bank-asia-logo.png';
    });

    return this.logoLoadPromise;
  }

  private readonly ruleReports: Record<string, (alertData: any) => RuleReport> = {
    'GB-001': (data) => ({
      subtitle: 'GB-001 \u2013 Splitting of Cash Deposits',
      positiveAlert: {
        heading: 'Positive Alert Details',
        fields: [
          { label: 'Alert ID', value: data.alertId },
          { label: 'Customer ID', value: data.customerId },
          { label: 'Account', value: data.accountNumber?.replace('ACC-', '') || '' },
          { label: 'Branch', value: data.branchName?.replace(' Branch', '') || '' },
          { label: 'Transactions', value: this.formatTxnShort(data.transactions) },
          { label: 'Observation', value: `${data.observationHighlight || '3 deposits'} between 900k\u2013999k within 30 days` },
          { label: 'Reason', value: 'Possible structuring to avoid 1M reporting threshold' },
          { label: 'Status', value: data.alertStatus === 'Closed' ? 'Closed \u2013 Valid activity' : 'Suspicious \u2013 Investigation Required' },
        ],
      },
      negativeAlert: {
        heading: 'Negative Alert Details',
        fields: [
          { label: 'Alert ID', value: this.getCounterpartAlertId(data.alertId) },
          { label: 'Customer ID', value: 'CUST-22314' },
          { label: 'Account', value: '104789421' },
          { label: 'Transactions', value: '03 Mar \u2013 920,000 | 27 Mar \u2013 930,000' },
          { label: 'Reason', value: 'Retail business cash collection' },
          { label: 'Status', value: 'Closed \u2013 Valid activity' },
        ],
      },
    }),

    'GB-002': (data) => ({
      subtitle: 'GB-002 \u2013 Sudden High Value Transaction',
      positiveAlert: {
        heading: 'Positive Alert Details',
        fields: [
          { label: 'Alert ID', value: data.alertId },
          { label: 'Customer ID', value: data.customerId },
          { label: 'Transaction', value: `Online Transfer \u2013 4,500,000` },
          { label: 'Historical Max', value: '1,800,000' },
          { label: 'Calculation', value: '4,500,000 > 2 \u00D7 1,800,000' },
          { label: 'Reason', value: 'Exceeds customer historical behaviour' },
          { label: 'Status', value: data.alertStatus === 'Closed' ? 'Closed \u2013 Legitimate' : 'Under Review' },
        ],
      },
      negativeAlert: {
        heading: 'Negative Alert Details',
        fields: [
          { label: 'Alert ID', value: this.getCounterpartAlertId(data.alertId) },
          { label: 'Reason', value: 'Funds from property sale' },
          { label: 'Verification', value: 'Sale agreement' },
          { label: 'Status', value: 'Closed \u2013 Legitimate' },
        ],
      },
    }),

    'CR-005': (data) => ({
      subtitle: 'CR-005 \u2013 Loan Used Outside Approved Purpose',
      positiveAlert: {
        heading: 'Positive Alert Details',
        fields: [
          { label: 'Alert ID', value: data.alertId },
          { label: 'Loan Amount', value: '5,000,000' },
          { label: 'Purpose', value: 'SME Machinery Purchase' },
          { label: 'Transaction', value: 'Luxury Car \u2013 1,800,000' },
          { label: 'Threshold', value: '20% = 1,000,000' },
          { label: 'Reason', value: 'Loan diversion suspected' },
          { label: 'Status', value: data.alertStatus === 'Closed' ? 'Closed \u2013 Legitimate' : 'Suspicious' },
        ],
      },
      negativeAlert: {
        heading: 'Negative Alert Details',
        fields: [
          { label: 'Alert ID', value: this.getCounterpartAlertId(data.alertId) },
          { label: 'Reason', value: 'Payment to supplier through logistics' },
          { label: 'Verification', value: 'Documents verified' },
          { label: 'Status', value: 'Closed \u2013 Legitimate' },
        ],
      },
    }),

    'TB-008': (data) => ({
      subtitle: 'TB-008 \u2013 Trade Invoice Discrepancy',
      positiveAlert: {
        heading: 'Positive Alert Details',
        fields: [
          { label: 'Alert ID', value: data.alertId },
          { label: 'Product', value: 'Steel Rod' },
          { label: 'HS Code', value: '7214' },
          { label: 'Avg Price', value: '1000 USD' },
          { label: 'Invoice Price', value: '1250 USD' },
          { label: 'Difference', value: '25%' },
          { label: 'Threshold', value: '10%' },
          { label: 'Reason', value: 'Possible over-invoicing' },
          { label: 'Status', value: data.alertStatus === 'Closed' ? 'Closed \u2013 Market price' : 'Escalated' },
        ],
      },
      negativeAlert: {
        heading: 'Negative Alert Details',
        fields: [
          { label: 'Alert ID', value: this.getCounterpartAlertId(data.alertId) },
          { label: 'Reason', value: 'Global steel price increase' },
          { label: 'Verification', value: 'Commodity index' },
          { label: 'Status', value: 'Closed \u2013 Market price' },
        ],
      },
    }),

    'RM-003': (data) => ({
      subtitle: 'RM-003 \u2013 Incoming Remittance from High Risk Country',
      positiveAlert: {
        heading: 'Positive Alert Details',
        fields: [
          { label: 'Alert ID', value: data.alertId },
          { label: 'Country', value: 'High Risk Jurisdiction' },
          { label: 'Amount', value: '450,000 BDT' },
          { label: 'Reason', value: 'Sender relationship unclear' },
          { label: 'Status', value: data.alertStatus === 'Closed' ? 'Closed \u2013 Legitimate' : 'Suspicious \u2013 EDD Required' },
        ],
      },
      negativeAlert: {
        heading: 'Negative Alert Details',
        fields: [
          { label: 'Alert ID', value: this.getCounterpartAlertId(data.alertId) },
          { label: 'Reason', value: 'Customer overseas salary remittance' },
          { label: 'Verification', value: 'Employment documents' },
          { label: 'Status', value: 'Closed \u2013 Legitimate' },
        ],
      },
    }),
  };

  async generateReport(alertData: any): Promise<void> {
    const [{ default: jsPDF }, logoData] = await Promise.all([
      import('jspdf'),
      this.loadLogo(),
    ]);

    const ruleId = alertData.ruleId;
    const reportBuilder = this.ruleReports[ruleId];

    if (!reportBuilder) {
      this.generateGenericReport(jsPDF, alertData, logoData);
      return;
    }

    const report = reportBuilder(alertData);
    this.buildPdf(jsPDF, report, alertData.alertId, ruleId, logoData);
  }

  private buildPdf(
    JsPDF: typeof import('jspdf').default,
    report: RuleReport,
    alertId: string,
    ruleId: string,
    logoData: string,
  ): void {
    const doc = new JsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 25;
    const contentWidth = pageWidth - margin * 2;
    let y = 20;

    // --- Bank Asia Logo ---
    y = this.drawLogo(doc, pageWidth, y, logoData);
    y += 15;

    // --- Main Title ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    const mainTitle = 'Bank Asia PLC \u2013 EFRM Alert Investigation Report';
    const titleLines = doc.splitTextToSize(mainTitle, contentWidth);
    doc.text(titleLines, pageWidth / 2, y, { align: 'center' });
    y += titleLines.length * 10 + 8;

    // --- Rule Subtitle ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(report.subtitle, margin, y);
    y += 14;

    // --- Positive Alert Table ---
    y = this.renderTableSection(doc, report.positiveAlert, y, margin, contentWidth);
    y += 14;

    // --- Negative Alert Table ---
    y = this.renderTableSection(doc, report.negativeAlert, y, margin, contentWidth);

    // --- Footer ---
    this.drawFooter(doc, pageWidth, pageHeight);

    const filename = `${ruleId.replace('-', '')}_BankAsia_${alertId}_Report.pdf`;
    doc.save(filename);
  }

  private drawLogo(doc: any, pageWidth: number, startY: number, logoData: string): number {
    // Logo aspect ratio from the actual image (~800x172 → ~4.65:1)
    const logoHeight = 14;
    const logoWidth = logoHeight * 4.65;
    const logoX = (pageWidth - logoWidth) / 2;

    if (logoData) {
      doc.addImage(logoData, 'PNG', logoX, startY, logoWidth, logoHeight);
    }

    return startY + logoHeight;
  }

  private renderTableSection(
    doc: any,
    section: ReportSection,
    startY: number,
    margin: number,
    contentWidth: number,
  ): number {
    let y = startY;
    const rowHeight = 9;
    const fieldColWidth = contentWidth * 0.35;
    const detailsColWidth = contentWidth * 0.65;

    // Section heading
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(0, 0, 0);
    doc.text(section.heading, margin, y);
    y += 8;

    // Table header row (gray background)
    doc.setFillColor(230, 230, 230);
    doc.rect(margin, y, contentWidth, rowHeight, 'F');

    // Header borders
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.3);
    doc.rect(margin, y, fieldColWidth, rowHeight, 'S');
    doc.rect(margin + fieldColWidth, y, detailsColWidth, rowHeight, 'S');

    // Header text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text('Field', margin + 4, y + rowHeight / 2 + 1, { baseline: 'middle' });
    doc.text('Details', margin + fieldColWidth + 4, y + rowHeight / 2 + 1, { baseline: 'middle' });
    y += rowHeight;

    // Data rows
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    for (const field of section.fields) {
      // Calculate row height based on text wrapping
      const valueLines = doc.splitTextToSize(field.value || '', detailsColWidth - 8);
      const currentRowHeight = Math.max(rowHeight, valueLines.length * 5 + 4);

      // Check page overflow
      if (y + currentRowHeight > 270) {
        this.drawFooter(doc, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());
        doc.addPage();
        y = 25;
      }

      // Row background (alternating white)
      doc.setFillColor(255, 255, 255);
      doc.rect(margin, y, contentWidth, currentRowHeight, 'F');

      // Cell borders
      doc.setDrawColor(180, 180, 180);
      doc.setLineWidth(0.3);
      doc.rect(margin, y, fieldColWidth, currentRowHeight, 'S');
      doc.rect(margin + fieldColWidth, y, detailsColWidth, currentRowHeight, 'S');

      // Field label
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.text(field.label, margin + 4, y + currentRowHeight / 2 + 1, { baseline: 'middle' });

      // Field value (with wrapping support)
      if (valueLines.length === 1) {
        doc.text(valueLines[0], margin + fieldColWidth + 4, y + currentRowHeight / 2 + 1, { baseline: 'middle' });
      } else {
        let textY = y + 5;
        for (const line of valueLines) {
          doc.text(line, margin + fieldColWidth + 4, textY);
          textY += 5;
        }
      }

      y += currentRowHeight;
    }

    return y;
  }

  private drawFooter(doc: any, pageWidth: number, pageHeight: number): void {
    const footerY = pageHeight - 12;

    // Footer separator line
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(25, footerY - 3, pageWidth - 25, footerY - 3);

    // Footer text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);
    doc.text(this.FOOTER_TEXT, pageWidth / 2, footerY, { align: 'center' });
  }

  private generateGenericReport(JsPDF: typeof import('jspdf').default, alertData: any, logoData: string): void {
    const doc = new JsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 25;
    const contentWidth = pageWidth - margin * 2;
    let y = 20;

    // Logo
    y = this.drawLogo(doc, pageWidth, y, logoData);
    y += 15;

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text('Bank Asia PLC \u2013 EFRM Alert Investigation Report', pageWidth / 2, y, { align: 'center' });
    y += 12;

    // Subtitle
    doc.setFontSize(13);
    doc.text(`${alertData.ruleId} \u2013 ${alertData.ruleName}`, margin, y);
    y += 14;

    // Build a single table
    const fields: ReportField[] = [
      { label: 'Alert ID', value: alertData.alertId },
      { label: 'Rule ID', value: alertData.ruleId },
      { label: 'Rule Name', value: alertData.ruleName },
      { label: 'Category', value: alertData.category },
      { label: 'Status', value: alertData.alertStatus },
      { label: 'Variance', value: `${alertData.variance}%` },
      { label: 'Date', value: alertData.alertDate },
      { label: 'Customer ID', value: alertData.customerId },
      { label: 'Customer Name', value: alertData.customerName },
      { label: 'Account', value: alertData.accountNumber },
      { label: 'Branch', value: alertData.branchName },
    ];

    y = this.renderTableSection(doc, { heading: 'Alert Details', fields }, y, margin, contentWidth);

    this.drawFooter(doc, pageWidth, pageHeight);
    doc.save(`${alertData.ruleId?.replace('-', '') || 'Alert'}_BankAsia_${alertData.alertId}_Report.pdf`);
  }

  private formatTxnShort(transactions: { date: string; amount: string }[]): string {
    if (!transactions || transactions.length === 0) return 'N/A';
    return transactions
      .map((t) => {
        const dateShort = t.date.replace(/-(\d{4})/, '').replace(/-/g, ' ');
        const amt = t.amount.replace(/[^\d,]/g, '');
        return `${dateShort} \u2013 ${amt}`;
      })
      .join(' | ');
  }

  private getCounterpartAlertId(alertId: string): string {
    if (alertId.endsWith('-01')) {
      return alertId.replace(/-01$/, '-02');
    }
    return alertId.replace(/-02$/, '-01');
  }
}
