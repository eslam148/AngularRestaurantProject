import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleI18nService } from '../../../../core/services/simple-i18n.service';

@Component({
  selector: 'app-delivery-earnings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="delivery-earnings">
      <div class="page-header">
        <h1>{{ i18nService.translate('delivery.nav.earnings') }}</h1>
        <p>{{ i18nService.translate('delivery.earnings.description') }}</p>
      </div>
      <div class="content-placeholder">
        <div class="placeholder-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        </div>
        <h3>{{ i18nService.translate('delivery.earnings.title') }}</h3>
        <p>{{ i18nService.translate('delivery.earnings.placeholder') }}</p>
      </div>
    </div>
  `,
  styles: [`
    .delivery-earnings { padding: 0; }
    .page-header { margin-bottom: 24px; }
    .page-header h1 { font-size: 24px; font-weight: 600; color: var(--text-color); margin: 0 0 8px 0; }
    .page-header p { color: var(--text-color-secondary); margin: 0; font-size: 14px; }
    .content-placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; text-align: center; background: var(--surface-color); border: 1px solid var(--border-color); border-radius: 12px; }
    .placeholder-icon { margin-bottom: 20px; color: var(--text-color-secondary); }
    .content-placeholder h3 { font-size: 18px; font-weight: 600; color: var(--text-color); margin: 0 0 8px 0; }
    .content-placeholder p { color: var(--text-color-secondary); margin: 0; max-width: 300px; font-size: 14px; }
  `]
})
export class EarningsComponent {
  constructor(public i18nService: SimpleI18nService) {}
}
