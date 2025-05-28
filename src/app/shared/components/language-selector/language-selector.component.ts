import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleI18nService, Language } from '../../../core/services/simple-i18n.service';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="language-selector">
      <button
        class="language-toggle-btn"
        [attr.aria-label]="i18nService.translate('common.changeLanguage')"
        (click)="toggleDropdown()"
        type="button">
        <span class="current-language">
          {{ getCurrentLanguageDisplay() }}
        </span>
        <svg class="dropdown-icon" [class.rotated]="isDropdownOpen" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 11L3 6h10l-5 5z"/>
        </svg>
      </button>

      <div class="language-dropdown" [class.open]="isDropdownOpen">
        <button
          *ngFor="let lang of languages"
          class="language-option"
          [class.active]="lang.code === i18nService.currentLanguage"
          (click)="selectLanguage(lang.code)"
          type="button">
          <span class="language-flag">{{ lang.flag }}</span>
          <span class="language-name">{{ lang.name }}</span>
          <svg *ngIf="lang.code === i18nService.currentLanguage" class="check-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .language-selector {
      position: relative;
      display: inline-block;
    }

    .language-toggle-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      background: var(--surface-color, #ffffff);
      border: 1px solid var(--border-color, #e5e7eb);
      border-radius: 0.5rem;
      color: var(--text-color, #374151);
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;
      min-width: 120px;
    }

    .language-toggle-btn:hover {
      background: var(--surface-hover-color, #f9fafb);
      border-color: var(--border-hover-color, #d1d5db);
    }

    .language-toggle-btn:focus {
      outline: none;
      ring: 2px solid var(--primary-color, #3b82f6);
      ring-offset: 2px;
    }

    .current-language {
      flex: 1;
      text-align: left;
    }

    .dropdown-icon {
      transition: transform 0.2s ease;
      opacity: 0.6;
    }

    .dropdown-icon.rotated {
      transform: rotate(180deg);
    }

    .language-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: var(--surface-color, #ffffff);
      border: 1px solid var(--border-color, #e5e7eb);
      border-radius: 0.5rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      z-index: 50;
      margin-top: 0.25rem;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-0.5rem);
      transition: all 0.2s ease;
    }

    .language-dropdown.open {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .language-option {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.75rem;
      background: none;
      border: none;
      color: var(--text-color, #374151);
      font-size: 0.875rem;
      cursor: pointer;
      transition: background-color 0.2s ease;
      text-align: left;
    }

    .language-option:hover {
      background: var(--surface-hover-color, #f9fafb);
    }

    .language-option.active {
      background: var(--primary-light-color, #eff6ff);
      color: var(--primary-color, #3b82f6);
    }

    .language-option:first-child {
      border-radius: 0.5rem 0.5rem 0 0;
    }

    .language-option:last-child {
      border-radius: 0 0 0.5rem 0.5rem;
    }

    .language-flag {
      font-size: 1.25rem;
      line-height: 1;
    }

    .language-name {
      flex: 1;
    }

    .check-icon {
      opacity: 0.8;
    }

    /* RTL Support */
    [dir="rtl"] .language-dropdown {
      left: auto;
      right: 0;
    }

    [dir="rtl"] .current-language {
      text-align: right;
    }

    [dir="rtl"] .language-option {
      text-align: right;
    }

    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      .language-toggle-btn {
        background: var(--surface-color, #1f2937);
        border-color: var(--border-color, #374151);
        color: var(--text-color, #f9fafb);
      }

      .language-toggle-btn:hover {
        background: var(--surface-hover-color, #374151);
        border-color: var(--border-hover-color, #4b5563);
      }

      .language-dropdown {
        background: var(--surface-color, #1f2937);
        border-color: var(--border-color, #374151);
      }

      .language-option {
        color: var(--text-color, #f9fafb);
      }

      .language-option:hover {
        background: var(--surface-hover-color, #374151);
      }

      .language-option.active {
        background: var(--primary-dark-color, #1e40af);
        color: var(--primary-light-color, #93c5fd);
      }
    }
  `]
})
export class LanguageSelectorComponent {
  isDropdownOpen = false;

  languages = [
    { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
    { code: 'ar' as Language, name: 'العربية', flag: '🇸🇦' }
    // { code: 'es' as Language, name: 'Español', flag: '🇪🇸' },
    // { code: 'fr' as Language, name: 'Français', flag: '🇫🇷' }
  ];

  constructor(public i18nService: SimpleI18nService) {
    // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
      if (!event.target || !(event.target as Element).closest('.language-selector')) {
        this.isDropdownOpen = false;
      }
    });
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectLanguage(language: Language): void {
    this.i18nService.setLanguage(language);
    this.isDropdownOpen = false;
  }

  getCurrentLanguageDisplay(): string {
    const currentLang = this.languages.find(lang => lang.code === this.i18nService.currentLanguage);
    return currentLang ? `${currentLang.flag} ${currentLang.name}` : '🇺🇸 English';
  }
}
