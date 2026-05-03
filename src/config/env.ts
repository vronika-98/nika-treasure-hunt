import { PassphrasePolicy } from '../game/logic/passphrase';

function getRequiredEnv(name: 'VITE_PASSPHRASE' | 'VITE_SECRET_MESSAGE'): string {
  const value = import.meta.env[name];
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const assetUrl = (fileName: string): string => `${import.meta.env.BASE_URL}${fileName}`;

export const CORRECT_PASSPHRASE = getRequiredEnv('VITE_PASSPHRASE');
export const SECRET_MESSAGE = getRequiredEnv('VITE_SECRET_MESSAGE');

if (CORRECT_PASSPHRASE.length > PassphrasePolicy.MAX_LENGTH) {
  throw new Error(
    `VITE_PASSPHRASE must be at most ${PassphrasePolicy.MAX_LENGTH} characters long`,
  );
}
