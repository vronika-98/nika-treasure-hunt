import './style.css'
import { renderApp } from './dom';
import { assetUrl, CORRECT_PASSPHRASE, SECRET_MESSAGE } from './env';
import { applyThemeImages } from './theme';
import { setupTreasureGame } from './treasureGame';

applyThemeImages(assetUrl);

console.debug('[debug] VITE_PASSPHRASE:', CORRECT_PASSPHRASE);
console.debug('[debug] VITE_SECRET_MESSAGE:', SECRET_MESSAGE);

const elements = renderApp(assetUrl, SECRET_MESSAGE);

setupTreasureGame({
  elements,
  assetUrl,
  correctPassphrase: CORRECT_PASSPHRASE,
});