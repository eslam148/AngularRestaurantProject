import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleI18nService } from '../../../../core/services/simple-i18n.service';

@Component({
  selector: 'app-delivery-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="delivery-map">
      <div class="page-header">
        <h1>{{ i18nService.translate('delivery.nav.map') }}</h1>
        <p>{{ i18nService.translate('delivery.map.description') }}</p>
      </div>
      <div class="content-placeholder">
        <div class="placeholder-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="1,6 1,22 8,18 16,22 23,18 23,2 16,6 8,2 1,6"></polygon>
            <line x1="8" y1="2" x2="8" y2="18"></line>
            <line x1="16" y1="6" x2="16" y2="22"></line>
          </svg>
        </div>
        <h3>{{ i18nService.translate('delivery.map.title') }}</h3>
        <p>{{ i18nService.translate('delivery.map.placeholder') }}</p>
      </div>
    </div>
  `,
  styles: [`
    .delivery-map { padding: 0; }
    .page-header { margin-bottom: 24px; }
    .page-header h1 { font-size: 24px; font-weight: 600; color: var(--text-color); margin: 0 0 8px 0; }
    .page-header p { color: var(--text-color-secondary); margin: 0; font-size: 14px; }
    .content-placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; text-align: center; background: var(--surface-color); border: 1px solid var(--border-color); border-radius: 12px; }
    .placeholder-icon { margin-bottom: 20px; color: var(--text-color-secondary); }
    .content-placeholder h3 { font-size: 18px; font-weight: 600; color: var(--text-color); margin: 0 0 8px 0; }
    .content-placeholder p { color: var(--text-color-secondary); margin: 0; max-width: 300px; font-size: 14px; }
  `]
})
export class MapComponent {
  constructor(public i18nService: SimpleI18nService) {}
}
