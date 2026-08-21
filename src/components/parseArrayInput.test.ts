import { describe, it, expect } from 'vitest';
import { parseArrayInput, MAX_COUNT } from './parseArrayInput';

/**
 * These tests exist because of a bug that silently cost the site its mobile
 * visitors: the input asked for numbers "separated by spaces or commas" while
 * rendering a keypad that has neither. The parser must therefore accept every
 * separator a phone can actually produce, not just the two a desktop keyboard
 * makes convenient.
 */

function ok(raw: string): number[] {
  const result = parseArrayInput(raw);
  if (!result.ok) throw new Error(`expected success, got error: ${result.error}`);
  return result.values;
}

function err(raw: string): string {
  const result = parseArrayInput(raw);
  if (result.ok) throw new Error(`expected an error, got: [${result.values.join(', ')}]`);
  return result.error;
}

describe('parseArrayInput — separators a phone can produce', () => {
  const separators: { name: string; raw: string }[] = [
    { name: 'comma + space (desktop habit)', raw: '5, 2, 9, 1' },
    { name: 'comma only', raw: '5,2,9,1' },
    { name: 'space only', raw: '5 2 9 1' },
    { name: 'multiple spaces', raw: '5   2  9    1' },
    { name: 'newlines (pasted column)', raw: '5\n2\n9\n1' },
    { name: 'tabs', raw: '5\t2\t9\t1' },
    { name: 'period — the only separator on an iOS decimal keypad', raw: '5.2.9.1' },
    { name: 'hyphen', raw: '5-2-9-1' },
    { name: 'semicolon', raw: '5;2;9;1' },
    { name: 'slash', raw: '5/2/9/1' },
    { name: 'mixed junk', raw: '5, 2; 9 / 1' },
    { name: 'leading and trailing separators', raw: '  , 5, 2, 9, 1 ,  ' },
  ];

  for (const { name, raw } of separators) {
    it(`accepts ${name}`, () => {
      expect(ok(raw)).toEqual([5, 2, 9, 1]);
    });
  }

  it('accepts multi-digit numbers', () => {
    expect(ok('120, 7, 45')).toEqual([120, 7, 45]);
  });

  it('keeps duplicates and order exactly as typed', () => {
    expect(ok('3 1 3 2 1')).toEqual([3, 1, 3, 2, 1]);
  });

  it('accepts the maximum allowed count', () => {
    const raw = Array.from({ length: MAX_COUNT }, (_, i) => i + 1).join(' ');
    expect(ok(raw)).toHaveLength(MAX_COUNT);
  });
});

describe('parseArrayInput — rejections', () => {
  it('rejects an empty field', () => {
    expect(err('')).toMatch(/at least 2/i);
  });

  it('rejects whitespace only', () => {
    expect(err('     ')).toMatch(/at least 2/i);
  });

  it('rejects text with no digits at all', () => {
    expect(err('hello there')).toMatch(/at least 2/i);
  });

  it('rejects a single number — there is nothing to sort', () => {
    expect(err('42')).toMatch(/at least 2/i);
  });

  it('rejects more than the maximum', () => {
    const raw = Array.from({ length: MAX_COUNT + 1 }, () => '3').join(' ');
    expect(err(raw)).toMatch(new RegExp(`max ${MAX_COUNT}`, 'i'));
  });

  it('rejects zero, which would be an invisible bar', () => {
    expect(err('0 5 2')).toMatch(/above zero/i);
  });

  it('rejects a number too large to chart', () => {
    expect(err('5 99999999999999999999')).toMatch(/too large/i);
  });
});

describe('parseArrayInput — the original mobile dead end', () => {
  it('reads run-together digits as one number, not four', () => {
    // What a phone user got when the keypad gave them no separator key: they
    // typed 5 2 9 1 and the site saw the single number 5291.
    expect(err('5291')).toMatch(/at least 2/i);
  });

  it('succeeds as soon as any separator at all is present', () => {
    expect(ok('5291 4')).toEqual([5291, 4]);
  });
});
