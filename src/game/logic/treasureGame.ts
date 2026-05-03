import { GameAudioController } from '../audio/audio';
import { ChestTransitionEffect } from '../effects/chestTransition';
import { RainbowDisplayEffect } from '../effects/rainbowDisplay';
import { RumbleEffect } from '../effects/rumble';
import { StarBurstEffect } from '../effects/starBurst';
import type { AppElements } from '../../ui/dom';
import { PassphrasePolicy } from './passphrase';

type AssetUrlResolver = (fileName: string) => string;

type SetupTreasureGameOptions = {
  elements: AppElements;
  assetUrl: AssetUrlResolver;
  correctPassphrase: string;
};

export class TreasureGame {
  private readonly elements: AppElements;
  private readonly assetUrl: AssetUrlResolver;
  private readonly passphrasePolicy: PassphrasePolicy;
  private readonly rainbowEffect: RainbowDisplayEffect;
  private readonly rumbleEffect: RumbleEffect;
  private readonly chestTransitionEffect: ChestTransitionEffect;
  private readonly starBurstEffect: StarBurstEffect;
  private readonly audioController: GameAudioController;
  private isUnlocked = false;

  constructor({ elements, assetUrl, correctPassphrase }: SetupTreasureGameOptions) {
    this.elements = elements;
    this.assetUrl = assetUrl;
    this.passphrasePolicy = new PassphrasePolicy(correctPassphrase);
    this.rainbowEffect = new RainbowDisplayEffect(this.elements.rainbowDisplay);
    this.rumbleEffect = new RumbleEffect(this.elements.interactionZone);
    this.chestTransitionEffect = new ChestTransitionEffect(this.elements.chestImg);
    this.starBurstEffect = new StarBurstEffect(this.elements.chestImg);
    this.audioController = new GameAudioController(assetUrl);
  }

  start(): void {
    this.rainbowEffect.update(this.elements.input.value);
    this.elements.input.maxLength = PassphrasePolicy.MAX_LENGTH;

    this.elements.input.addEventListener('input', this.handleInput);
    this.elements.input.addEventListener('keydown', this.handleKeyDown);
    this.elements.submitButton.addEventListener('click', this.handleSubmitClick);
  }

  private handleInput = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    const clampedValue = this.passphrasePolicy.clampInput(target.value);
    if (clampedValue !== target.value) {
      target.value = clampedValue;
    }

    this.rainbowEffect.update(target.value);
  };

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.checkPassphrase();
    }
  };

  private handleSubmitClick = (): void => {
    this.checkPassphrase();
  };

  private async revealSecret(): Promise<void> {
    if (this.isUnlocked) {
      return;
    }

    this.isUnlocked = true;
    this.elements.passphraseLabel.hidden = true;
    this.elements.passphraseLabel.setAttribute('aria-hidden', 'true');
    this.elements.passphraseLabel.classList.add('hidden');
    this.elements.inputWrap.classList.add('hidden');
    this.elements.submitButton.classList.add('hidden');

    await this.chestTransitionEffect.toWhite();

    this.starBurstEffect.trigger();
    this.audioController.playSuccess();

    this.elements.chestImg.src = this.assetUrl('treasure-chest-open.png');
    requestAnimationFrame(() => {
      this.elements.chestImg.classList.remove('chest-white');
    });

    this.elements.secretDisplay.classList.remove('hidden');
    console.log('Treasure Unlocked!');
  }

  private checkPassphrase(): void {
    if (this.passphrasePolicy.isMatch(this.elements.input.value)) {
      void this.revealSecret();
      return;
    }

    this.elements.passphraseLabel.textContent = 'DAS WAR LEIDER FALSCH!';
    this.audioController.playFailure();
    this.rumbleEffect.trigger();
  }
}

export function setupTreasureGame(options: SetupTreasureGameOptions): TreasureGame {
  const game = new TreasureGame(options);
  game.start();

  return game;
}
