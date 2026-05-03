import { PASSPHRASE_MAX_LENGTH } from '../game/logic/passphrase';

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

export function renderApp(assetUrl: AssetUrlResolver, secretMessage: string): AppElements {
  const app = getRequiredElement<HTMLDivElement>(document, '#app');

  app.innerHTML = `
    <div class="game-container">
      <div id="chest-wrapper" class="closed">
        <img id="chest-img" src="${assetUrl('treasure-chest-closed.png')}" alt="Treasure Chest">
      </div>

      <div id="interaction-zone">
        <label id="passphrase-label" for="passphrase-input">GEHEIMCODE EINGEBEN</label>
        <div id="passphrase-input-wrap">
          <div id="passphrase-rainbow" aria-hidden="true"></div>
          <input type="text" id="passphrase-input" autocomplete="off" spellcheck="false" maxlength="${PASSPHRASE_MAX_LENGTH}">
        </div>
        <button id="passphrase-submit" type="button">PRÜFEN</button>
        <p id="secret-display" class="hidden">${secretMessage}</p>
      </div>
    </div>
  `;

  return {
    interactionZone: getRequiredElement<HTMLDivElement>(app, '#interaction-zone'),
    passphraseLabel: getRequiredElement<HTMLLabelElement>(app, '#passphrase-label'),
    input: getRequiredElement<HTMLInputElement>(app, '#passphrase-input'),
    inputWrap: getRequiredElement<HTMLDivElement>(app, '#passphrase-input-wrap'),
    submitButton: getRequiredElement<HTMLButtonElement>(app, '#passphrase-submit'),
    rainbowDisplay: getRequiredElement<HTMLDivElement>(app, '#passphrase-rainbow'),
    secretDisplay: getRequiredElement<HTMLParagraphElement>(app, '#secret-display'),
    chestImg: getRequiredElement<HTMLImageElement>(app, '#chest-img'),
  };
}
