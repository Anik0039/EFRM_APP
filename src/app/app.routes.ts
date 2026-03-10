import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { LoginComponent } from './features/auth/pages/login/login';
import { DashboardHomeComponent } from './features/dashboard/pages/dashboard-home/dashboard-home';
import { DashboardLayoutComponent } from './layout/dashboard-layout/dashboard-layout';
import { EfrmDashboardComponent } from './features/efrm/pages/efrm-dashboard/efrm-dashboard';
import { EfrmRulesComponent } from './features/efrm/pages/efrm-rules/efrm-rules';
import { EfrmRuleConfigComponent } from './features/efrm/pages/efrm-rule-config/efrm-rule-config';
import { EfrmAiAssistantComponent } from './features/efrm/pages/efrm-ai-assistant/efrm-ai-assistant';
import { UserManagementHomeComponent } from './features/user-management/pages/user-management-home/user-management-home';
import { AmlPolicyHomeComponent } from './features/aml-policy/pages/aml-policy-home/aml-policy-home';
import { EfrmCategorySetupComponent } from './features/efrm/pages/efrm-category-setup/efrm-category-setup';
import { EfrmApprovalsComponent } from './features/efrm/pages/efrm-approvals/efrm-approvals';
import { EfrmAlertMonitoringComponent } from './features/efrm/pages/efrm-alert-monitoring/efrm-alert-monitoring';
import { EfrmAlertDetailsComponent } from './features/efrm/pages/efrm-alert-details/efrm-alert-details';
import { EfrmSystemComponent } from './features/efrm/pages/efrm-system/efrm-system';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: DashboardHomeComponent },
      { path: 'efrm', component: EfrmDashboardComponent },
      { path: 'efrm/rules', component: EfrmRulesComponent },
      { path: 'efrm/categories', component: EfrmCategorySetupComponent },
      { path: 'efrm/approvals', component: EfrmApprovalsComponent },
      { path: 'efrm/rule-config/:ruleId', component: EfrmRuleConfigComponent },
      { path: 'efrm/system', component: EfrmSystemComponent },
      { path: 'efrm/alert', component: EfrmAlertMonitoringComponent },
      { path: 'efrm/alert/:alertId', component: EfrmAlertDetailsComponent },
      { path: 'efrm/ai-assistant', component: EfrmAiAssistantComponent },
      { path: 'user-management', component: UserManagementHomeComponent },
      { path: 'aml-policy', component: AmlPolicyHomeComponent },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
