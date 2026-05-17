import { describe, it, expect } from 'vitest';
import { isMimeTypeAllowed, partitionFiles } from '../file-handler';

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

describe('partitionFiles', () => {
  it('should split files into allowed and rejected', () => {
    const png = new File([''], 'a.png', { type: 'image/png' });
    const pdf = new File([''], 'b.pdf', { type: 'application/pdf' });
    const txt = new File([''], 'c.txt', { type: 'text/plain' });

    const { allowed, rejected } = partitionFiles([png, pdf, txt], ['image/*', 'application/pdf']);
    expect(allowed).toEqual([png, pdf]);
    expect(rejected).toEqual([txt]);
  });

  it('should allow all when no MIME types specified', () => {
    const png = new File([''], 'a.png', { type: 'image/png' });
    const { allowed, rejected } = partitionFiles([png]);
    expect(allowed).toEqual([png]);
    expect(rejected).toEqual([]);
  });

  it('should handle empty file array', () => {
    const { allowed, rejected } = partitionFiles([], ['image/*']);
    expect(allowed).toEqual([]);
    expect(rejected).toEqual([]);
  });

  it('should reject all when nothing matches', () => {
    const txt = new File([''], 'c.txt', { type: 'text/plain' });
    const { allowed, rejected } = partitionFiles([txt], ['image/*']);
    expect(allowed).toEqual([]);
    expect(rejected).toEqual([txt]);
  });

  it('should reject files with empty or missing type when MIME filter is specified', () => {
    const emptyType = new File([''], 'noext', { type: '' });
    const noType = new File([''], 'noext2');
    const png = new File([''], 'a.png', { type: 'image/png' });

    const { allowed, rejected } = partitionFiles([emptyType, noType, png], ['image/*']);
    expect(allowed).toEqual([png]);
    expect(rejected).toEqual([emptyType, noType]);
  });
});
