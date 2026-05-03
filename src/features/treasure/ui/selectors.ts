import type { AppElements } from './dom';

export const APP_ROOT_SELECTOR = '#app';

export const APP_SELECTORS = {
  interactionZone: '#interaction-zone',
  passphraseLabel: '#passphrase-label',
  input: '#passphrase-input',
  inputWrap: '#passphrase-input-wrap',
  submitButton: '#passphrase-submit',
  rainbowDisplay: '#passphrase-rainbow',
  secretDisplay: '#secret-display',
  chestImg: '#chest-img',
} as const satisfies Record<keyof AppElements, string>;
