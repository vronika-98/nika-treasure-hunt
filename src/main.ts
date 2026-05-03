import './style.css'
import { createChestStarBurst } from './particles/starBurst';

const assetUrl = (fileName: string): string => `${import.meta.env.BASE_URL}${fileName}`;

document.documentElement.style.setProperty('--bg-image', `url("${assetUrl('background.png')}")`);
document.documentElement.style.setProperty('--left-strip-image', `url("${assetUrl('vertical-strip-left.png')}")`);
document.documentElement.style.setProperty('--right-strip-image', `url("${assetUrl('vertical-strip-right.png')}")`);

// Fetch variables from the environment (injected during build)
const CORRECT_PASSPHRASE = import.meta.env.VITE_PASSPHRASE;
const SECRET_MESSAGE = import.meta.env.VITE_SECRET_MESSAGE;

const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
  <div class="game-container">    
    <div id="chest-wrapper" class="closed">
      <img id="chest-img" src="${assetUrl('treasure-chest-closed.png')}" alt="Treasure Chest">
    </div>

    <div id="interaction-zone">
      <label id="passphrase-label" for="passphrase-input">GEHEIMCODE EINGEBEN</label>
      <div id="passphrase-input-wrap">
        <div id="passphrase-rainbow" aria-hidden="true"></div>
        <input type="text" id="passphrase-input" autocomplete="off" spellcheck="false">
      </div>
      <button id="passphrase-submit" type="button">PRÜFEN</button>
      <p id="secret-display" class="hidden">${SECRET_MESSAGE}</p>
    </div>
  </div>
`;

const interactionZone = document.querySelector<HTMLDivElement>('#interaction-zone')!;
const passphraseLabel = document.querySelector<HTMLLabelElement>('#passphrase-label')!;
const input = document.querySelector<HTMLInputElement>('#passphrase-input')!;
const inputWrap = document.querySelector<HTMLDivElement>('#passphrase-input-wrap')!;
const submitButton = document.querySelector<HTMLButtonElement>('#passphrase-submit')!;
const rainbowDisplay = document.querySelector<HTMLDivElement>('#passphrase-rainbow')!;
const secretDisplay = document.querySelector<HTMLParagraphElement>('#secret-display')!;
const chestImg = document.querySelector<HTMLImageElement>('#chest-img')!;
const triggerChestStarBurst = createChestStarBurst(chestImg);
const wowAudio = new Audio(assetUrl('wow.mp3'));
const failAudio = new Audio(assetUrl('fail.mp3'));
wowAudio.preload = 'auto';
failAudio.preload = 'auto';

let isUnlocked = false;

const RAINBOW_COLORS = ['#ff2a2a', '#ff8c1a', '#ffd400', '#2ecc40', '#2a7fff', '#8f2aff'];

function updateRainbowDisplay(value: string): void {
  const normalized = value.toUpperCase();
  rainbowDisplay.textContent = '';

  for (let index = 0; index < normalized.length; index += 1) {
    const span = document.createElement('span');
    span.textContent = normalized[index];
    span.style.color = RAINBOW_COLORS[index % RAINBOW_COLORS.length];
    rainbowDisplay.appendChild(span);
  }
}

updateRainbowDisplay(input.value);

function triggerRumble(): void {
  interactionZone.classList.remove('rumble');
  void interactionZone.offsetWidth;
  interactionZone.classList.add('rumble');
}

function transitionChestToWhite(): Promise<void> {
  return new Promise((resolve) => {
    let settled = false;

    const finish = (): void => {
      if (settled) {
        return;
      }

      settled = true;
      chestImg.removeEventListener('transitionend', onTransitionEnd);
      resolve();
    };

    const onTransitionEnd = (event: TransitionEvent): void => {
      if (event.propertyName === 'filter') {
        finish();
      }
    };

    chestImg.classList.add('chest-white');
    chestImg.addEventListener('transitionend', onTransitionEnd);

    window.setTimeout(finish, 320);
  });
}

async function revealSecret(): Promise<void> {
  if (isUnlocked) {
    return;
  }

  isUnlocked = true;
  passphraseLabel.hidden = true;
  passphraseLabel.setAttribute('aria-hidden', 'true');
  passphraseLabel.classList.add('hidden');
  inputWrap.classList.add('hidden');
  submitButton.classList.add('hidden');

  await transitionChestToWhite();

  triggerChestStarBurst();
  wowAudio.currentTime = 0;
  wowAudio.play().catch(() => {
    // Ignore autoplay policy rejections if the browser blocks sound.
  });

  chestImg.src = assetUrl('treasure-chest-open.png');
  requestAnimationFrame(() => {
    chestImg.classList.remove('chest-white');
  });

  secretDisplay.classList.remove('hidden');
  console.log('Treasure Unlocked!');
}

function checkPassphrase(): void {
  if (input.value.toUpperCase() === CORRECT_PASSPHRASE.toUpperCase()) {
    revealSecret();
    return;
  }

  passphraseLabel.textContent = 'FALSCH DU TROTTEL';
  failAudio.currentTime = 0;
  failAudio.play().catch(() => {
    // Ignore autoplay policy rejections if the browser blocks sound.
  });
  triggerRumble();
}

input.addEventListener('input', (e) => {
  const target = e.target as HTMLInputElement;
  updateRainbowDisplay(target.value);
});

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    checkPassphrase();
  }
});

submitButton.addEventListener('click', () => {
  checkPassphrase();
});