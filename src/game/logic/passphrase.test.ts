import { describe, expect, it } from 'vitest';

import { PassphrasePolicy } from './passphrase';

const policy = new PassphrasePolicy('GOLD');

describe('PassphrasePolicy.clampInput', () => {
  it('keeps values at or below max length', () => {
    expect(PassphrasePolicy.clampInput('ABCDEFGHIJKLM')).toBe('ABCDEFGHIJKLM');
  });

  it('truncates values above max length', () => {
    expect(PassphrasePolicy.clampInput('ABCDEFGHIJKLMN')).toHaveLength(PassphrasePolicy.MAX_LENGTH);
    expect(PassphrasePolicy.clampInput('ABCDEFGHIJKLMN')).toBe('ABCDEFGHIJKLM');
  });
});

describe('PassphrasePolicy.normalize', () => {
  it('uppercases and trims passphrases', () => {
    expect(PassphrasePolicy.normalize('  hAllo  ')).toBe('HALLO');
  });
});

describe('PassphrasePolicy#isMatch', () => {
  it('returns true for case-insensitive matches', () => {
    expect(policy.isMatch('gold')).toBe(true);
  });

  it('returns false for non-matching values', () => {
    expect(policy.isMatch('SILVER')).toBe(false);
  });
});
