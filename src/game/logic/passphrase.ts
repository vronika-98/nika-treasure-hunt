export class PassphrasePolicy {
  static readonly MAX_LENGTH = 13;

  private readonly expectedPassphrase: string;

  constructor(expectedPassphrase: string) {
    this.expectedPassphrase = expectedPassphrase;
  }

  static clampInput(value: string): string {
    return value.slice(0, PassphrasePolicy.MAX_LENGTH);
  }

  static normalize(value: string): string {
    return value.trim().toUpperCase();
  }

  clampInput(value: string): string {
    return PassphrasePolicy.clampInput(value);
  }

  normalize(value: string): string {
    return PassphrasePolicy.normalize(value);
  }

  isMatch(inputValue: string): boolean {
    return this.normalize(inputValue) === this.normalize(this.expectedPassphrase);
  }
}
