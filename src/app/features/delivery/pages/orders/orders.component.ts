import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleI18nService } from '../../../../core/services/simple-i18n.service';

@Component({
  selector: 'app-delivery-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="delivery-orders">
      <div class="page-header">
        <h1>{{ i18nService.translate('delivery.nav.orders') }}</h1>
        <p>{{ i18nService.translate('delivery.orders.description') }}</p>
      </div>
      <div class="content-placeholder">
        <div class="placeholder-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
          </svg>
        </div>
        <h3>{{ i18nService.translate('delivery.orders.title') }}</h3>
        <p>{{ i18nService.translate('delivery.orders.placeholder') }}</p>
      </div>
    </div>
  `,
  styles: [`
    .delivery-orders { padding: 0; }
    .page-header { margin-bottom: 24px; }
    .page-header h1 { font-size: 24px; font-weight: 600; color: var(--text-color); margin: 0 0 8px 0; }
    .page-header p { color: var(--text-color-secondary); margin: 0; font-size: 14px; }
    .content-placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; text-align: center; background: var(--surface-color); border: 1px solid var(--border-color); border-radius: 12px; }
    .placeholder-icon { margin-bottom: 20px; color: var(--text-color-secondary); }
    .content-placeholder h3 { font-size: 18px; font-weight: 600; color: var(--text-color); margin: 0 0 8px 0; }
    .content-placeholder p { color: var(--text-color-secondary); margin: 0; max-width: 300px; font-size: 14px; }
  `]
})
export class OrdersComponent {
  constructor(public i18nService: SimpleI18nService) {}
}
