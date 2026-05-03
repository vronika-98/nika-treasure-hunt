import type { AppElements } from './dom';
import { createChestStarBurst } from './particles/starBurst';
import { clampPassphraseInput, isPassphraseMatch, PASSPHRASE_MAX_LENGTH } from './passphrase';

type AssetUrlResolver = (fileName: string) => string;

type SetupTreasureGameOptions = {
  elements: AppElements;
  assetUrl: AssetUrlResolver;
  correctPassphrase: string;
};

const RAINBOW_COLORS = ['#ff2a2a', '#ff8c1a', '#ffd400', '#2ecc40', '#2a7fff', '#8f2aff'];

function updateRainbowDisplay(rainbowDisplay: HTMLDivElement, value: string): void {
  const normalized = value.toUpperCase();
  rainbowDisplay.textContent = '';

  for (let index = 0; index < normalized.length; index += 1) {
    const span = document.createElement('span');
    span.textContent = normalized[index];
    span.style.color = RAINBOW_COLORS[index % RAINBOW_COLORS.length];
    rainbowDisplay.appendChild(span);
  }
}

function triggerRumble(interactionZone: HTMLDivElement): void {
  interactionZone.classList.remove('rumble');
  void interactionZone.offsetWidth;
  interactionZone.classList.add('rumble');
}

function transitionChestToWhite(chestImg: HTMLImageElement): Promise<void> {
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

function playAudio(audio: HTMLAudioElement): void {
  audio.currentTime = 0;
  audio.play().catch(() => {
    // Ignore autoplay policy rejections if the browser blocks sound.
  });
}

export function setupTreasureGame({
  elements,
  assetUrl,
  correctPassphrase,
}: SetupTreasureGameOptions): void {
  const {
    interactionZone,
    passphraseLabel,
    input,
    inputWrap,
    submitButton,
    rainbowDisplay,
    secretDisplay,
    chestImg,
  } = elements;

  const triggerChestStarBurst = createChestStarBurst(chestImg);
  const wowAudio = new Audio(assetUrl('wow.mp3'));
  const failAudio = new Audio(assetUrl('fail.mp3'));
  wowAudio.preload = 'auto';
  failAudio.preload = 'auto';

  let isUnlocked = false;

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

    await transitionChestToWhite(chestImg);

    triggerChestStarBurst();
    playAudio(wowAudio);

    chestImg.src = assetUrl('treasure-chest-open.png');
    requestAnimationFrame(() => {
      chestImg.classList.remove('chest-white');
    });

    secretDisplay.classList.remove('hidden');
    console.log('Treasure Unlocked!');
  }

  function checkPassphrase(): void {
    if (isPassphraseMatch(input.value, correctPassphrase)) {
      revealSecret();
      return;
    }

    passphraseLabel.textContent = 'DAS WAR LEIDER FALSCH!';
    playAudio(failAudio);
    triggerRumble(interactionZone);
  }

  updateRainbowDisplay(rainbowDisplay, input.value);
  input.maxLength = PASSPHRASE_MAX_LENGTH;

  input.addEventListener('input', (event) => {
    const target = event.target as HTMLInputElement;
    const clampedValue = clampPassphraseInput(target.value);
    if (clampedValue !== target.value) {
      target.value = clampedValue;
    }

    updateRainbowDisplay(rainbowDisplay, target.value);
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      checkPassphrase();
    }
  });

  submitButton.addEventListener('click', () => {
    checkPassphrase();
  });
}
