import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { LoginComponent } from './features/auth/pages/login/login';
import { DashboardHomeComponent } from './features/dashboard/pages/dashboard-home/dashboard-home';
import { DashboardLayoutComponent } from './layout/dashboard-layout/dashboard-layout';
import { EfrmRulesComponent } from './features/efrm/pages/efrm-rules/efrm-rules';
import { EfrmRuleConfigComponent } from './features/efrm/pages/efrm-rule-config/efrm-rule-config';
import { EfrmAiAssistantComponent } from './features/efrm/pages/efrm-ai-assistant/efrm-ai-assistant';
import { UserManagementHomeComponent } from './features/user-management/pages/user-management-home/user-management-home';
import { AmlPolicyHomeComponent } from './features/aml-policy/pages/aml-policy-home/aml-policy-home';
import { EfrmCategorySetupComponent } from './features/efrm/pages/efrm-category-setup/efrm-category-setup';
import { EfrmApprovalsComponent } from './features/efrm/pages/efrm-approvals/efrm-approvals';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: DashboardHomeComponent },
      { path: 'efrm', component: EfrmRulesComponent },
      { path: 'efrm/categories', component: EfrmCategorySetupComponent },
      { path: 'efrm/approvals', component: EfrmApprovalsComponent },
      { path: 'efrm/rule-config/:ruleId', component: EfrmRuleConfigComponent },
      { path: 'efrm/ai-assistant', component: EfrmAiAssistantComponent },
      { path: 'user-management', component: UserManagementHomeComponent },
      { path: 'aml-policy', component: AmlPolicyHomeComponent },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
