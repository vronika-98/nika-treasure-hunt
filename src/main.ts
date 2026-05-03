import './style.css'
import { assetUrl, CORRECT_PASSPHRASE, SECRET_MESSAGE } from './config/env';
import { TreasureGame } from './game/logic/treasureGame';
import { renderApp } from './ui/dom';
import { applyThemeImages } from './ui/theme';

applyThemeImages(assetUrl);

console.debug('[debug] VITE_PASSPHRASE:', CORRECT_PASSPHRASE);
console.debug('[debug] VITE_SECRET_MESSAGE:', SECRET_MESSAGE);

const elements = renderApp(assetUrl, SECRET_MESSAGE);

const game = new TreasureGame({
  elements,
  assetUrl,
  correctPassphrase: CORRECT_PASSPHRASE,
});

game.start();