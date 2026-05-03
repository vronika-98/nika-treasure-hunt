const RAINBOW_COLORS = ['#ff2a2a', '#ff8c1a', '#ffd400', '#2ecc40', '#2a7fff', '#8f2aff'];

export function updateRainbowDisplay(rainbowDisplay: HTMLDivElement, value: string): void {
  const normalized = value.toUpperCase();
  rainbowDisplay.textContent = '';

  for (let index = 0; index < normalized.length; index += 1) {
    const span = document.createElement('span');
    span.textContent = normalized[index];
    span.style.color = RAINBOW_COLORS[index % RAINBOW_COLORS.length];
    rainbowDisplay.appendChild(span);
  }
}
