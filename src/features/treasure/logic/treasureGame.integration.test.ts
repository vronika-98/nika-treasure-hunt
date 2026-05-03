// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { TreasureGameDependencies } from './treasureGame';
import { TreasureGame } from './treasureGame';
import { renderApp } from '../ui/dom';

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

describe('Treasure feature integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
  });

  it('renders app and unlocks secret through UI flow', async () => {
    const dependencies = createFakeDependencies();
    const elements = renderApp((fileName) => `/assets/${fileName}`, 'TOP SECRET');

    const game = new TreasureGame({
      elements,
      assetUrl: (fileName) => `/assets/${fileName}`,
      correctPassphrase: 'GOLD',
      dependencies,
    });

    game.start();

    elements.input.value = 'gold';
    elements.input.dispatchEvent(new Event('input', { bubbles: true }));
    elements.submitButton.click();

    await Promise.resolve();
    await Promise.resolve();

    expect(elements.input.maxLength).toBe(13);
    expect(elements.inputWrap.classList.contains('hidden')).toBe(true);
    expect(elements.submitButton.classList.contains('hidden')).toBe(true);
    expect(elements.secretDisplay.classList.contains('hidden')).toBe(false);
    expect(elements.secretDisplay.textContent).toBe('TOP SECRET');
    expect(dependencies.audioController.playSuccess).toHaveBeenCalledTimes(1);
    expect(dependencies.starBurstEffect.trigger).toHaveBeenCalledTimes(1);
  });
});
