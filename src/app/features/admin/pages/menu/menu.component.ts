import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleI18nService } from '../../../../core/services/simple-i18n.service';

@Component({
  selector: 'app-admin-menu',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-menu">
      <div class="page-header">
        <h1>{{ i18nService.translate('admin.nav.menu') }}</h1>
        <p>{{ i18nService.translate('admin.menu.description') }}</p>
      </div>
      <div class="content-placeholder">
        <div class="placeholder-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
        </div>
        <h3>{{ i18nService.translate('admin.menu.title') }}</h3>
        <p>{{ i18nService.translate('admin.menu.placeholder') }}</p>
      </div>
    </div>
  `,
  styles: [`
    .admin-menu { padding: 0; }
    .page-header { margin-bottom: 32px; }
    .page-header h1 { font-size: 28px; font-weight: 600; color: var(--text-color); margin: 0 0 8px 0; }
    .page-header p { color: var(--text-color-secondary); margin: 0; }
    .content-placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 20px; text-align: center; background: var(--surface-color); border: 1px solid var(--border-color); border-radius: 12px; }
    .placeholder-icon { margin-bottom: 24px; color: var(--text-color-secondary); }
    .content-placeholder h3 { font-size: 20px; font-weight: 600; color: var(--text-color); margin: 0 0 12px 0; }
    .content-placeholder p { color: var(--text-color-secondary); margin: 0; max-width: 400px; }
  `]
})
export class MenuComponent {
  constructor(public i18nService: SimpleI18nService) {}
}
