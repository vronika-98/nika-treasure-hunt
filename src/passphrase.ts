export function normalizePassphrase(value: string): string {
  return value.trim().toUpperCase();
}

export function isPassphraseMatch(inputValue: string, expectedValue: string): boolean {
  return normalizePassphrase(inputValue) === normalizePassphrase(expectedValue);
}
