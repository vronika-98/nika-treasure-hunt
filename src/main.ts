import './style.css'
import { assetUrl, CORRECT_PASSPHRASE, SECRET_MESSAGE } from './features/treasure/config/env';
import { TreasureGame } from './features/treasure/logic/treasureGame';
import { renderApp } from './features/treasure/ui/dom';
import { applyThemeImages } from './features/treasure/ui/theme';

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