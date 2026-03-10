import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

interface User {
  userId: string;
  name: string;
  username: string;
  employeeId: string;
  designation: string;
  role: string;
  active: boolean;
}

type FilterType = 'all' | 'active' | 'inactive';

@Component({
  selector: 'app-user-management-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonModule],
  templateUrl: './user-management-home.html',
  styleUrl: './user-management-home.scss',
})
export class UserManagementHomeComponent {
  readonly searchQuery = signal('');
  readonly activeFilter = signal<FilterType>('all');

  users = signal<User[]>([
    {
      userId: 'U001',
      name: 'Rahim Ahmed',
      username: 'admin',
      employeeId: 'EMP001',
      designation: 'System Admin',
      role: 'Administrator',
      active: true,
    },
    {
      userId: 'U002',
      name: 'Karim Hasan',
      username: 'analyst',
      employeeId: 'EMP002',
      designation: 'AML Analyst',
      role: 'Analyst',
      active: true,
    },
    {
      userId: 'U003',
      name: 'Shila Akter',
      username: 'compliance',
      employeeId: 'EMP003',
      designation: 'Risk Manager',
      role: 'Compliance Officer',
      active: true,
    },
    {
      userId: 'U004',
      name: 'Tanvir Islam',
      username: 'tanvir',
      employeeId: 'EMP004',
      designation: 'Compliance Checker',
      role: 'Analyst',
      active: false,
    },
  ]);

  readonly filteredUsers = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const filter = this.activeFilter();

    return this.users().filter((u) => {
      const matchesFilter =
        filter === 'all' ||
        (filter === 'active' && u.active) ||
        (filter === 'inactive' && !u.active);
      const matchesSearch =
        !query ||
        u.name.toLowerCase().includes(query) ||
        u.username.toLowerCase().includes(query) ||
        u.userId.toLowerCase().includes(query) ||
        u.employeeId.toLowerCase().includes(query) ||
        u.designation.toLowerCase().includes(query) ||
        u.role.toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    });
  });

  readonly totalUsers = computed(() => this.users().length);
  readonly activeUsers = computed(() => this.users().filter((u) => u.active).length);
  readonly inactiveUsers = computed(() => this.users().filter((u) => !u.active).length);

  setFilter(filter: FilterType): void {
    this.activeFilter.set(filter);
  }

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  toggleStatus(user: User): void {
    this.users.update((users) =>
      users.map((u) => (u.userId === user.userId ? { ...u, active: !u.active } : u)),
    );
  }

  editUser(user: User): void {
    // TODO: open edit dialog
    console.log('Edit user:', user.userId);
  }

  addUser(): void {
    // TODO: open add user dialog
    console.log('Add user');
  }

  exportUsers(): void {
    const rows = this.filteredUsers();
    const header = 'User ID,Name,Username,Employee ID,Designation,Role,Status';
    const csv = [
      header,
      ...rows.map(
        (u) =>
          `${u.userId},${u.name},${u.username},${u.employeeId},${u.designation},${u.role},${u.active ? 'Active' : 'Inactive'}`,
      ),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.csv';
    a.click();
    URL.revokeObjectURL(url);
  }
}
