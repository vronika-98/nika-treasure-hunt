export class RumbleEffect {
  private readonly interactionZone: HTMLDivElement;

  constructor(interactionZone: HTMLDivElement) {
    this.interactionZone = interactionZone;
  }

  trigger(): void {
    this.interactionZone.classList.remove('rumble');
    void this.interactionZone.offsetWidth;
    this.interactionZone.classList.add('rumble');
  }
}
