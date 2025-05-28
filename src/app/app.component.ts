import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { ThemeService } from './core/services/theme.service';
import { SimpleI18nService } from './core/services/simple-i18n.service';
import { DataRefreshService } from './core/services/data-refresh.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'RestaurantApp';

  constructor(
    private themeService: ThemeService,
    private i18nService: SimpleI18nService,
    private dataRefreshService: DataRefreshService // Initialize to start listening
  ) {}

  ngOnInit(): void {
    // Initialize theme system
    this.themeService.watchSystemTheme();

    // Set initial document title
    document.title = this.i18nService.translate('app.title') || 'RestaurantApp';
  }
}
