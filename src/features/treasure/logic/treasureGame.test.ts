// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TREASURE_COPY } from '../content/copy';
import type { AppElements } from '../ui/dom';
import type { TreasureGameDependencies } from './treasureGame';
import { TreasureGame } from './treasureGame';

function createElements(): AppElements {
  const interactionZone = document.createElement('div');
  const passphraseLabel = document.createElement('label');
  const input = document.createElement('input');
  const inputWrap = document.createElement('div');
  const submitButton = document.createElement('button');
  const rainbowDisplay = document.createElement('div');
  const secretDisplay = document.createElement('p');
  const chestImg = document.createElement('img');

  secretDisplay.classList.add('hidden');

  document.body.append(
    interactionZone,
    passphraseLabel,
    input,
    inputWrap,
    submitButton,
    rainbowDisplay,
    secretDisplay,
    chestImg,
  );

  return {
    interactionZone,
    passphraseLabel,
    input,
    inputWrap,
    submitButton,
    rainbowDisplay,
    secretDisplay,
    chestImg,
  };
}

function createFakeDependencies(): TreasureGameDependencies {
  return {
    rainbowEffect: {
      update: vi.fn(),
      dispose: vi.fn(),
    },
    rumbleEffect: {
      trigger: vi.fn(),
      dispose: vi.fn(),
    },
    chestTransitionEffect: {
      toWhite: vi.fn().mockResolvedValue(undefined),
      dispose: vi.fn(),
    },
    starBurstEffect: {
      trigger: vi.fn(),
      dispose: vi.fn(),
    },
    audioController: {
      playSuccess: vi.fn(),
      playFailure: vi.fn(),
      dispose: vi.fn(),
    },
  };
}

describe('TreasureGame behavior', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('shows feedback and side effects on wrong passphrase', () => {
    const elements = createElements();
    const dependencies = createFakeDependencies();

    const game = new TreasureGame({
      elements,
      assetUrl: (fileName) => `/assets/${fileName}`,
      correctPassphrase: 'GOLD',
      dependencies,
    });

    game.start();
    elements.input.value = 'silver';
    elements.submitButton.click();

    expect(elements.passphraseLabel.textContent).toBe(TREASURE_COPY.wrongPassphrase);
    expect(dependencies.audioController.playFailure).toHaveBeenCalledTimes(1);
    expect(dependencies.rumbleEffect.trigger).toHaveBeenCalledTimes(1);
    expect(dependencies.chestTransitionEffect.toWhite).not.toHaveBeenCalled();
  });

  it('unlocks once for matching passphrase even with repeated submit events', async () => {
    const elements = createElements();
    const dependencies = createFakeDependencies();

    const game = new TreasureGame({
      elements,
      assetUrl: (fileName) => `/assets/${fileName}`,
      correctPassphrase: 'GOLD',
      dependencies,
    });

    game.start();
    elements.input.value = 'gold';

    const enterKey = new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
      cancelable: true,
    });

    elements.input.dispatchEvent(enterKey);
    elements.submitButton.click();

    await Promise.resolve();
    await Promise.resolve();

    expect(dependencies.chestTransitionEffect.toWhite).toHaveBeenCalledTimes(1);
    expect(dependencies.audioController.playSuccess).toHaveBeenCalledTimes(1);
    expect(dependencies.starBurstEffect.trigger).toHaveBeenCalledTimes(1);
    expect(elements.secretDisplay.classList.contains('hidden')).toBe(false);
  });

  it('removes listeners and disposes dependencies on destroy', () => {
    const elements = createElements();
    const dependencies = createFakeDependencies();

    const game = new TreasureGame({
      elements,
      assetUrl: (fileName) => `/assets/${fileName}`,
      correctPassphrase: 'GOLD',
      dependencies,
    });

    game.start();
    game.destroy();

    const updateCalls = (dependencies.rainbowEffect.update as ReturnType<typeof vi.fn>).mock.calls.length;

    elements.input.value = 'test';
    elements.input.dispatchEvent(new Event('input', { bubbles: true }));
    elements.submitButton.click();

    expect((dependencies.rainbowEffect.update as ReturnType<typeof vi.fn>).mock.calls.length).toBe(
      updateCalls,
    );
    expect(dependencies.rainbowEffect.dispose).toHaveBeenCalledTimes(1);
    expect(dependencies.rumbleEffect.dispose).toHaveBeenCalledTimes(1);
    expect(dependencies.chestTransitionEffect.dispose).toHaveBeenCalledTimes(1);
    expect(dependencies.starBurstEffect.dispose).toHaveBeenCalledTimes(1);
    expect(dependencies.audioController.dispose).toHaveBeenCalledTimes(1);
  });
});
