import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuService } from '../../../core/services/menu.service';
import { NavSection } from '../../../shared/interfaces/menu-item.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app-sidebar.html',
  styleUrl: './app-sidebar.scss',
})
export class AppSidebarComponent {
  @Input() collapsed = false;
  @Input() mobileOpen = false;

  menu: NavSection[] = [];

  private readonly menuService = inject(MenuService);

  constructor() {
    this.menu = this.menuService.getMenu();
  }
}
