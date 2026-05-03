import './style.css'
import { renderApp } from './dom';
import { assetUrl, CORRECT_PASSPHRASE, SECRET_MESSAGE } from './env';
import { createChestStarBurst } from './particles/starBurst';
import { isPassphraseMatch } from './passphrase';

document.documentElement.style.setProperty('--bg-image', `url("${assetUrl('background.png')}")`);
document.documentElement.style.setProperty('--left-strip-image', `url("${assetUrl('vertical-strip-left.png')}")`);
document.documentElement.style.setProperty('--right-strip-image', `url("${assetUrl('vertical-strip-right.png')}")`);

console.debug('[debug] VITE_PASSPHRASE:', CORRECT_PASSPHRASE);
console.debug('[debug] VITE_SECRET_MESSAGE:', SECRET_MESSAGE);

const {
  interactionZone,
  passphraseLabel,
  input,
  inputWrap,
  submitButton,
  rainbowDisplay,
  secretDisplay,
  chestImg,
} = renderApp(assetUrl, SECRET_MESSAGE);
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
  if (isPassphraseMatch(input.value, CORRECT_PASSPHRASE)) {
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