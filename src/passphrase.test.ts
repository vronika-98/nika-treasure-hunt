import { describe, expect, it } from 'vitest';

import { isPassphraseMatch, normalizePassphrase } from './passphrase';

describe('normalizePassphrase', () => {
  it('uppercases and trims passphrases', () => {
    expect(normalizePassphrase('  hAllo  ')).toBe('HALLO');
  });
});

describe('isPassphraseMatch', () => {
  it('returns true for case-insensitive matches', () => {
    expect(isPassphraseMatch('gold', 'GOLD')).toBe(true);
  });

  it('returns false for non-matching values', () => {
    expect(isPassphraseMatch('gold', 'SILVER')).toBe(false);
  });
});
