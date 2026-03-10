import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

type ConnStatus = 'Connected' | 'Syncing' | 'Disconnected';
type UserStatus = 'Active' | 'Idle' | 'Offline';
type LogResult = 'Success' | 'Failed' | 'Warning';

interface SystemSource {
  name: string;
  type: string;
  integration: string;
  status: ConnStatus;
  lastSync: string;
}

interface ActiveUser {
  name: string;
  empId: string;
  role: string;
  login: string;
  status: UserStatus;
  avatar: string;
}

interface ActivityLog {
  icon: string;
  iconClass: string;
  title: string;
  description: string;
  result: LogResult;
}

interface HealthIndicator {
  label: string;
  value: string;
  percent: number;
  color: string;
}

@Component({
  selector: 'app-efrm-system',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule],
  templateUrl: './efrm-system.html',
  styleUrl: './efrm-system.scss',
})
export class EfrmSystemComponent {
  // Summary stats
  stats = {
    activeUsers: 28,
    connectedSystems: 12,
    alertsProcessed: 247,
    systemHealth: 100,
  };

  // Data Integration & Source Connectivity
  sources: SystemSource[] = [
    { name: 'Core Banking System', type: 'CBS', integration: 'API', status: 'Connected', lastSync: '2 mins ago' },
    { name: 'BACH', type: 'Clearing House', integration: 'Message Queue', status: 'Connected', lastSync: '5 mins ago' },
    { name: 'BEFTN', type: 'Electronic Transfer', integration: 'ETL Pipeline', status: 'Syncing', lastSync: '10 mins ago' },
    { name: 'RTGS', type: 'Real Time Settlement', integration: 'API', status: 'Connected', lastSync: '1 min ago' },
    { name: 'ATM Network', type: 'ATM', integration: 'API', status: 'Connected', lastSync: '3 mins ago' },
    { name: 'POS Network', type: 'POS', integration: 'API', status: 'Connected', lastSync: '4 mins ago' },
    { name: 'Internet Banking', type: 'Digital Banking', integration: 'API', status: 'Connected', lastSync: '1 min ago' },
    { name: 'Mobile Banking', type: 'Mobile Financial Service', integration: 'API', status: 'Connected', lastSync: '6 mins ago' },
    { name: 'Agent Banking Platform', type: 'Agent Banking', integration: 'ETL Pipeline', status: 'Connected', lastSync: '8 mins ago' },
    { name: 'CRM System', type: 'Customer Relationship', integration: 'API', status: 'Disconnected', lastSync: '2 hours ago' },
    { name: 'Enterprise Data Warehouse (EDW)', type: 'Data Warehouse', integration: 'ETL Pipeline', status: 'Syncing', lastSync: '15 mins ago' },
    { name: 'Trade Finance System', type: 'Trade Finance', integration: 'Message Queue', status: 'Connected', lastSync: '7 mins ago' },
    { name: 'Remittance System', type: 'Remittance', integration: 'File Upload', status: 'Connected', lastSync: '12 mins ago' },
  ];

  // Active Users
  users: ActiveUser[] = [
    { name: 'Rahim Ahmed', empId: 'EMP-2341', role: 'Compliance Analyst', login: '09:10 AM', status: 'Active', avatar: 'RA' },
    { name: 'Sarah Khan', empId: 'EMP-1892', role: 'Risk Manager', login: '08:45 AM', status: 'Active', avatar: 'SK' },
    { name: 'Karim Hassan', empId: 'EMP-3456', role: 'System Admin', login: '07:30 AM', status: 'Active', avatar: 'KH' },
  ];

  userSearch = '';
  userRoleFilter = 'All Roles';
  userRoles = ['All Roles', 'Compliance Analyst', 'Risk Manager', 'System Admin'];

  get filteredUsers(): ActiveUser[] {
    let result = [...this.users];
    if (this.userRoleFilter !== 'All Roles') {
      result = result.filter((u) => u.role === this.userRoleFilter);
    }
    if (this.userSearch.trim()) {
      const term = this.userSearch.trim().toLowerCase();
      result = result.filter(
        (u) => u.name.toLowerCase().includes(term) || u.empId.toLowerCase().includes(term),
      );
    }
    return result;
  }

  // Activity Logs
  logs: ActivityLog[] = [
    { icon: 'pi pi-check-circle', iconClass: 'success', title: 'Rule GB-001 Activated', description: 'by Admin \u2022 Rules Module \u2022 10 Mar 2026 09:30', result: 'Success' },
    { icon: 'pi pi-eye', iconClass: 'info', title: 'Alert ALT-GB001 Reviewed', description: 'by Analyst \u2022 Alerts Module \u2022 10 Mar 2026 08:45', result: 'Success' },
    { icon: 'pi pi-sync', iconClass: 'sync', title: 'CBS Data Sync Completed', description: 'by System \u2022 Data Integration \u2022 10 Mar 2026 08:20', result: 'Success' },
    { icon: 'pi pi-exclamation-circle', iconClass: 'error', title: 'Failed Login Attempt', description: 'Unknown User \u2022 Authentication \u2022 10 Mar 2026 08:00', result: 'Failed' },
  ];

  logModuleFilter = 'All Modules';
  logDateFilter = '';
  logModules = ['All Modules', 'Rules Module', 'Alerts Module', 'Data Integration', 'Authentication'];

  get filteredLogs(): ActivityLog[] {
    let result = [...this.logs];
    if (this.logModuleFilter !== 'All Modules') {
      result = result.filter((l) => l.description.includes(this.logModuleFilter));
    }
    return result;
  }

  // Health Indicators
  healthIndicators: HealthIndicator[] = [
    { label: 'API Response Time', value: '120ms', percent: 88, color: '#1a56db' },
    { label: 'Data Processing', value: '92%', percent: 92, color: '#1a56db' },
    { label: 'Rule Execution', value: '98%', percent: 98, color: '#059669' },
    { label: 'System Uptime', value: '99.9%', percent: 99.9, color: '#059669' },
  ];

  refreshStatus() {
    // Simulate refresh - update lastSync timestamps
    this.sources = this.sources.map((s) => ({
      ...s,
      lastSync: s.status === 'Connected' ? 'Just now' : s.lastSync,
    }));
  }

  exportLogs() {
    // Placeholder for export functionality
  }
}
