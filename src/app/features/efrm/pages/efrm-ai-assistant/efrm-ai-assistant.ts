import { Component, signal, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  typing?: boolean;
}

interface SuggestionChip {
  label: string;
  query: string;
}

@Component({
  selector: 'app-efrm-ai-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './efrm-ai-assistant.html',
  styleUrl: './efrm-ai-assistant.scss',
})
export class EfrmAiAssistantComponent implements AfterViewChecked {
  @ViewChild('chatBody') private chatBody!: ElementRef<HTMLDivElement>;

  readonly messages = signal<ChatMessage[]>([
    {
      id: 1,
      role: 'assistant',
      text: "Hello! I'm the EFRM AI Assistant. I can help you with fraud detection rules, AML compliance queries, alert management, risk scoring, and system operations.\n\nHow can I assist you today?",
      timestamp: new Date(),
    },
  ]);

  userInput = '';
  private nextId = 2;
  private shouldScroll = false;

  readonly suggestions: SuggestionChip[] = [
    { label: 'What is EFRM?', query: 'What is EFRM?' },
    { label: 'How does rule GB-001 work?', query: 'How does rule GB-001 work?' },
    { label: 'Show high risk alerts', query: 'Show me the current high risk alerts summary' },
    { label: 'AML compliance overview', query: 'Give me an AML compliance overview' },
    { label: 'Explain risk scoring', query: 'How does the risk scoring system work?' },
  ];

  private readonly knowledgeBase: Record<string, string> = {
    // Greetings
    'hello|hi|hey|good morning|good afternoon':
      "Hello! Welcome to the EFRM AI Assistant. I'm here to help with fraud detection, AML compliance, rule configuration, and system queries. What would you like to know?",

    // EFRM System
    'what is efrm|about efrm|efrm system':
      "**EFRM (Enterprise Fraud Detection & Risk Management)** is a comprehensive system designed for Bank Asia PLC to monitor, detect, and manage financial fraud and risk across all banking channels.\n\n**Key Capabilities:**\n- Real-time transaction monitoring across all banking channels\n- AI/ML behavioral analytics for anomaly detection\n- Rule-based suspicious transaction detection\n- Alert management and case investigation workflows\n- AML/CFT compliance with Bangladesh Bank & BFIU directives\n- Maker-Checker approval workflows\n- Comprehensive audit trails and reporting\n\nThe system currently monitors **1.2M+ transactions** with a **94.2% detection accuracy**.",

    // Rule GB-001
    'gb-001|splitting.*cash|cash deposit.*split|structuring|smurfing':
      "**Rule GB-001 — Splitting of Cash Deposits**\n\n**Category:** General Banking\n**Risk Level:** High\n**Status:** Active\n\n**Rule Logic:**\nDetects cash deposits between **BDT 900,000–999,999** occurring more than **2 times in a month**. This pattern is known as \"structuring\" or \"smurfing\" — where large amounts are split into smaller deposits to avoid reporting thresholds.\n\n**Key Parameters:**\n- Min Amount: BDT 900,000\n- Max Amount: BDT 999,999\n- Frequency Threshold: >2 per month\n- Monitoring Period: 30 Days\n\n**Rule Expression:**\n```\nTransaction_Type = Cash Deposit\nAND Amount BETWEEN 900000 AND 999999\nAND Transaction_Count > 2\nWITHIN 30 Days\n```\n\nThis rule has generated **247 alerts** with **90.7% accuracy** in the last 30 days.",

    // GB-006
    'gb-006|dormant.*account|inactive.*account':
      "**Rule GB-006 — Dormant Account High Activity**\n\n**Category:** General Banking\n**Risk Level:** High\n**Status:** Active\n\n**Rule Logic:**\nFlags accounts that have been dormant for **12+ months** and suddenly receive high-value transactions **≥ BDT 500,000**.\n\n**Key Parameters:**\n- Dormant Period: 12 Months\n- Min Transaction Amount: BDT 500,000\n- Transaction Type: Any\n\n**Rule Expression:**\n```\nAccount_Status = Dormant\nAND Transaction_Amount >= 500000\n```\n\nDormant accounts are often targeted for money laundering due to their low visibility. This rule detected **89 alerts** last month.",

    // CR-005
    'cr-005|loan.*purpose|credit.*misuse|loan diversion':
      "**Rule CR-005 — Loan Used Outside Approved Purpose**\n\n**Category:** Credit\n**Risk Level:** High\n**Status:** Active\n\n**Rule Logic:**\nMonitors loan disbursements where proceeds are used for transactions **inconsistent with the approved loan purpose**, with deviation exceeding **20% of loan value** within **30 days**.\n\n**Key Parameters:**\n- Loan Amount Threshold: BDT 1,000,000\n- Deviation Threshold: 20%\n- Monitoring Period: 30 Days\n\nThis detects credit misuse and loan diversion, a common fraud pattern in commercial banking.",

    // TB-008
    'tb-008|trade.*invoice|invoice.*discrepancy|tbml|trade.*money laundering':
      "**Rule TB-008 — Trade Invoice Discrepancy**\n\n**Category:** Trade Based\n**Risk Level:** High\n**Status:** Active\n\n**Rule Logic:**\nDetects trade invoices where the value differs **>10%** from the expected market value or **6-month historical price average**.\n\n**Key Parameters:**\n- Price Variation Threshold: 10%\n- Historical Price Window: 6 Months\n- Country Risk Level: All\n\n**Rule Expression:**\n```\nABS(Invoice_Value - Average_Price_Last_6_Months) > 10%\n```\n\nThis is critical for detecting **Trade Based Money Laundering (TBML)**, one of the most common channels for illicit fund movement.",

    // RM-003
    'rm-003|remittance.*high.*risk|high.*risk.*country|cross.*border':
      "**Rule RM-003 — Incoming Remittance from High Risk Country**\n\n**Category:** Remittance\n**Risk Level:** High\n**Status:** Active\n\n**Rule Logic:**\nMonitors incoming remittances from **high-risk jurisdictions** where the amount is **≥ BDT 100,000**.\n\n**Key Parameters:**\n- Country Risk List: FATF High Risk Countries\n- Minimum Amount: BDT 100,000\n- Monitoring Period: 30 Days\n\n**Rule Expression:**\n```\nTransaction_Type = Remittance\nAND Origin_Country IN High_Risk_Country_List\nAND Amount >= 100000\n```\n\nThis rule has the highest accuracy at **96.4%** and monitors **2.1M+ transactions**.",

    // High risk alerts
    'high risk alert|alert summary|current alert|alert status':
      "**Current Alert Summary**\n\n| Metric | Value |\n|--------|-------|\n| High Risk Alerts | **156** |\n| Medium Risk Alerts | **89** |\n| Low Risk Alerts | **34** |\n| Pending Investigation | **42** |\n| Resolved Today | **67** |\n\n**Top Alert Sources:**\n1. GB-001 (Cash Deposit Splitting) — 47 alerts\n2. RM-003 (High Risk Remittance) — 38 alerts\n3. TB-008 (Trade Invoice Discrepancy) — 31 alerts\n\n**Detection Accuracy:** 94.2%\n**Avg Response Time:** 2.3 minutes\n\nWould you like details on a specific alert category?",

    // AML Compliance
    'aml|compliance|bangladesh bank|bfiu|anti.*money|str|sar':
      "**AML Compliance Overview**\n\nThe EFRM system is aligned with the following regulatory frameworks:\n\n**Bangladesh Bank Directives:**\n- BFIU Circular No. 24 — Suspicious Transaction Reporting\n- BFIU Circular No. 19 — KYC/CDD Requirements\n- Money Laundering Prevention Act, 2012 (amended 2015)\n- Anti-Terrorism Act, 2009\n\n**Key Compliance Features:**\n- **STR/SAR Generation:** Automated suspicious transaction reports\n- **CTR Filing:** Cash Transaction Reports for amounts ≥ BDT 1,000,000\n- **KYC Verification:** Integrated with NID, TIN, and trade license databases\n- **Sanctions Screening:** Real-time screening against UN, OFAC, and local lists\n- **Audit Trail:** Complete maker-checker workflow logs\n\n**Current Month Stats:**\n- STRs Filed: 23\n- CTRs Generated: 1,247\n- Sanctions Hits: 3 (all resolved)\n\nThe system ensures full compliance with BFIU directives and international AML/CFT standards.",

    // Risk scoring
    'risk scor|scoring system|risk level|risk calculation':
      "**Risk Scoring System**\n\nThe EFRM uses a multi-factor risk scoring engine:\n\n**Score Ranges:**\n- **0–30:** Low Risk (Green)\n- **31–60:** Medium Risk (Yellow)\n- **61–100:** High Risk (Red)\n\n**Scoring Factors:**\n1. **Transaction Pattern** (30%) — Amount, frequency, timing anomalies\n2. **Customer Profile** (25%) — KYC status, account age, occupation risk\n3. **Geographic Risk** (20%) — Country/region risk ratings (FATF lists)\n4. **Behavioral Analytics** (15%) — ML-based deviation from historical patterns\n5. **Network Analysis** (10%) — Counterparty relationships and fund flows\n\n**AI/ML Models:**\n- Anomaly Detection (Isolation Forest)\n- Behavioral Clustering (K-Means)\n- Transaction Sequence Analysis (LSTM)\n\nRisk scores are recalculated in **real-time** for every transaction.",

    // Rules overview
    'how many rule|total rule|all rule|rule list|rule overview':
      "**Rules Overview**\n\n**Total Rules:** 15\n**Active Rules:** 12\n**Inactive Rules:** 3\n\n**By Category:**\n- General Banking: 5 rules\n- Credit: 3 rules\n- Trade Based: 4 rules\n- Remittance: 3 rules\n\n**By Type:**\n- Built-in Rules: 11\n- Dynamic Rules: 4\n\n**Top 5 Rules (Bangladesh Bank Guideline):**\n1. GB-001 — Splitting of Cash Deposits\n2. GB-006 — Dormant Account High Activity\n3. CR-005 — Loan Used Outside Approved Purpose\n4. TB-008 — Trade Invoice Discrepancy\n5. RM-003 — Incoming Remittance from High Risk Country\n\nYou can navigate to **Rules** from the sidebar to view and configure all rules.",

    // System status
    'system status|system health|uptime|performance':
      "**System Status**\n\n**Overall Health:** Operational\n**Uptime:** 99.97% (last 30 days)\n\n**Component Status:**\n- Transaction Monitoring Engine: **Online**\n- Rule Execution Engine: **Online**\n- Alert Management: **Online**\n- Reporting Module: **Online**\n- AI/ML Pipeline: **Online**\n\n**Performance Metrics:**\n- Avg Processing Latency: 45ms\n- Transactions/Second: 1,250\n- Active Connections: 47\n- Queue Depth: 12\n\n**Last Maintenance:** 2 days ago\n**Next Scheduled Maintenance:** Sunday, 2:00 AM",

    // Help
    'help|what can you do|capabilities|feature':
      "I can help you with the following:\n\n**Rule Management:**\n- Explain any rule (e.g., \"How does GB-001 work?\")\n- Show rule configurations and parameters\n- Provide rule performance statistics\n\n**Alert & Monitoring:**\n- Current alert summary and statistics\n- High/medium/low risk alert breakdown\n- Detection accuracy metrics\n\n**Compliance:**\n- AML/CFT compliance overview\n- Bangladesh Bank & BFIU directive information\n- STR/SAR reporting guidance\n\n**System:**\n- Risk scoring methodology\n- System health and performance\n- Rules overview and statistics\n\nJust type your question or click on a suggestion below!",

    // Thank you
    'thank|thanks|appreciate':
      "You're welcome! Feel free to ask if you have any other questions about the EFRM system, rules, or compliance. I'm here to help! 👋",
  };

  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  sendMessage() {
    const text = this.userInput.trim();
    if (!text) return;

    // Add user message
    this.messages.update((msgs) => [
      ...msgs,
      { id: this.nextId++, role: 'user', text, timestamp: new Date() },
    ]);
    this.userInput = '';
    this.shouldScroll = true;

    // Add typing indicator
    const typingId = this.nextId++;
    setTimeout(() => {
      this.messages.update((msgs) => [
        ...msgs,
        { id: typingId, role: 'assistant', text: '', timestamp: new Date(), typing: true },
      ]);
      this.shouldScroll = true;
    }, 300);

    // Generate response after delay
    const delay = 800 + Math.random() * 1200;
    setTimeout(() => {
      const response = this.generateResponse(text);
      this.messages.update((msgs) =>
        msgs.map((m) => (m.id === typingId ? { ...m, text: response, typing: false } : m)),
      );
      this.shouldScroll = true;
    }, delay);
  }

  clearChat() {
    this.messages.set([
      { id: 1, role: 'assistant', text: 'Chat cleared. How can I help you?', timestamp: new Date() },
    ]);
    this.nextId = 2;
  }

  useSuggestion(chip: SuggestionChip) {
    this.userInput = chip.query;
    this.sendMessage();
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  private generateResponse(input: string): string {
    const lower = input.toLowerCase();

    for (const [pattern, response] of Object.entries(this.knowledgeBase)) {
      const regex = new RegExp(pattern, 'i');
      if (regex.test(lower)) {
        return response;
      }
    }

    return "I understand your question, but I don't have specific information on that topic in my current knowledge base. I can help with:\n\n- **Rule details** (e.g., GB-001, CR-005, TB-008)\n- **Alert management** and monitoring statistics\n- **AML compliance** and regulatory information\n- **Risk scoring** methodology\n- **System status** and performance\n\nCould you rephrase your question or try one of the suggestion chips below?";
  }

  private scrollToBottom() {
    if (this.chatBody) {
      const el = this.chatBody.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }
}
