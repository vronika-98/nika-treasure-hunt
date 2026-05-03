import { describe, expect, it } from 'vitest';

import {
  clampPassphraseInput,
  isPassphraseMatch,
  normalizePassphrase,
  PASSPHRASE_MAX_LENGTH,
} from './passphrase';

describe('clampPassphraseInput', () => {
  it('keeps values at or below max length', () => {
    expect(clampPassphraseInput('ABCDEFGHIJKLM')).toBe('ABCDEFGHIJKLM');
  });

  it('truncates values above max length', () => {
    expect(clampPassphraseInput('ABCDEFGHIJKLMN')).toHaveLength(PASSPHRASE_MAX_LENGTH);
    expect(clampPassphraseInput('ABCDEFGHIJKLMN')).toBe('ABCDEFGHIJKLM');
  });
});

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
