import { createGameAudio, playAudio } from '../audio/audio';
import { transitionChestToWhite } from '../effects/chestTransition';
import { triggerRumble } from '../effects/rumble';
import { updateRainbowDisplay } from '../effects/rainbowDisplay';
import { createChestStarBurst } from '../effects/starBurst';
import type { AppElements } from '../../ui/dom';
import { clampPassphraseInput, isPassphraseMatch, PASSPHRASE_MAX_LENGTH } from './passphrase';

type AssetUrlResolver = (fileName: string) => string;

type SetupTreasureGameOptions = {
  elements: AppElements;
  assetUrl: AssetUrlResolver;
  correctPassphrase: string;
};

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
  const { wowAudio, failAudio } = createGameAudio(assetUrl);

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
