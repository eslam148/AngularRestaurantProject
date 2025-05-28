import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleI18nService } from '../../../../core/services/simple-i18n.service';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-profile">
      <div class="page-header">
        <h1>{{ i18nService.translate('common.profile') }}</h1>
        <p>{{ i18nService.translate('admin.profile.description') }}</p>
      </div>
      <div class="content-placeholder">
        <div class="placeholder-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <h3>{{ i18nService.translate('admin.profile.title') }}</h3>
        <p>{{ i18nService.translate('admin.profile.placeholder') }}</p>
      </div>
    </div>
  `,
  styles: [`
    .admin-profile { padding: 0; }
    .page-header { margin-bottom: 32px; }
    .page-header h1 { font-size: 28px; font-weight: 600; color: var(--text-color); margin: 0 0 8px 0; }
    .page-header p { color: var(--text-color-secondary); margin: 0; }
    .content-placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 20px; text-align: center; background: var(--surface-color); border: 1px solid var(--border-color); border-radius: 12px; }
    .placeholder-icon { margin-bottom: 24px; color: var(--text-color-secondary); }
    .content-placeholder h3 { font-size: 20px; font-weight: 600; color: var(--text-color); margin: 0 0 12px 0; }
    .content-placeholder p { color: var(--text-color-secondary); margin: 0; max-width: 400px; }
  `]
})
export class ProfileComponent {
  constructor(public i18nService: SimpleI18nService) {}
}
