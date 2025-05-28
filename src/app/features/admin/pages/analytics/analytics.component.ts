import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleI18nService } from '../../../../core/services/simple-i18n.service';

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-analytics">
      <div class="page-header">
        <h1>{{ i18nService.translate('admin.nav.analytics') }}</h1>
        <p>{{ i18nService.translate('admin.analytics.description') }}</p>
      </div>
      <div class="content-placeholder">
        <div class="placeholder-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"></polyline>
          </svg>
        </div>
        <h3>{{ i18nService.translate('admin.analytics.title') }}</h3>
        <p>{{ i18nService.translate('admin.analytics.placeholder') }}</p>
      </div>
    </div>
  `,
  styles: [`
    .admin-analytics { padding: 0; }
    .page-header { margin-bottom: 32px; }
    .page-header h1 { font-size: 28px; font-weight: 600; color: var(--text-color); margin: 0 0 8px 0; }
    .page-header p { color: var(--text-color-secondary); margin: 0; }
    .content-placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 20px; text-align: center; background: var(--surface-color); border: 1px solid var(--border-color); border-radius: 12px; }
    .placeholder-icon { margin-bottom: 24px; color: var(--text-color-secondary); }
    .content-placeholder h3 { font-size: 20px; font-weight: 600; color: var(--text-color); margin: 0 0 12px 0; }
    .content-placeholder p { color: var(--text-color-secondary); margin: 0; max-width: 400px; }
  `]
})
export class AnalyticsComponent {
  constructor(public i18nService: SimpleI18nService) {}
}
