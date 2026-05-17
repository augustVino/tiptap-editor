import { describe, it, expect } from 'vitest';
import { isMimeTypeAllowed } from '../file-handler';

describe('isMimeTypeAllowed', () => {
  it('should allow all files when no MIME types specified', () => {
    const file = new File([''], 'test.pdf', { type: 'application/pdf' });
    expect(isMimeTypeAllowed(file)).toBe(true);
    expect(isMimeTypeAllowed(file, [])).toBe(true);
  });

  it('should match exact MIME type', () => {
    const png = new File([''], 'test.png', { type: 'image/png' });
    expect(isMimeTypeAllowed(png, ['image/png'])).toBe(true);
    expect(isMimeTypeAllowed(png, ['image/jpeg'])).toBe(false);
  });

  it('should support wildcard patterns', () => {
    const png = new File([''], 'test.png', { type: 'image/png' });
    const jpg = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const pdf = new File([''], 'test.pdf', { type: 'application/pdf' });

    expect(isMimeTypeAllowed(png, ['image/*'])).toBe(true);
    expect(isMimeTypeAllowed(jpg, ['image/*'])).toBe(true);
    expect(isMimeTypeAllowed(pdf, ['image/*'])).toBe(false);
  });

  it('should match mixed exact and wildcard', () => {
    const png = new File([''], 'test.png', { type: 'image/png' });
    const pdf = new File([''], 'test.pdf', { type: 'application/pdf' });
    const txt = new File([''], 'test.txt', { type: 'text/plain' });

    expect(isMimeTypeAllowed(png, ['image/*', 'application/pdf'])).toBe(true);
    expect(isMimeTypeAllowed(pdf, ['image/*', 'application/pdf'])).toBe(true);
    expect(isMimeTypeAllowed(txt, ['image/*', 'application/pdf'])).toBe(false);
  });
});
