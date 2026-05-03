import { PassphrasePolicy } from '../logic/passphrase';
import { TREASURE_COPY } from '../content/copy';
import { APP_ROOT_SELECTOR, APP_SELECTORS } from './selectors';

type AssetUrlResolver = (fileName: string) => string;

export type AppElements = {
  interactionZone: HTMLDivElement;
  passphraseLabel: HTMLLabelElement;
  input: HTMLInputElement;
  inputWrap: HTMLDivElement;
  submitButton: HTMLButtonElement;
  rainbowDisplay: HTMLDivElement;
  secretDisplay: HTMLParagraphElement;
  chestImg: HTMLImageElement;
};

export function getRequiredElement<T extends Element>(
  root: ParentNode,
  selector: string,
): T {
  const element = root.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Required element not found: ${selector}`);
  }

  return element;
}

function getAppElement<K extends keyof AppElements>(root: ParentNode, key: K): AppElements[K] {
  return getRequiredElement<AppElements[K]>(root, APP_SELECTORS[key]);
}

export function renderApp(assetUrl: AssetUrlResolver, secretMessage: string): AppElements {
  const app = getRequiredElement<HTMLDivElement>(document, APP_ROOT_SELECTOR);

  app.innerHTML = `
    <div class="game-container">
      <div id="chest-wrapper" class="closed">
        <img id="chest-img" src="${assetUrl('treasure-chest-closed.png')}" alt="${TREASURE_COPY.chestAlt}">
      </div>

      <div id="interaction-zone">
        <label id="passphrase-label" for="passphrase-input">${TREASURE_COPY.passphrasePrompt}</label>
        <div id="passphrase-input-wrap">
          <div id="passphrase-rainbow" aria-hidden="true"></div>
          <input type="text" id="passphrase-input" autocomplete="off" spellcheck="false" maxlength="${PassphrasePolicy.MAX_LENGTH}">
        </div>
        <button id="passphrase-submit" type="button">${TREASURE_COPY.submitLabel}</button>
        <p id="secret-display" class="hidden">${secretMessage}</p>
      </div>
    </div>
  `;

  return {
    interactionZone: getAppElement(app, 'interactionZone'),
    passphraseLabel: getAppElement(app, 'passphraseLabel'),
    input: getAppElement(app, 'input'),
    inputWrap: getAppElement(app, 'inputWrap'),
    submitButton: getAppElement(app, 'submitButton'),
    rainbowDisplay: getAppElement(app, 'rainbowDisplay'),
    secretDisplay: getAppElement(app, 'secretDisplay'),
    chestImg: getAppElement(app, 'chestImg'),
  };
}
