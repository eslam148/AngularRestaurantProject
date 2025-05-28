import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleI18nService } from '../../../../core/services/simple-i18n.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-page">
      <div class="profile-container">
        <h1>{{ i18nService.translate('common.profile') }}</h1>
        <p>{{ i18nService.translate('profile.description') }}</p>
        <div class="placeholder-content">
          <p>{{ i18nService.translate('profile.placeholder') }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-page { min-height: 100vh; padding: 40px 20px; background: var(--background-color); }
    .profile-container { max-width: 600px; margin: 0 auto; padding: 40px; background: var(--surface-color); border-radius: 12px; border: 1px solid var(--border-color); }
    .profile-container h1 { font-size: 28px; font-weight: 600; color: var(--text-color); margin: 0 0 8px 0; }
    .profile-container p { color: var(--text-color-secondary); margin: 0 0 24px 0; }
    .placeholder-content { padding: 40px 20px; background: var(--background-color); border-radius: 8px; text-align: center; }
  `]
})
export class ProfileComponent {
  constructor(public i18nService: SimpleI18nService) {}
}
