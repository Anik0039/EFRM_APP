import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { InputTextModule } from 'primeng/inputtext';

import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  username = '';
  password = '';
  showPassword = false;
  errorMessage = signal('');
  loading = signal(false);

  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  login(): void {
    this.errorMessage.set('');
    if (!this.username || !this.password) {
      this.errorMessage.set('Username and password are required.');
      return;
    }
    this.loading.set(true);
    const ok = this.authService.login(this.username, this.password);
    this.loading.set(false);
    if (ok) {
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMessage.set('Invalid username or password.');
    }
  }
}
