export const PASSPHRASE_MAX_LENGTH = 13;

export function clampPassphraseInput(value: string): string {
  return value.slice(0, PASSPHRASE_MAX_LENGTH);
}

export function normalizePassphrase(value: string): string {
  return value.trim().toUpperCase();
}

export function isPassphraseMatch(inputValue: string, expectedValue: string): boolean {
  return normalizePassphrase(inputValue) === normalizePassphrase(expectedValue);
}
