import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleI18nService } from '../../../../core/services/simple-i18n.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="auth-page">
      <div class="auth-container">
        <h1>{{ i18nService.translate('auth.forgotPassword.title') }}</h1>
        <p>{{ i18nService.translate('auth.forgotPassword.description') }}</p>
        <div class="placeholder-content">
          <p>{{ i18nService.translate('auth.forgotPassword.placeholder') }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--background-color); }
    .auth-container { max-width: 400px; padding: 40px; background: var(--surface-color); border-radius: 12px; border: 1px solid var(--border-color); text-align: center; }
    .auth-container h1 { font-size: 24px; font-weight: 600; color: var(--text-color); margin: 0 0 8px 0; }
    .auth-container p { color: var(--text-color-secondary); margin: 0 0 24px 0; }
    .placeholder-content { padding: 40px 20px; background: var(--background-color); border-radius: 8px; }
  `]
})
export class ForgotPasswordComponent {
  constructor(public i18nService: SimpleI18nService) {}
}
