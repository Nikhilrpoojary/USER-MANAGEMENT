import { HighlightPipe } from './highlight.pipe';
import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';

    const sanitizer = TestBed.inject(DomSanitizer);
    const pipe = new HighlightPipe(sanitizer);
  it('create an instance', () => {
    const sanitizer = TestBed.inject(DomSanitizer);
    const pipe = new HighlightPipe(sanitizer);
    expect(pipe).toBeTruthy();
  });

