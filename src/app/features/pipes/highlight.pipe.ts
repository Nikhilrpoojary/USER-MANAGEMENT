import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'highlight',
  pure: false 
})
export class HighlightPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);
  transform(value: string, searchText: string): SafeHtml {
    if (!searchText || !value) {
      return value;
    }
    const valueStr = value.toString(); 
    const regex = new RegExp(searchText, 'gi');
    const highlightedValue = valueStr.replace(regex, (match) => `<span class="highlight">${match}</span>`);

    return this.sanitizer.bypassSecurityTrustHtml(highlightedValue);
  }
}
