import { Injectable } from '@angular/core';
import { NavSection } from '../../shared/interfaces/menu-item.model';

@Injectable({ providedIn: 'root' })
export class MenuService {
  getMenu(): NavSection[] {
    return [
      {
        sectionLabel: 'MENU',
        items: [
          {
            label: 'Categories',
            icon: 'pi pi-th-large',
            route: '/dashboard/efrm/categories',
          },
          {
            label: 'Rules',
            icon: 'pi pi-list',
            route: '/dashboard/efrm',
          },
          {
            label: 'Alert',
            icon: 'pi pi-bell',
            route: '/dashboard/efrm/alert',
          },
          {
            label: 'System',
            icon: 'pi pi-cog',
            route: '/dashboard/efrm/system',
          },
          {
            label: 'Approvals',
            icon: 'pi pi-check-circle',
            route: '/dashboard/efrm/approvals',
          },
          {
            label: 'AI Assistant',
            icon: 'pi pi-sparkles',
            route: '/dashboard/efrm/ai-assistant',
          },
        ],
      },
    ];
  }
}
