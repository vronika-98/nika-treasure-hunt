import { GameAudioController } from '../audio/audio';
import { TREASURE_COPY } from '../content/copy';
import { ChestTransitionEffect } from '../effects/chestTransition';
import { RainbowDisplayEffect } from '../effects/rainbowDisplay';
import { RumbleEffect } from '../effects/rumble';
import { StarBurstEffect } from '../effects/starBurst';
import type { AppElements } from '../ui/dom';
import { PassphrasePolicy } from './passphrase';

type AssetUrlResolver = (fileName: string) => string;

type SetupTreasureGameOptions = {
  elements: AppElements;
  assetUrl: AssetUrlResolver;
  correctPassphrase: string;
  dependencies?: Partial<TreasureGameDependencies>;
};

type RainbowEffect = {
  update: (value: string) => void;
  dispose: () => void;
};

type RumbleGameEffect = {
  trigger: () => void;
  dispose: () => void;
};

type ChestEffect = {
  toWhite: () => Promise<void>;
  dispose: () => void;
};

type StarEffect = {
  trigger: () => void;
  dispose: () => void;
};

type AudioController = {
  playSuccess: () => void;
  playFailure: () => void;
  dispose: () => void;
};

export type TreasureGameDependencies = {
  rainbowEffect: RainbowEffect;
  rumbleEffect: RumbleGameEffect;
  chestTransitionEffect: ChestEffect;
  starBurstEffect: StarEffect;
  audioController: AudioController;
};

export class TreasureGame {
  private readonly elements: AppElements;
  private readonly assetUrl: AssetUrlResolver;
  private readonly passphrasePolicy: PassphrasePolicy;
  private readonly rainbowEffect: RainbowEffect;
  private readonly rumbleEffect: RumbleGameEffect;
  private readonly chestTransitionEffect: ChestEffect;
  private readonly starBurstEffect: StarEffect;
  private readonly audioController: AudioController;
  private openChestFrameId: number | null = null;
  private isStarted = false;
  private isDisposed = false;
  private isUnlocked = false;

  constructor({ elements, assetUrl, correctPassphrase, dependencies = {} }: SetupTreasureGameOptions) {
    this.elements = elements;
    this.assetUrl = assetUrl;
    this.passphrasePolicy = new PassphrasePolicy(correctPassphrase);

    const defaultDependencies: TreasureGameDependencies = {
      rainbowEffect: new RainbowDisplayEffect(this.elements.rainbowDisplay),
      rumbleEffect: new RumbleEffect(this.elements.interactionZone),
      chestTransitionEffect: new ChestTransitionEffect(this.elements.chestImg),
      starBurstEffect: new StarBurstEffect(this.elements.chestImg),
      audioController: new GameAudioController(assetUrl),
    };

    this.rainbowEffect = dependencies.rainbowEffect ?? defaultDependencies.rainbowEffect;
    this.rumbleEffect = dependencies.rumbleEffect ?? defaultDependencies.rumbleEffect;
    this.chestTransitionEffect =
      dependencies.chestTransitionEffect ?? defaultDependencies.chestTransitionEffect;
    this.starBurstEffect = dependencies.starBurstEffect ?? defaultDependencies.starBurstEffect;
    this.audioController = dependencies.audioController ?? defaultDependencies.audioController;
  }

  start(): void {
    if (this.isStarted || this.isDisposed) {
      return;
    }

    this.isStarted = true;
    this.rainbowEffect.update(this.elements.input.value);
    this.elements.input.maxLength = PassphrasePolicy.MAX_LENGTH;

    this.elements.input.addEventListener('input', this.handleInput);
    this.elements.input.addEventListener('keydown', this.handleKeyDown);
    this.elements.submitButton.addEventListener('click', this.handleSubmitClick);
  }

  destroy(): void {
    if (!this.isStarted || this.isDisposed) {
      return;
    }

    this.isDisposed = true;

    this.elements.input.removeEventListener('input', this.handleInput);
    this.elements.input.removeEventListener('keydown', this.handleKeyDown);
    this.elements.submitButton.removeEventListener('click', this.handleSubmitClick);

    if (this.openChestFrameId !== null) {
      cancelAnimationFrame(this.openChestFrameId);
      this.openChestFrameId = null;
    }

    this.rainbowEffect.dispose();
    this.rumbleEffect.dispose();
    this.chestTransitionEffect.dispose();
    this.starBurstEffect.dispose();
    this.audioController.dispose();
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
    if (this.isUnlocked || this.isDisposed) {
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
    this.openChestFrameId = requestAnimationFrame(() => {
      if (this.isDisposed) {
        return;
      }

      this.elements.chestImg.classList.remove('chest-white');
    });

    this.elements.secretDisplay.classList.remove('hidden');
    console.log('Treasure Unlocked!');
  }

  private checkPassphrase(): void {
    if (this.isDisposed) {
      return;
    }

    if (this.passphrasePolicy.isMatch(this.elements.input.value)) {
      void this.revealSecret();
      return;
    }

    this.elements.passphraseLabel.textContent = TREASURE_COPY.wrongPassphrase;
    this.audioController.playFailure();
    this.rumbleEffect.trigger();
  }
}

export function setupTreasureGame(options: SetupTreasureGameOptions): TreasureGame {
  const game = new TreasureGame(options);
  game.start();

  return game;
}
