import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-aml-policy-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule],
  templateUrl: './aml-policy-home.html',
  styleUrl: './aml-policy-home.scss',
})
export class AmlPolicyHomeComponent {
  stats = [
    { label: 'Active Policies', value: '28', icon: 'pi pi-file', color: '#059669', bg: '#ecfdf5' },
    { label: 'STR Reports', value: '14', icon: 'pi pi-flag', color: '#e53e3e', bg: '#fff5f5' },
    { label: 'Risk Rules', value: '63', icon: 'pi pi-list', color: '#1a56db', bg: '#eff6ff' },
    { label: 'Under Review', value: '5', icon: 'pi pi-search', color: '#d97706', bg: '#fffbeb' },
  ];
}
