const RAINBOW_COLORS = ['#ff2a2a', '#ff8c1a', '#ffd400', '#2ecc40', '#2a7fff', '#8f2aff'];

export class RainbowDisplayEffect {
  private readonly rainbowDisplay: HTMLDivElement;

  constructor(rainbowDisplay: HTMLDivElement) {
    this.rainbowDisplay = rainbowDisplay;
  }

  update(value: string): void {
    const normalized = value.toUpperCase();
    this.rainbowDisplay.textContent = '';

    for (let index = 0; index < normalized.length; index += 1) {
      const span = document.createElement('span');
      span.textContent = normalized[index];
      span.style.color = RAINBOW_COLORS[index % RAINBOW_COLORS.length];
      this.rainbowDisplay.appendChild(span);
    }
  }
}
