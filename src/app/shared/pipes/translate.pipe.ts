import { Pipe, PipeTransform } from '@angular/core';
import { SimpleI18nService } from '../../core/services/simple-i18n.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false // Make it impure to react to language changes
})
export class TranslatePipe implements PipeTransform {
  constructor(private i18nService: SimpleI18nService) {}

  transform(key: string): string {
    return this.i18nService.translate(key);
  }
}
